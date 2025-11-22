document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("featureVideo");
  const picture = document.getElementById("pictureElement");  // The image that will unmute the video
  const icon = document.getElementById("speakerIcon");  // Keep the icon for reference, if needed

  // Ensure volume is normal and the video starts muted
  video.volume = 1.0;
  video.muted = true;
  icon.textContent = "🔇";  // Initial speaker icon text

  // Add a click event listener to the picture element
  picture.addEventListener("click", () => {
    console.log('Picture clicked, current mute state:', video.muted);

    // If the video is muted, unmute it
    if (video.muted) {
      video.muted = false;

      // Force the video to play (this may be necessary due to autoplay restrictions in browsers)
      video.play().then(() => {
        console.log("Video unmuted and playing");
      }).catch(err => {
        console.warn("Browser blocked playback:", err);
      });

      // Update icon to indicate unmuted state
      icon.textContent = "🔊";
      icon.classList.add("unmuted");
      console.log("Video unmuted, icon updated to 🔊");
    } else {
      // If the video is unmuted, mute it
      video.muted = true;
      icon.textContent = "🔇";
      icon.classList.remove("unmuted");
      console.log("Video muted, icon updated to 🔇");
    }
  });
});
// Manual left/right crop slider
const video = document.getElementById('featureVideo');
const range = document.getElementById('cropRange');

// Initialize center
video.style.objectPosition = '50% center';

range.addEventListener('input', () => {
  const posX = range.value + '%'; // 0% = full left, 100% = full right
  video.style.objectPosition = `${posX} center`;
});
