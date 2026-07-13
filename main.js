// Carousel Logic
function setupCarousel(trackId, prevBtnId, nextBtnId) {
  const track = document.getElementById(trackId);
  if (!track) return;
  const slides = Array.from(track.children);
  const nextButton = document.getElementById(nextBtnId);
  const prevButton = document.getElementById(prevBtnId);
  
  if (slides.length === 0) return;

  let currentIndex = 0;

  const hasVideos = slides.some(slide => slide.querySelector('video'));

  function updateCarousel() {
    if (slides.length === 0) return;
    const slideWidth = slides[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    
    if (hasVideos) {
      slides.forEach((slide, index) => {
        const vid = slide.querySelector('video');
        if (vid) {
          if (index === currentIndex) {
            vid.currentTime = 0;
            vid.play().catch(e => console.log('Autoplay prevented', e));
          } else {
            vid.pause();
          }
        }
      });
    }
  }

  function goNext() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  }

  if (nextButton) {
    nextButton.addEventListener('click', goNext);
  }

  if (prevButton) {
    prevButton.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel();
    });
  }

  // Handle window resize
  window.addEventListener('resize', updateCarousel);
  
  if (hasVideos) {
    slides.forEach(slide => {
      const vid = slide.querySelector('video');
      if (vid) {
        vid.addEventListener('ended', goNext);
      }
    });
    updateCarousel();
  } else if (slides.length > 1) {
    setInterval(goNext, 5000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setupCarousel('carousel-track', 'carousel-prev', 'carousel-next');
  setupCarousel('promocoes-track', 'promocoes-prev', 'promocoes-next');
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
