document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById('searchInput');
  const searchTrigger = document.getElementById('searchTrigger');
  const mic = document.querySelector('.mic-icon');

  if (!searchInput || !searchTrigger) return;

  // Clicking the danger button triggers Google search
  searchTrigger.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default link jump
    const query = searchInput.value.trim();
    if (query) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank");
    }
  });

  // Pressing Enter in the input triggers the same search
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === "Enter") searchTrigger.click();
  });

  // Optional: Voice search
  if (mic && 'webkitSpeechRecognition' in window) {
    mic.addEventListener('click', () => {
      const recognition = new webkitSpeechRecognition();
      recognition.lang = "en-US";
      recognition.start();

      recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        searchInput.value = transcript;
        searchTrigger.click();
      };
    });
  }
});
