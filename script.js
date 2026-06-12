// ═══ Preloader ═══
const preloader = document.getElementById('preloader');
const progress  = document.getElementById('preloaderProgress');
const count     = document.getElementById('preloaderCount');

let pct = 0;
const interval = setInterval(() => {
  pct += Math.random() * 18;
  if (pct >= 100) { pct = 100; clearInterval(interval); done(); }
  progress.style.width = pct + '%';
  count.textContent    = Math.floor(pct) + '%';
}, 80);

function done() {
  setTimeout(() => {
    preloader.classList.add('hide');
    document.body.style.overflow = '';
    animateStats();
  }, 300);
}
document.body.style.overflow = 'hidden';

// ═══ Custom Cursor ═══
const cursor   = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mx = 0, my = 0, fx = 0, fy = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

(function loop() {
  fx += (mx - fx) * 0.12;
  fy += (my - fy) * 0.12;
  cursor.style.left   = mx + 'px';
  cursor.style.top    = my + 'px';
  follower.style.left = fx + 'px';
  follower.style.top  = fy + 'px';
  requestAnimationFrame(loop);
})();

document.querySelectorAll('a, button, .filter-btn, .tool-badge, .project-card').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); follower.classList.add('hover'); });
  el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); follower.classList.remove('hover'); });
});

// ═══ Nav scroll effect ═══
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ═══ Hamburger / Mobile menu ═══
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose= document.getElementById('mobileClose');

hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
document.querySelectorAll('.mobile-link').forEach(l => {
  l.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ═══ Reveal on scroll ═══
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach(r => observer.observe(r));

// ═══ Stat counter ═══
function animateStats() {
  document.querySelectorAll('[data-target]').forEach(el => {
    const target = +el.dataset.target;
    let cur = 0;
    const step = target / 40;
    const t = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = Math.floor(cur) + (target > 10 ? '+' : '+');
      if (cur >= target) clearInterval(t);
    }, 30);
  });
}

// ═══ Work filter + View More ═══
const filterBtns  = document.querySelectorAll('.filter-btn');
const cards       = document.querySelectorAll('.project-card');
const viewMoreBtn = document.getElementById('viewMoreBtn');
const hiddenCards = document.querySelectorAll('.project-card--hidden');
let   expanded    = false;

// View More → staggered reveal of all hidden cards
viewMoreBtn.addEventListener('click', () => {
  expanded = !expanded;

  if (expanded) {
    hiddenCards.forEach((card, i) => {
      setTimeout(() => {
        card.classList.add('visible-card');
      }, i * 120); // stagger 120ms per card
    });
  } else {
    hiddenCards.forEach(card => card.classList.remove('visible-card'));
  }

  viewMoreBtn.textContent = expanded ? 'View Less ✦' : 'View More ✦';
});

// Filter buttons
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    cards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      // reset inline style first so CSS class rules apply cleanly
      card.style.display = '';

      if (!match) {
        card.style.display = 'none';
      } else if (card.classList.contains('project-card--hidden')) {
        // If it's 'all' and not expanded, keep it hidden. Otherwise (specific filter or expanded), show it.
        if (filter === 'all' && !expanded) {
          card.classList.remove('visible-card');
        } else {
          card.classList.add('visible-card');
        }
      }
    });

    // View More button only makes sense on "All" tab
    viewMoreBtn.parentElement.style.display = filter === 'all' ? 'flex' : 'none';
  });
});

// ═══ Contact form ═══
const form    = document.getElementById('contactForm');
const success = document.getElementById('formSuccess');
if (form && success) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    
    // Change button text while sending
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    
    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
      body: json
    })
    .then(async (response) => {
      let json = await response.json();
      if (response.status == 200) {
        success.style.color = "var(--teal)";
        success.style.borderColor = "var(--teal)";
        success.innerHTML = "Message sent successfully!";
        success.classList.add('show');
        form.reset();
      } else {
        console.log(response);
        success.style.color = "var(--red)";
        success.style.borderColor = "var(--red)";
        success.innerHTML = json.message || "Something went wrong!";
        success.classList.add('show');
      }
    })
    .catch(error => {
      console.log(error);
      success.style.color = "var(--red)";
      success.style.borderColor = "var(--red)";
      success.innerHTML = "Something went wrong!";
      success.classList.add('show');
    })
    .finally(() => {
      submitBtn.textContent = originalText;
      setTimeout(() => success.classList.remove('show'), 5000);
    });
  });
}

// ═══ Scroll Progress Bar ═══
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const scrollTotal = document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollPosition = (scrollTotal / height) * 100;
  if (scrollProgress) {
    scrollProgress.style.width = scrollPosition + '%';
  }
});



// ═══ Smooth anchor scroll ═══
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// ═══ Lightbox ═══
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let currentGallery = [];
let currentIndex = 0;

function updateLightbox(index) {
  if (index < 0) index = currentGallery.length - 1;
  if (index >= currentGallery.length) index = 0;
  
  currentIndex = index;
  const img = currentGallery[currentIndex];

  // Start fade out
  lightboxImg.classList.add('changing');
  
  setTimeout(() => {
    lightboxImg.src = img.src;
    
    const card = img.closest('.project-card');
    if (card) {
      const titleEl = card.querySelector('.project-card__title');
      if (titleEl) {
        lightboxCaption.textContent = titleEl.innerText.replace(/\n/g, ' ');
      }
    }
    
    // Fade back in after image source is changed
    lightboxImg.classList.remove('changing');
  }, 200);
}

function openLightbox(clickedImg) {
  // Update gallery based on what's currently visible
  currentGallery = Array.from(document.querySelectorAll('.project-card'))
    .filter(card => card.style.display !== 'none')
    .map(card => card.querySelector('.project-card__img'));

  currentIndex = currentGallery.indexOf(clickedImg);
  
  lightbox.style.display = 'flex';
  updateLightbox(currentIndex);
  document.body.style.overflow = 'hidden';
}

const closeLightbox = () => {
  lightbox.style.display = 'none';
  document.body.style.overflow = '';
};

// Use event delegation for cards
document.addEventListener('click', e => {
  const card = e.target.closest('.project-card');
  if (card) {
    if (e.target.closest('a, button')) return;
    const img = card.querySelector('.project-card__img');
    if (img) openLightbox(img);
  }
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', (e) => {
  e.stopPropagation();
  updateLightbox(currentIndex - 1);
});
lightboxNext.addEventListener('click', (e) => {
  e.stopPropagation();
  updateLightbox(currentIndex + 1);
});

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox || e.target === lightboxImg) {
    closeLightbox();
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
  if (lightbox.style.display === 'flex') {
    if (e.key === 'ArrowLeft') updateLightbox(currentIndex - 1);
    if (e.key === 'ArrowRight') updateLightbox(currentIndex + 1);
  }
});
