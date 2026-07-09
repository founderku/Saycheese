// ===== header scroll state =====
const header = document.getElementById('header');
function onHeaderScroll(){
  header.classList.toggle('scrolled', window.scrollY > 40);
}
window.addEventListener('scroll', onHeaderScroll, {passive:true});
onHeaderScroll();

// ===== reduced motion check =====
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ===== hero: 3D tilt cake on scroll + mouse =====
const heroStage = document.getElementById('heroStage');
const cakeWrap = document.getElementById('cakeWrap');
const hc1 = document.getElementById('hc1');
const hc2 = document.getElementById('hc2');
const scrollHint = document.querySelector('.scroll-hint');
const blobs = document.querySelectorAll('.blob');

let mouseX = 0, mouseY = 0;
window.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

function onHeroScroll(){
  const rect = heroStage.getBoundingClientRect();
  const total = heroStage.offsetHeight - window.innerHeight;
  const progress = Math.min(Math.max(-rect.top / total, 0), 1);

  if(!reduceMotion){
    const rotY = progress * 340 + mouseX * 12;
    const rotX = -8 + progress * 6 + mouseY * -8;
    const scale = 0.85 + progress * 0.3;
    const translateY = Math.sin(progress * Math.PI) * -30;
    cakeWrap.style.transform = `translateY(${translateY}px) perspective(900px) rotateY(${rotY}deg) rotateX(${rotX}deg) scale(${scale})`;

    blobs.forEach(b => {
      const speed = parseFloat(b.dataset.speed || 0.3);
      b.style.transform = `translate(${mouseX * 30 * speed}px, ${mouseY * 30 * speed + progress * -80 * speed}px)`;
    });
  }

  hc1.classList.toggle('visible', progress > 0.1 && progress < 0.62);
  hc2.classList.toggle('visible', progress > 0.4 && progress < 0.92);

  if(scrollHint) scrollHint.style.opacity = progress > 0.05 ? '0' : '1';
}
window.addEventListener('scroll', onHeroScroll, {passive:true});
onHeroScroll();

// ===== scroll reveal =====
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, {threshold:0.15});
revealEls.forEach(el => io.observe(el));

// ===== menu card tilt on hover =====
document.querySelectorAll('.menu-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    if(reduceMotion) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty('--tilt-x', `${-y * 8}deg`);
    card.style.setProperty('--tilt-y', `${x * 8}deg`);
  });
  card.addEventListener('mouseleave', () => {
    card.style.setProperty('--tilt-x', '0deg');
    card.style.setProperty('--tilt-y', '0deg');
  });
});

// ===== menu tabs =====
const tabs = document.querySelectorAll('.menu-tab');
const groups = document.querySelectorAll('.menu-group');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    groups.forEach(g => g.classList.remove('active'));
    tab.classList.add('active');
    document.querySelector(`.menu-group[data-group="${tab.dataset.tab}"]`).classList.add('active');
  });
});

// ===== faq accordion =====
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  if(item.classList.contains('open')){
    a.style.maxHeight = a.scrollHeight + 'px';
  }
  q.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(other => {
      other.classList.remove('open');
      other.querySelector('.faq-a').style.maxHeight = null;
    });
    if(!isOpen){
      item.classList.add('open');
      a.style.maxHeight = a.scrollHeight + 'px';
    }
  });
});

// ===== smooth anchor scroll offset for fixed header =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if(target){
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({top, behavior: reduceMotion ? 'auto' : 'smooth'});
    }
  });
});
