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

let currentIndex = 0; // Current index for the carousel
const visibleItems = 6; // Number of items visible in one slide
const totalItems = 12; // Total number of items in the carousel
const carouselItems = document.querySelector(".carousel-items");
const trendingItems = document.querySelectorAll(".trending-item");

// Function to slide the carousel to the next set of items
function slideCarousel() {
  currentIndex += visibleItems; // Move to the next set of items
  if (currentIndex >= totalItems) {
    currentIndex = 0; // Loop back to the beginning
  }
  const translateXValue = -(100 / visibleItems) * currentIndex; // Calculate the translation value
  carouselItems.style.transform = `translateX(${translateXValue}%)`;
}

// Start the carousel sliding automatically every 4 seconds
let intervalId = setInterval(slideCarousel, 4000);

// Function to stop the carousel
function stopCarousel() {
  clearInterval(intervalId); // Stop the automatic sliding
}

// Function to start the carousel
function startCarousel() {
  intervalId = setInterval(slideCarousel, 4000); // Start the automatic sliding
}

// Play/Pause button functionality with keyboard support
const pauseButton = document.getElementById("pauseBtn");
const playButton = document.getElementById("playBtn");

// Function to handle button click or key press
function handleButtonClick(button, action) {
  if (action === "pause") {
    stopCarousel();
    playButton.style.display = "block"; // Show play button
    pauseButton.style.display = "none"; // Hide pause button
    setTimeout(() => {
      playButton.focus(); // Focus on the play button after DOM changes
    }, 0);
  } else if (action === "play") {
    startCarousel();
    playButton.style.display = "none"; // Hide play button
    pauseButton.style.display = "block"; // Show pause button
    setTimeout(() => {
      pauseButton.focus(); // Focus on the pause button after DOM changes
    }, 0);
  }
}

// Handle Pause button click
pauseButton.addEventListener("click", (event) => {
  event.preventDefault(); // Prevent any default click behavior
  handleButtonClick(pauseButton, "pause");
});

// Handle Play button click
playButton.addEventListener("click", (event) => {
  event.preventDefault(); // Prevent any default click behavior
  handleButtonClick(playButton, "play");
});

// Handle Enter and Space key events for Play/Pause buttons
pauseButton.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault(); // Prevent default behavior for Space and Enter
    handleButtonClick(pauseButton, "pause");
  }
});

playButton.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault(); // Prevent default behavior for Space and Enter
    handleButtonClick(playButton, "play");
  }
});

// Function to slide the carousel to a specific index
function slideToIndex(index) {
  const translateXValue =
    -(100 / visibleItems) * Math.floor(index / visibleItems) * visibleItems;
  carouselItems.style.transform = `translateX(${translateXValue}%)`;
  currentIndex = index;
}

// Function to slide the carousel automatically
function slideCarousel() {
  currentIndex += visibleItems;
  if (currentIndex >= totalItems) {
    currentIndex = 0; // Loop back to the beginning
  }
  const translateXValue =
    -(100 / visibleItems) *
    Math.floor(currentIndex / visibleItems) *
    visibleItems;
  carouselItems.style.transform = `translateX(${translateXValue}%)`;
}

// Start the carousel sliding automatically every 4 seconds
function startCarousel() {
  clearInterval(intervalId); // Clear any existing interval to avoid multiple intervals
  intervalId = setInterval(slideCarousel, 4000);
}

// Stop the automatic carousel
function stopCarousel() {
  clearInterval(intervalId);
}

// Automatically pause the carousel when navigated to
const trendingCarousel = document.querySelector(".trending-carousel");
trendingCarousel.addEventListener("focusin", () => {
  stopCarousel(); // Pause the carousel when the user navigates to it
});

// Event listeners to pause the carousel and swipe to focused item
trendingItems.forEach((item, index) => {
  item.addEventListener("focus", () => {
    stopCarousel(); // Pause the carousel
    slideToIndex(index); // Swipe to the focused item if it's out of view
  });

  item.addEventListener("blur", () => {
    // Resume the carousel when focus leaves the item
    startCarousel();
  });
});

// Pause the carousel on hover
trendingCarousel.addEventListener("mouseenter", stopCarousel);

// Resume the carousel when the mouse leaves
trendingCarousel.addEventListener("mouseleave", startCarousel);

// Initially start the carousel
startCarousel();

// Language
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