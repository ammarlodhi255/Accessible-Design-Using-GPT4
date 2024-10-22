document.addEventListener("DOMContentLoaded", () => {
  const languageButton = document.getElementById("language-button");
  const languageList = document.getElementById("language-list");
  const languageOptions = document.querySelectorAll(".language-option");
  let expanded = false;
  let currentOptionIndex = 0;
  let searchString = "";
  let searchTimeout;
  let lastKey = "";
  let cycleIndex = 0;

  // Focus on the button to capture keydown events when dropdown is opened
  function toggleDropdown(show) {
    expanded = show;
    languageButton.setAttribute("aria-expanded", expanded);
    languageList.style.display = expanded ? "block" : "none";

    // If the dropdown is opened, focus remains on the combobox button
    if (expanded) {
      languageButton.focus(); // Keep focus on the button
      setActiveDescendant(currentOptionIndex);
    }
  }

  // Set the active option in the dropdown (with visual and accessibility focus)
  function setActiveDescendant(index) {
    languageOptions.forEach((option) => {
      option.classList.remove("active");
      option.setAttribute("aria-selected", "false");
    });

    languageOptions[index].classList.add("active");
    languageOptions[index].setAttribute("aria-selected", "true");
    languageButton.setAttribute(
      "aria-activedescendant",
      languageOptions[index].id
    );
    languageOptions[index].scrollIntoView({ block: "nearest" });
    currentOptionIndex = index;
  }

  // Handle keydown events for navigation and character typing
  languageButton.addEventListener("keydown", (event) => {
    const key = event.key;

    if (key === "ArrowDown") {
      if (!expanded) {
        toggleDropdown(true);
      } else {
        // Move to the next option only if it's not the last option
        if (currentOptionIndex < languageOptions.length - 1) {
          setActiveDescendant(currentOptionIndex + 1);
        }
      }
      event.preventDefault();
    } else if (key === "ArrowUp") {
      if (!expanded) {
        toggleDropdown(true);
      } else {
        // Move to the previous option only if it's not the first option
        if (currentOptionIndex > 0) {
          setActiveDescendant(currentOptionIndex - 1);
        }
      }
      event.preventDefault();
    } else if (key === "Enter" || key === " ") {
      // On Enter or Space, select the current option
      if (expanded) {
        selectOption(currentOptionIndex);
        toggleDropdown(false);
      } else {
        toggleDropdown(true); // Open dropdown if it's not already expanded
      }
      event.preventDefault();
    } else if (key === "Escape") {
      toggleDropdown(false);
      event.preventDefault();
    } else if (key === "Tab") {
      // Close the dropdown and select the current option on Tab key
      languageButton.textContent =
        languageOptions[currentOptionIndex].textContent;
      toggleDropdown(false);
    } else if (/^[a-zA-Z]$/.test(key)) {
      handleTypeAheadSearch(key.toLowerCase());
      event.preventDefault();
    }
  });

  function selectOption(index) {
    languageButton.textContent = languageOptions[index].textContent;
    languageOptions.forEach((option) =>
      option.setAttribute("aria-selected", "false")
    );
    languageOptions[index].setAttribute("aria-selected", "true");
    languageButton.setAttribute(
      "aria-activedescendant",
      languageOptions[index].id
    );
    currentOptionIndex = index;
  }

  function handleTypeAheadSearch(char) {
    clearTimeout(searchTimeout);

    // Check if the character typed is the same as the last key pressed
    if (char === lastKey) {
      cycleIndex = (cycleIndex + 1) % languageOptions.length;
      for (let i = 0; i < languageOptions.length; i++) {
        const optionText = languageOptions[cycleIndex].textContent
          .trim()
          .toLowerCase();
        if (optionText.startsWith(char)) {
          setActiveDescendant(cycleIndex);
          break;
        }
        cycleIndex = (cycleIndex + 1) % languageOptions.length;
      }
    } else {
      searchString += char;
      lastKey = char;
      let matchingIndex = -1;

      if (!expanded) {
        toggleDropdown(true);
      }

      for (let i = 0; i < languageOptions.length; i++) {
        const optionText = languageOptions[i].textContent.trim().toLowerCase();
        if (optionText.startsWith(searchString)) {
          matchingIndex = i;
          break;
        }
      }

      if (matchingIndex !== -1) {
        setActiveDescendant(matchingIndex);
        cycleIndex = matchingIndex;
      }
    }

    searchTimeout = setTimeout(() => {
      searchString = "";
      lastKey = "";
    }, 1000);
  }

  // Click event to toggle dropdown
  languageButton.addEventListener("click", () => {
    toggleDropdown(!expanded);
  });

  // Handle mouse click for option selection
  languageOptions.forEach((option, index) => {
    option.addEventListener("click", () => {
      selectOption(index);
      toggleDropdown(false);
    });
  });

  // Close dropdown if user clicks outside
  document.addEventListener("click", (event) => {
    if (
      !languageButton.contains(event.target) &&
      !languageList.contains(event.target)
    ) {
      languageButton.textContent =
        languageOptions[currentOptionIndex].textContent;
      toggleDropdown(false);
    }
  });
});

// SLides
let currentSlide = 1;
const slides = document.querySelectorAll(".slide");

function showSlide(slideIndex) {
  slides.forEach((slide, index) => {
    slide.style.display = index + 1 === slideIndex ? "block" : "none";
  });
}

function prevSlide() {
  currentSlide = currentSlide === 1 ? slides.length : currentSlide - 1;
  showSlide(currentSlide);
}

function nextSlide() {
  currentSlide = currentSlide === slides.length ? 1 : currentSlide + 1;
  showSlide(currentSlide);
}

function playVideo(slideIndex) {
  // Hide all slides (images and play buttons)
  const slides = document.querySelectorAll(".slide");
  slides.forEach((slide) => {
    slide.style.display = "none";
  });

  // Hide all videos initially
  const videos = document.querySelectorAll(".hero-video");
  videos.forEach((video) => {
    video.style.display = "none";
    video.pause(); // Stop any video that might be playing
  });

  // Show the selected video based on the slide index and play it
  const selectedVideo = document.getElementById(`video${slideIndex}`);
  selectedVideo.style.display = "block";
  selectedVideo.play();
}

showSlide(currentSlide);

// Trending
let position = 0; // Current position of the carousel (0 for first 6, -100% for the next 6)
const totalItems = 12;
const visibleItems = 6;
const carouselItems = document.querySelector(".carousel-items");

function slideCarousel() {
  // Toggle between first 6 and next 6 items
  position = position === 0 ? -100 : 0; // Move to the left (show the next 6 items) or back to the right
  carouselItems.style.transform = `translateX(${position}%)`;
}

// Automatic sliding every 4 seconds
setInterval(slideCarousel, 4000);

// Get all language options
const languageOptions = document.querySelectorAll(".language-option");
const languageButton = document.getElementById("language-button");
const dropdownContent = document.querySelector(".dropdown-content");

// Add event listeners to each language option
languageOptions.forEach((option) => {
  option.addEventListener("click", function (e) {
    e.preventDefault(); // Prevent the default link behavior

    // Set the language button text to the selected language
    languageButton.textContent = this.textContent;

    // Automatically close the dropdown after selection
    dropdownContent.style.display = "none";
  });
});

// Handle dropdown visibility with hover (reopen it on hover)
const dropdown = document.querySelector(".dropdown");

// When hovering over the dropdown, make sure it shows again
dropdown.addEventListener("mouseenter", function () {
  dropdownContent.style.display = "block"; // Reopen on hover
});

dropdown.addEventListener("mouseleave", function () {
  dropdownContent.style.display = "none"; // Close when not hovering
});

// Function to open the modal
function openModal(modalId) {
  document.getElementById(modalId).style.display = "block";
}

// Function to close the modal
function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

// Close modal if the user clicks outside of the modal content
window.onclick = function (event) {
  if (event.target.classList.contains("modal")) {
    event.target.style.display = "none";
  }
};
