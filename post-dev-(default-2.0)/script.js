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

// Start the carousel sliding automatically every 4 seconds
let intervalId = setInterval(slideCarousel, 4000);

// Play/Pause button functionality with keyboard support
const pauseButton = document.getElementById("pauseBtn");
const playButton = document.getElementById("playBtn");

// Add an ARIA live region for screen readers
// const ariaLiveRegion = document.createElement("div");
// ariaLiveRegion.setAttribute("aria-live", "polite");
// ariaLiveRegion.setAttribute("class", "sr-only"); // Visually hidden
// document.body.appendChild(ariaLiveRegion);

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

let autoRotateEnabled = true; // Track if auto-rotation is enabled or disabled

// Retrieve the user's saved preference from local storage (if any)
if (localStorage.getItem("autoRotateEnabled") === "false") {
  autoRotateEnabled = false;
}

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
  // Update ARIA live region to alert screen readers
  const currentItem =
    carouselItems.querySelectorAll(".trending-item")[currentIndex];
  // ariaLiveRegion.textContent = `Carousel moved to item: ${
  //   currentItem.querySelector("h3").textContent
  // }`;
}

// Start the carousel sliding automatically every 4 seconds
function startCarousel() {
  if (autoRotateEnabled) {
    clearInterval(intervalId); // Clear any existing interval to avoid multiple intervals
    intervalId = setInterval(slideCarousel, 4000);
  }
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
    // Resume the carousel when focus leaves the item (only if auto-rotation is enabled)
    if (autoRotateEnabled) startCarousel();
  });

  // Listen for Arrow key navigation between items
  item.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      const nextIndex = (index + 1) % totalItems;
      trendingItems[nextIndex].focus(); // Move focus to the next item
      slideToIndex(nextIndex); // Swipe to the next item
      event.preventDefault(); // Prevent any default action
    } else if (event.key === "ArrowLeft") {
      const prevIndex = (index - 1 + totalItems) % totalItems;
      trendingItems[prevIndex].focus(); // Move focus to the previous item
      slideToIndex(prevIndex); // Swipe to the previous item
      event.preventDefault(); // Prevent any default action
    }
  });
});

// Pause the carousel on hover
trendingCarousel.addEventListener("mouseenter", stopCarousel);

// Resume the carousel when the mouse leaves (only if auto-rotation is enabled)
trendingCarousel.addEventListener("mouseleave", () => {
  if (autoRotateEnabled) startCarousel();
});

// Initially start the carousel
if (autoRotateEnabled) startCarousel();

// New functionality for Disable/Enable Auto Rotate
const toggleAutoRotateBtn = document.getElementById("toggleAutoRotateBtn");

toggleAutoRotateBtn.addEventListener("click", () => {
  autoRotateEnabled = !autoRotateEnabled; // Toggle the auto-rotation status
  if (!autoRotateEnabled) {
    stopCarousel(); // Stop the auto-rotation
    toggleAutoRotateBtn.textContent = "Enable Auto Rotate"; // Update the button text
  } else {
    startCarousel(); // Start auto-rotation
    toggleAutoRotateBtn.textContent = "Disable Auto Rotate"; // Update the button text
  }
  // Save the user preference in local storage
  localStorage.setItem("autoRotateEnabled", autoRotateEnabled.toString());
});

// Initialize the button text based on user preference
if (!autoRotateEnabled) {
  toggleAutoRotateBtn.textContent = "Enable Auto Rotate";
}

const skipLink = document.querySelector(".skip-carousel-link");

skipLink.addEventListener("click", () => {
  stopCarousel(); // Pause the carousel when the user chooses to skip it
});

// Get all grid items
const gridItems = document.querySelectorAll(".grid-item");

// Add keyboard navigation support for arrow keys (left and right)
gridItems.forEach((item, index) => {
  item.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      // Move to the next item, if available
      const nextItem = gridItems[index + 1];
      if (nextItem) {
        nextItem.focus();
      }
    } else if (event.key === "ArrowLeft") {
      // Move to the previous item, if available
      const prevItem = gridItems[index - 1];
      if (prevItem) {
        prevItem.focus();
      }
    } else if (event.key === "Enter" || event.key === " ") {
      // Simulate click on Enter or Space
      event.preventDefault();
      item.click();
    }
  });
});

// Handle item click (optional action, e.g., to play or view details)
gridItems.forEach((item) => {
  item.addEventListener("click", () => {
    alert(`You selected: ${item.querySelector("h3").textContent}`);
    // Add additional functionality here
  });
});

const rows = document.querySelectorAll("tbody tr");
const nextSection = document.getElementById("next-section");

rows.forEach((row, rowIndex) => {
  const cells = row.querySelectorAll("td");
  let currentCell = 0;

  // Set initial focus management for each row
  row.addEventListener("focus", () => {
    cells.forEach((cell) => (cell.tabIndex = -1)); // Reset all cell tabIndex
    currentCell = 0;
    cells[currentCell].tabIndex = 0;
  });

  // Keyboard navigation within rows
  row.addEventListener("keydown", (event) => {
    if (event.key === "Tab" && !event.shiftKey) {
      if (rowIndex < rows.length - 1) {
        // Not the last row: move to the next row
        rows[rowIndex + 1].focus();
        event.preventDefault();
      } else {
        // Last row: move to the next section
        nextSection.focus();
      }
    } else if (event.key === "Tab" && event.shiftKey) {
      // Move to the previous row with Shift + Tab
      if (rowIndex > 0) {
        rows[rowIndex - 1].focus();
        event.preventDefault();
      }
    } else if (event.key === "ArrowRight") {
      // Move focus to the next cell within the row
      if (currentCell < cells.length - 1) {
        cells[currentCell].tabIndex = -1;
        cells[++currentCell].tabIndex = 0;
        cells[currentCell].focus();
      }
      event.preventDefault();
    } else if (event.key === "ArrowLeft") {
      // Move focus to the previous cell within the row
      if (currentCell > 0) {
        cells[currentCell].tabIndex = -1;
        cells[--currentCell].tabIndex = 0;
        cells[currentCell].focus();
      }
      event.preventDefault();
    } else if (event.key === "ArrowDown" && rowIndex < rows.length - 1) {
      // Move to the next row with Arrow Down
      rows[rowIndex + 1].focus();
      event.preventDefault();
    } else if (event.key === "ArrowUp" && rowIndex > 0) {
      // Move to the previous row with Arrow Up
      rows[rowIndex - 1].focus();
      event.preventDefault();
    }
  });
});

// Select all FAQ buttons
const faqButtons = document.querySelectorAll(".faq-question");

faqButtons.forEach((button) => {
  const answerId = button.getAttribute("aria-controls");
  const answer = document.getElementById(answerId);

  // Function to toggle the answer
  const toggleAnswer = () => {
    const isExpanded = button.getAttribute("aria-expanded") === "true";

    // Toggle aria-expanded based on the current state
    button.setAttribute("aria-expanded", !isExpanded);
    answer.hidden = isExpanded;

    // If expanding, move focus to the answer content to ensure it’s read out by the screen reader
    if (!isExpanded) {
      answer.focus();
    }
  };

  // Add event listeners for mouse click and keyboard activation
  button.addEventListener("click", (event) => {
    event.preventDefault();
    toggleAnswer();
  });

  button.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleAnswer();
    }
  });
});

// Open modal function
let lastFocusedElement;

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = "block";
  modal.setAttribute("aria-hidden", "false");

  // Focus the first element (close button)
  const focusableElements = modal.querySelectorAll(
    'a, button, input, [tabindex="0"]'
  );
  if (focusableElements.length > 0) {
    focusableElements[0].focus();
  }

  // Trap focus within the modal
  document.addEventListener("keydown", trapFocus);
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");

  lastFocusedElement?.focus(); // Return focus to last focused element

  document.removeEventListener("keydown", trapFocus); // Remove focus trap
}

document.querySelectorAll(".info-icon").forEach((icon) => {
  icon.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      lastFocusedElement = event.target;
      icon.click();
    }
  });
});

function trapFocus(event) {
  const modal = document.querySelector('.modal[style*="display: block"]'); // Currently open modal
  if (!modal) return;

  const focusableElements = modal.querySelectorAll(
    'a, button, input, [tabindex="0"]'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.key === "Tab") {
    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  } else if (event.key === "Escape") {
    closeModal(modal.id);
  }
}

document.querySelectorAll(".modal .close").forEach((closeButton) => {
  closeButton.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      closeModal(closeButton.closest(".modal").id);
    }
  });
});
