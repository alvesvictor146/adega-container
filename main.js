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

// ===== Sistema de Cupons =====
const COUPONS = {
  'PRIMEIRAVISITA': { discount: 10, type: 'percent', description: '10% de desconto' },
  'ADEGA10': { discount: 10, type: 'fixed', description: 'R$10 de desconto' },
  'GELOFREE': { discount: 0, type: 'freebie', description: 'Gelo de coco grátis' }
};

document.addEventListener('DOMContentLoaded', () => {
  const couponInput = document.getElementById('couponInput');
  const applyBtn = document.getElementById('couponApplyBtn');
  const feedbackEl = document.getElementById('couponFeedback');
  const couponCard = document.querySelector('.coupon-card');
  
  if (!applyBtn) return;

  applyBtn.addEventListener('click', () => {
    const code = couponInput.value.trim().toUpperCase();
    
    if (!code) return;
    
    // Animações reset
    couponCard.classList.remove('animate-shake', 'animate-bounce');
    void couponCard.offsetWidth; // Trigger reflow
    
    const coupon = COUPONS[code];
    
    if (!coupon) {
      showFeedback('Cupom inválido!', 'error');
      couponCard.classList.add('animate-shake');
      return;
    }
    
    const usedCoupons = JSON.parse(localStorage.getItem('adega_used_coupons') || '[]');
    
    if (usedCoupons.includes(code)) {
      showFeedback('Este cupom já foi utilizado neste aparelho.', 'warning');
      return;
    }
    
    // Sucesso
    showFeedback(`Cupom aplicado! ${coupon.description} no próximo pedido.`, 'success');
    couponCard.classList.add('animate-bounce');
    
    // Salvar como usado
    usedCoupons.push(code);
    localStorage.setItem('adega_used_coupons', JSON.stringify(usedCoupons));
    
    // Mostrar botão de WhatsApp no cupom
    const couponWhatsappBtn = document.getElementById('couponWhatsappBtn');
    if (couponWhatsappBtn) {
      couponWhatsappBtn.classList.remove('hidden');
      const phone = "5511976019795";
      const text = encodeURIComponent(`Olá! Gostaria de fazer um pedido na Adega! 🎟️ Cupom: ${code} (${coupon.description})`);
      couponWhatsappBtn.href = `https://wa.me/${phone}?text=${text}`;
    }
    
    // Atualizar links do WhatsApp (outros cards)
    updateWhatsAppLinks(code, coupon.description);
  });

  function showFeedback(message, type) {
    feedbackEl.textContent = message;
    feedbackEl.className = `coupon-feedback show ${type}`;
  }

  function updateWhatsAppLinks(code, description) {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
      const onclickAttr = card.getAttribute('onclick');
      if (onclickAttr && onclickAttr.includes('wa.me')) {
        // Extrai a URL
        const match = onclickAttr.match(/window\.open\('([^']+)'/);
        if (match && match[1]) {
          let url = match[1];
          // Adiciona texto do cupom no final do text=
          const couponText = encodeURIComponent(`\n🎟️ Cupom: ${code} (${description})`);
          url += couponText;
          card.setAttribute('onclick', `window.open('${url}', '_blank')`);
        }
      }
    });
  }
});
