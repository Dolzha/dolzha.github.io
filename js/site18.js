/* Восемнадцатый круг (04-05.10): мобильная вёрстка. Панель вариантов убрана (вернуть: адрес ?panel). */
(function () {
  const body = document.body, st = document.getElementById('stage'), html = document.documentElement;
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  body.classList.add('v18');

  // «Один человек»: «Шаг N» и заголовок в одну обёртку, на телефоне они встают рядом с картинкой
  $$('.sn-c', st).forEach(c => { const k = c.querySelector(':scope > .sn-k'), h = c.querySelector(':scope > h3'); if (!k || !h) return; const w = document.createElement('div'); w.className = 'sn-t'; k.before(w); w.append(k, h); });

  // «Перевёртыши»: на телефоне высота карточки по самой длинной стороне вместе с нижним отступом,
  // чтобы кнопки «Обсудить» и «Назад» не ложились на край карточки
  const faceH = f => { const cs = getComputedStyle(f), kids = [...f.children].filter(x => x.offsetParent); if (!kids.length) return 0; const top = f.getBoundingClientRect().top, bot = Math.max(...kids.map(x => x.getBoundingClientRect().bottom)); return Math.ceil(bot - top + parseFloat(cs.paddingBottom)); };
  const fit = () => {
    const narrow = innerWidth <= 760;
    $$('.xs7-c', st).forEach(c => {
      if (!narrow) { c.style.removeProperty('--xs7h'); return; }
      c.style.setProperty('--xs7h', '1px');
      const fs = $$('.xs7-f,.xs7-b', c), vis = fs.map(f => f.style.visibility);
      fs.forEach(f => { f.style.visibility = 'hidden'; f.style.justifyContent = 'flex-start'; });
      const h = Math.max(...fs.map(faceH));
      fs.forEach((f, i) => { f.style.visibility = vis[i]; f.style.justifyContent = ''; });
      c.style.setProperty('--xs7h', h + 'px');
    });
  };
  let t = 0;
  fit();
  addEventListener('resize', () => { clearTimeout(t); t = setTimeout(fit, 150); });
  if (document.fonts) document.fonts.ready.then(fit);

  // «Один человек» на телефоне: каждая карточка один раз плавно поднимается, когда доходит до экрана
  if (!reduce && 'IntersectionObserver' in window && innerWidth <= 900) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return; io.unobserve(e.target); e.target.classList.remove('v18-rv');
      e.target.animate([{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'none' }], { duration: 700, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' });
    }), { threshold: .15 });
    $$('.sn .sn-c', st).forEach(c => { const r = c.getBoundingClientRect(); if (r.top > innerHeight) { c.classList.add('v18-rv'); io.observe(c); } });
  }

  // логотип на сенсорном экране: касание проигрывает анимацию и через 0,7 с возвращает знак на место
  const hl = document.querySelector('.hd11-logo');
  if (hl && matchMedia('(hover:none)').matches) {
    let lt = 0;
    hl.addEventListener('touchstart', () => { hl.classList.remove('l18-tap'); void hl.offsetWidth; hl.classList.add('l18-tap'); clearTimeout(lt); lt = setTimeout(() => hl.classList.remove('l18-tap'), 700); }, { passive: true });
  }

  // всё собрано: показываем сайт
  requestAnimationFrame(() => requestAnimationFrame(() => html.classList.remove('v18-wait')));
})();
