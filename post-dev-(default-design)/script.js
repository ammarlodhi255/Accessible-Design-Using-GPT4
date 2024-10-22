document.addEventListener("DOMContentLoaded", () => {
  const languageButton = document.getElementById("language-button");
  const languageList = document.getElementById("language-list");
  const languageOptions = document.querySelectorAll(".language-option");
  const navLinks = document.querySelectorAll(".nav-links a"); // All nav menu links

  let expanded = false;
  let currentOptionIndex = 0;
  let searchString = "";
  let searchTimeout;
  let lastKey = "";
  let cycleIndex = 0;

  // Sticky Navbar and Active Section Indicator
  const sections = document.querySelectorAll("section"); // All the sections on the page
  const navbarHeight = document.querySelector(".navbar").offsetHeight;

  window.addEventListener("scroll", () => {
    let currentSection = "";

    // Loop through each section and check if it's in the viewport
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - navbarHeight - 50; // Account for navbar height
      if (pageYOffset >= sectionTop) {
        currentSection = section.getAttribute("id");
      }
    });

    // Add the active class to the corresponding menu item
    navLinks.forEach((link) => {
      link.classList.remove("active-indicator"); // Remove active from all
      if (link.getAttribute("href").substring(1) === currentSection) {
        link.classList.add("active-indicator"); // Add active to the current section's link
      }
    });
  });

  // Focus management for navigation
  let currentMenuIndex = 0;

  // Function to scroll to the section and set focus on its heading
  function scrollToSection(event, sectionId) {
    event.preventDefault();
    const section = document.querySelector(sectionId);
    section.scrollIntoView({ behavior: "smooth" });
    section.setAttribute("tabindex", "-1");
    section.focus();
  }

  // Add event listener to all menu items (except language dropdown)
  navLinks.forEach((link, index) => {
    if (link.id !== "language-button") {
      link.addEventListener("click", function (event) {
        const sectionId = this.getAttribute("href");
        scrollToSection(event, sectionId);
      });

      // Handle both Enter and Space for scrolling to the section
      link.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          const sectionId = this.getAttribute("href");
          scrollToSection(event, sectionId);
        }

        // Handle left and right arrow navigation
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          navigateMenu(event, index);
        }

        // Handle character-based focus movement
        if (/^[a-zA-Z]$/.test(event.key)) {
          focusByTypedCharacter(event.key.toLowerCase());
        }
      });
    }
  });

  // Handle navigation with left and right arrow keys for menu items
  function navigateMenu(event, currentIndex) {
    const maxIndex = navLinks.length - 1;

    if (event.key === "ArrowRight") {
      currentMenuIndex = currentIndex + 1 > maxIndex ? 0 : currentIndex + 1;
    } else if (event.key === "ArrowLeft") {
      currentMenuIndex = currentIndex - 1 < 0 ? maxIndex : currentIndex - 1;
    }

    // Move focus to the next or previous menu item
    navLinks[currentMenuIndex].focus();
  }

  // Function to move focus based on typed character
  function focusByTypedCharacter(char) {
    const startingIndex = currentMenuIndex + 1; // Start searching from the next item
    let found = false;

    // Search for the first menu item that starts with the typed character
    for (let i = 0; i < navLinks.length; i++) {
      const indexToCheck = (startingIndex + i) % navLinks.length; // Wrap around using modulo
      const linkText = navLinks[indexToCheck].textContent.trim().toLowerCase();

      if (linkText.startsWith(char)) {
        navLinks[indexToCheck].focus();
        currentMenuIndex = indexToCheck; // Update the current focused menu item
        found = true;
        break;
      }
    }

    if (!found) {
      // No item found, focus does not move
      console.log(`No menu item found starting with: ${char}`);
    }
  }

  // Language dropdown behavior
  function toggleDropdown(show) {
    expanded = show;
    languageButton.setAttribute("aria-expanded", expanded);
    languageList.style.display = expanded ? "block" : "none";

    if (expanded) {
      setActiveDescendant(currentOptionIndex);
      languageButton.focus();
    }
  }

  function setActiveDescendant(index) {
    languageOptions.forEach((option) => option.classList.remove("active"));
    languageOptions[index].classList.add("active");
    languageButton.setAttribute(
      "aria-activedescendant",
      languageOptions[index].id
    );
    languageOptions[index].scrollIntoView({ block: "nearest" });
    currentOptionIndex = index;
  }

  languageButton.addEventListener("keydown", (event) => {
    const key = event.key;

    if (key === "ArrowDown") {
      event.preventDefault();
      if (!expanded) {
        toggleDropdown(true);
      } else {
        if (currentOptionIndex < languageOptions.length - 1) {
          setActiveDescendant(currentOptionIndex + 1);
        }
      }
    } else if (key === "ArrowUp") {
      event.preventDefault();
      if (!expanded) {
        toggleDropdown(true);
      } else {
        if (currentOptionIndex > 0) {
          setActiveDescendant(currentOptionIndex - 1);
        }
      }
    } else if (key === "Enter" || key === " ") {
      event.preventDefault();
      if (expanded) {
        languageButton.textContent =
          languageOptions[currentOptionIndex].textContent;
        toggleDropdown(false);
      } else {
        toggleDropdown(true);
      }
    } else if (key === "Escape") {
      event.preventDefault();
      toggleDropdown(false);
    } else if (key === "ArrowLeft" || key === "ArrowRight") {
      // Handle left and right arrow navigation for the language button
      const languageButtonIndex = Array.from(navLinks).indexOf(languageButton);
      navigateMenu(event, languageButtonIndex);
    } else if (/^[a-zA-Z]$/.test(key)) {
      handleTypeAheadSearch(key.toLowerCase());
      event.preventDefault();
    }
  });

  function handleTypeAheadSearch(char) {
    clearTimeout(searchTimeout);

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

  languageButton.addEventListener("click", () => {
    toggleDropdown(!expanded);
  });

  languageOptions.forEach((option, index) => {
    option.addEventListener("click", () => {
      languageButton.textContent = option.textContent;
      toggleDropdown(false);
      setActiveDescendant(index);
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

  // Add a focusout listener to handle when focus moves out of the dropdown
  languageButton.addEventListener("focusout", (event) => {
    if (!event.relatedTarget || !languageList.contains(event.relatedTarget)) {
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
