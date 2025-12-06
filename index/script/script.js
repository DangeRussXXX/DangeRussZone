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

// GOOGLE SEARCH
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const luckyButton = document.getElementById('luckyButton');

// Perform Google search
searchButton.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (query) {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank");
  }
});

// Enter key triggers search
searchInput.addEventListener('keydown', (e) => {
  if (e.key === "Enter") searchButton.click();
});

// I'm Feeling Lucky (go to first result)
luckyButton.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (query) {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}&btnI=1`, "_blank");
  }
});

// Voice Search (Web Speech API)
document.querySelector('.mic-icon').addEventListener('click', () => {
  if (!('webkitSpeechRecognition' in window)) {
    alert("Your browser doesn't support voice search.");
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.start();

  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    searchInput.value = transcript;
    searchButton.click();
  };
});
