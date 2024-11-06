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
  const videoPlayer = document.getElementById("video-player");
  const videoSrc = document.getElementById("video-src");
  videoSrc.src = `video${slideIndex}.mp4`; // Replace with actual video URLs
  videoPlayer.style.display = "block";
  slides[slideIndex - 1].style.display = "none"; // Hide the slide when video starts
  videoPlayer.play();
}

showSlide(currentSlide);
