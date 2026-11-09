const motion = document.querySelector('.motion-toggle');
motion.hidden = false;
motion.addEventListener('click', () => {
  const paused = document.documentElement.classList.toggle('motion-paused');
  motion.textContent = paused ? '恢复动效' : '暂停动效';
});

if ('IntersectionObserver' in window) {
  const reveal = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-revealed');
      reveal.unobserve(entry.target);
    }
  }, { threshold: 0.12 });
  for (const item of document.querySelectorAll('[data-reveal]')) reveal.observe(item);
}

const films = document.querySelectorAll('video');
for (const film of films) {
  film.addEventListener('play', () => {
    for (const other of films) {
      if (other !== film) other.pause();
    }
  });
}

const works = [...document.querySelectorAll('.work')];
const viewer = document.querySelector('.work-viewer');
const photo = viewer.querySelector('.viewer-photo');
let activeWork = 0;
let opener;

function showWork(index) {
  activeWork = (index + works.length) % works.length;
  const work = works[activeWork];
  const title = work.querySelector('.work-name').textContent;
  viewer.querySelector('#work-title').textContent = title;
  viewer.querySelector('.viewer-count').textContent = (activeWork + 1) + ' / ' + works.length;
  photo.alt = title;
  photo.src = work.href;
}

if (typeof viewer.showModal === 'function') {
  works.forEach((work, index) => {
    work.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = work;
      showWork(index);
      viewer.showModal();
    });
  });
  viewer.querySelector('.viewer-close').addEventListener('click', () => viewer.close());
  viewer.querySelector('.viewer-prev').addEventListener('click', () => showWork(activeWork - 1));
  viewer.querySelector('.viewer-next').addEventListener('click', () => showWork(activeWork + 1));
  viewer.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') showWork(activeWork - 1);
    if (event.key === 'ArrowRight') showWork(activeWork + 1);
  });
  viewer.addEventListener('close', () => opener.focus({ preventScroll: true }));
}
