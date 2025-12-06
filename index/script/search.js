document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  const luckyButton = document.getElementById('luckyButton');
  const mic = document.querySelector('.mic-icon');

  if (!searchInput || !searchButton) return; // stops errors if search bar isn't on the page

  // Google Search
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

  // I'm Feeling Lucky
  if (luckyButton) {
    luckyButton.addEventListener('click', () => {
      const query = searchInput.value.trim();
      if (query) {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}&btnI=1`, "_blank");
      }
    });
  }

  // Voice Search
  if (mic) {
    mic.addEventListener('click', () => {
      if (!('webkitSpeechRecognition' in window)) {
        alert("Voice search not supported in this browser.");
        return;
      }

      const recognition = new webkitSpeechRecognition();
      recognition.lang = "en-US";
      recognition.start();

      recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        searchInput.value = transcript;
        searchButton.click();
      };
    });
  }
});
