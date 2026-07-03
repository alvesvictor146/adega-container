// Carousel Logic
document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('carousel-track');
  const slides = Array.from(track.children);
  const nextButton = document.getElementById('carousel-next');
  const prevButton = document.getElementById('carousel-prev');

  let currentIndex = 0;

  // Since we only have 2 slides for now, simple toggle is fine, but let's make it scalable
  function updateCarousel() {
    const slideWidth = slides[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
  }

  nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  });

  prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
  });

  // Handle window resize
  window.addEventListener('resize', updateCarousel);
  
  // Auto play carousel
  setInterval(() => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  }, 5000);
});

// Simple scroll effect for navbar
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.style.background = 'rgba(5, 5, 5, 0.95)';
    navbar.style.borderBottom = '1px solid var(--primary-red)';
  } else {
    navbar.style.background = 'rgba(12, 12, 12, 0.9)';
    navbar.style.borderBottom = '1px solid rgba(217, 24, 24, 0.2)';
  }
});
