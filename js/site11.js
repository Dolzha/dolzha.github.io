/* Одиннадцатый круг (04.10). Роберт: «фон неудачный», просит по 10 вариантов главного экрана, фона, шапки и цветов логотипа.
   0 = как сейчас, для сравнения. Выбор: классы body.hl-N bg-N hh-N lp-N, localStorage v11-*, адрес #hl1-bg1-hh1-lp1. */
(function () {
  const D = window.D, ic = window.SB.ic, body = document.body, st = document.getElementById('stage');
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, fine = matchMedia('(pointer:fine)').matches;
  const W = D.works, hero = $('.m-hero .hero', st);
  body.classList.add('v11');

  const G = [
    ['hl', 'Главный экран', ['Как сейчас', 'Веер', 'Браузер с вкладками', 'Лента работ', 'Картинки в строке', 'Ноутбук и телефон', 'Колонны', 'Колода', 'Указатель', 'Холст дизайнера', 'Стена']],
    ['bg', 'Фон', ['Как сейчас', 'Чистый', 'Солнце знака', 'Холмы', 'Каркас сайта', 'Сетка макета', 'Плитки', 'Код', 'Горизонт', 'Тёмный лес', 'Бирюза']],
    ['hh', 'Шапка', ['Как сейчас', 'Классика', 'Пилюля', 'Острова', 'Кнопка «Меню»', 'Бегунок', 'Тёмная полоса', 'Сжатие', 'Две строки', 'Док снизу', 'Время и загрузка']],
    ['lp', 'Цвета логотипа', ['Как сейчас', 'Мята', 'Инверсия', 'Лайм', 'Изумруд и крем', 'Графит', 'Рассвет', 'Небо', 'Ягода', 'Пастель', 'Наоборот']],
  ];
  // выбор Роберта 04.10: главный экран 10 «Стена», фон 3 «Холмы» чуть прозрачнее, шапка 2 «Пилюля» (запасная 9 «Док»), логотип как был.
  // Ссылка вида #hl10-bg3-hh9-lp0 показывает другой вариант и панель для сравнения.
  const V = { hl: 10, bg: 3, hh: 2, lp: 0 };
  const hm = location.hash.match(/^#hl(\d+)-bg(\d+)-hh(\d+)-lp(\d+)$/);
  if (hm) G.forEach(([k], i) => { const n = +hm[i + 1]; if (n <= 10) V[k] = n; });

  // таймеры и слушатели варианта, снимаются при переключении
  const bag = { hl: [], bg: [], hh: [] };
  const every = (k, ms, fn) => { const id = setInterval(fn, ms); bag[k].push(() => clearInterval(id)); };
  const on = (k, el, ev, fn, o) => { el.addEventListener(ev, fn, o); bag[k].push(() => el.removeEventListener(ev, fn, o)); };
  const clean = k => { bag[k].forEach(f => f()); bag[k] = []; };

  const src = (k, t) => t === 's' ? `img/w/${k}-s.jpg` : t === 'long' ? `img/long/${k}.jpg` : t === 'mob' ? `img/mob/${k}.jpg` : `img/w/${k}.jpg`;
  const pic = (k, t, cls = '') => `<img${cls ? ` class="${cls}"` : ''} src="${src(k, t)}" alt="Сайт ${W[k].name}" decoding="async">`;
  const go = k => `href="${W[k].url}" target="_blank" rel="noopener"`;
  const H1 = (a = '', c = '') => `<h1 class="h1"><span class="l l1">Создаю ${a}сайты</span> <span class="l l2">которые работают</span> <span class="l l3">на вас${c}</span></h1>`;
  const LEAD = `<p class="lead">${D.hero.lead}</p>`;
  const ACT = `<div class="actions"><a class="btn" href="${D.tg}" target="_blank" rel="noopener"><span>${D.hero.cta}</span>${ic.arrow}</a><a class="btn-2" href="#raboty"><span>${D.hero.cta2}</span>${ic.right}</a></div>`;
  const COPY = `<div class="hx-copy">${H1()}${LEAD}${ACT}</div>`;
  const hovering = el => el.matches(':hover') || el.contains(document.activeElement);

  // ================= главный экран =================
  const HL = {
    1: () => { // веер карточек снизу, текст по центру
      const F = ['bambini', 'veha', 'gurumotors', 'norden', 'zest'];
      return `<div class="hx hx1"><div class="wrap">${COPY}</div><div class="fan">${F.map((k, i) => `<a class="fc" style="--i:${i - 2}" ${go(k)} aria-label="${W[k].name}, ${W[k].biz}">${pic(k, 'w')}</a>`).join('')}</div></div>`;
    },
    2: () => { // окно браузера, вкладки = работы, страница прокручивается
      const T = ['gurumotors', 'veha', 'norden', 'bambini'];
      return { html: `<div class="hx hx2"><div class="wrap hx-grid">${COPY}<div class="bw"><div class="bw-top"><span class="bw-dots" aria-hidden="true"><i></i><i></i><i></i></span><div class="bw-tabs" role="tablist" aria-label="Работы">${T.map((k, i) => `<button type="button" role="tab" class="bw-tab" aria-selected="${i === 0}" data-i="${i}">${W[k].name}</button>`).join('')}</div></div><div class="bw-url"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 11h10v9H7zM9.5 11V8.5a2.5 2.5 0 0 1 5 0V11"/></svg><span>${W[T[0]].show}</span></div><a class="bw-view" ${go(T[0])}>${T.map((k, i) => pic(k, 'long', i ? 'bw-img' : 'bw-img on')).join('')}</a></div></div></div>`,
        init: box => {
          const tabs = $$('.bw-tab', box), imgs = $$('.bw-img', box), url = $('.bw-url span', box), view = $('.bw-view', box), bw = $('.bw', box); let i = 0;
          const set = n => { i = n; tabs.forEach((t, j) => t.setAttribute('aria-selected', j === i)); imgs.forEach((m, j) => m.classList.toggle('on', j === i)); url.textContent = W[T[i]].show; view.href = W[T[i]].url; };
          tabs.forEach((t, j) => t.addEventListener('click', () => set(j)));
          every('hl', 7000, () => { if (!hovering(bw)) set((i + 1) % T.length); });
        } };
    },
    3: () => { // две бегущие ленты работ во всю ширину
      const R = [['gurumotors', 'veha', 'norden', 'bambini', 'garage'], ['private', 'once', 'mentors', 'zest', 'porfume']];
      return `<div class="hx hx3"><div class="wrap">${COPY}</div><div class="rb">${R.map((r, j) => `<div class="rb-row rb-${j}"><div class="rb-tr">${[...r, ...r].map((k, n) => `<a class="rb-c" ${go(k)}${n >= r.length ? ' aria-hidden="true" tabindex="-1"' : ''}>${pic(k, 's')}<span>${W[k].name}</span></a>`).join('')}</div></div>`).join('')}</div></div>`;
    },
    4: () => { // картинки прямо в строке заголовка
      const A = ['norden', 'gurumotors', 'veha'], B = ['bambini', 'zest', 'once'];
      const pill = ks => `<span class="pl" aria-hidden="true">${ks.map((k, i) => `<img${i ? '' : ' class="on"'} src="${src(k, 's')}" alt="">`).join('')}</span> `;
      return { html: `<div class="hx hx4"><div class="wrap">${H1(pill(A), ' ' + pill(B).trim())}<div class="hx4-f">${LEAD}${ACT}</div></div></div>`,
        init: box => { let n = 0; if (!reduce) every('hl', 2600, () => { n++; $$('.pl', box).forEach(p => { const im = $$('img', p); im.forEach((m, j) => m.classList.toggle('on', j === n % im.length)); }); }); } };
    },
    5: () => `<div class="hx hx5"><div class="wrap hx-grid">${COPY}<div class="dvc"><div class="lap"><div class="lap-scr"><a class="lap-vp" ${go('norden')}>${pic('norden', 'long')}</a></div><i class="lap-base"></i></div><div class="ph"><div class="ph-scr"><div class="ph-sb"><b>9:41</b><svg viewBox="0 0 54 12" aria-hidden="true"><path d="M1 9h2v2H1zM5 7h2v4H5zM9 5h2v6H9zM13 3h2v8h-2z"/><path d="M24 4.5a7 7 0 0 1 9 0M26 7a3.6 3.6 0 0 1 5 0" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><circle cx="28.5" cy="9.6" r="1.2"/><rect x="37.5" y="2.5" width="13" height="7" rx="2" fill="none" stroke="currentColor"/><rect x="39" y="4" width="9" height="4" rx="1"/><path d="M51.5 5v2"/></svg></div><a class="ph-vp" ${go('gurumotors')}>${pic('gurumotors', 'mob')}</a><div class="ph-saf"><span>gurumotors.ru</span></div></div></div></div></div></div>`,
    6: () => { // три колонны длинных страниц с телефона
      const C = [['gurumotors', 'bambini'], ['norden', 'zest'], ['veha', 'once']];
      return `<div class="hx hx6"><div class="wrap hx-grid">${COPY}<div></div></div><div class="cols" aria-hidden="true">${C.map((c, j) => `<div class="cl cl${j}"><div class="cl-t">${[...c, ...c].map(k => `<img src="${src(k, 'mob')}" alt="">`).join('')}</div></div>`).join('')}</div></div>`;
    },
    7: () => { // колода: верхняя карта уходит назад
      const K = ['gurumotors', 'veha', 'norden', 'bambini', 'garage'];
      return { html: `<div class="hx hx7"><div class="wrap hx-grid">${COPY}<div class="dk"><div class="dk-st">${K.map((k, i) => `<a class="dk-c" style="--d:${i}" ${go(k)}${i ? ' tabindex="-1"' : ''}>${pic(k, 'w')}</a>`).join('')}</div><div class="dk-cap"><p><b class="dk-n">${W[K[0]].name}</b><span class="dk-b">${W[K[0]].biz}</span></p><button type="button" class="dk-nx" aria-label="Следующая работа">${ic.right}</button></div></div></div></div>`,
        init: box => {
          const cards = $$('.dk-c', box), ord = cards.map((_, i) => i), dk = $('.dk', box); let busy = false;
          const lay = () => ord.forEach((ci, d) => { cards[ci].style.setProperty('--d', d); cards[ci].tabIndex = d ? -1 : 0; });
          const next = () => {
            if (busy) return; busy = true; const top = cards[ord[0]]; top.classList.add('fly');
            setTimeout(() => { ord.push(ord.shift()); top.classList.remove('fly'); lay(); const k = K[ord[0]]; $('.dk-n', box).textContent = W[k].name; $('.dk-b', box).textContent = W[k].biz; busy = false; }, reduce ? 0 : 420);
          };
          $('.dk-nx', box).addEventListener('click', next);
          every('hl', 3800, () => { if (!hovering(dk)) next(); });
        } };
    },
    8: () => { // указатель работ: наведение на название меняет картинку
      const X = ['gurumotors', 'veha', 'norden', 'bambini', 'garage', 'private'];
      return { html: `<div class="hx hx8"><div class="wrap hx-grid">${COPY}<div class="ix"><div class="ix-pv">${X.map((k, i) => pic(k, 'w', i ? '' : 'on')).join('')}</div><ul class="ix-l">${X.map((k, i) => `<li><a ${go(k)} data-i="${i}"${i ? '' : ' class="on"'}><span class="ix-n">${W[k].name}</span><span class="ix-b">${W[k].biz}</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg></a></li>`).join('')}</ul></div></div></div>`,
        init: box => {
          const im = $$('.ix-pv img', box), as = $$('.ix-l a', box), ix = $('.ix', box); let i = 0;
          const set = n => { i = n; im.forEach((m, j) => m.classList.toggle('on', j === i)); as.forEach((a, j) => a.classList.toggle('on', j === i)); };
          as.forEach((a, j) => { a.addEventListener('pointerenter', () => set(j)); a.addEventListener('focus', () => set(j)); });
          every('hl', 3200, () => { if (!hovering(ix)) set((i + 1) % X.length); });
        } };
    },
    9: () => { // холст дизайнера: рамки, выделение заголовка, курсор
      const F = [['bambini', 'a'], ['veha', 'b'], ['garage', 'c'], ['norden', 'd']];
      return { html: `<div class="hx hx9">${F.map(([k, c]) => `<a class="cv-fr cv-${c}" ${go(k)}><span class="cv-lb">${W[k].name}</span>${pic(k, 's')}</a>`).join('')}<div class="wrap cv-mid"><div class="cv-sel"><span class="cv-tag">Заголовок</span><i class="cv-h cv-h1"></i><i class="cv-h cv-h2"></i><i class="cv-h cv-h3"></i><i class="cv-h cv-h4"></i>${H1()}<span class="cv-sz"></span></div>${LEAD}${ACT}</div><div class="cv-cur" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 2.5 19.5 12l-7 1.6-3.6 6.4z"/></svg><span>Dolzha</span></div></div>`,
        init: box => {
          const sel = $('.cv-sel', box), sz = $('.cv-sz', box), h = $('.h1', sel);
          const upd = () => { const r = h.getBoundingClientRect(); sz.textContent = `${Math.round(r.width)} × ${Math.round(r.height)}`; };
          upd(); on('hl', window, 'resize', upd);
          if (document.fonts) document.fonts.ready.then(upd);
        } };
    },
    10: () => { // стена работ в перспективе
      // 04.10 Роберт: какие страницы работ показывать, решаем вместе. Пока только главные экраны (внутренние лежат в img/in/).
      const M = ['gurumotors', 'veha', 'norden', 'bambini', 'garage', 'private', 'once', 'mentors', 'zest', 'porfume'];
      const A = [...M, ...M].map(k => `w/${k}-s`); // 20 плиток в 4 колонки: повтор через 2 ряда и 2 колонки, соседи всегда разные
      return `<div class="hx hx10"><div class="wrap hx-grid">${COPY}<div></div></div><div class="wl" aria-hidden="true"><div class="wl-p"><div class="wl-g">${[...A, ...A].map(f => `<img src="img/${f}.jpg" alt="">`).join('')}</div></div></div></div>`;
    },
  };

  hero.insertAdjacentHTML('afterbegin', '<div class="b11" aria-hidden="true"></div>');
  hero.insertAdjacentHTML('beforeend', '<div class="h11"></div>');
  const b11 = $('.b11', hero), h11 = $('.h11', hero);
  const renderHL = () => {
    clean('hl'); h11.innerHTML = '';
    if (!V.hl) return;
    const r = HL[V.hl](), html = typeof r === 'string' ? r : r.html;
    h11.innerHTML = html;
    if (r.init) r.init(h11);
  };

  // ================= фон главного экрана =================
  const hills = '<svg class="hl3" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice"><g class="hy hy1"><path d="M-80 600C160 520 420 545 650 590S1110 500 1520 570V900H-80Z"/></g><g class="hy hy2"><path d="M-80 690C220 630 520 700 780 680S1230 610 1520 660V900H-80Z"/></g><g class="hy hy3"><path d="M-80 785C280 735 600 800 900 768S1320 735 1520 755V900H-80Z"/></g></svg>';
  const wire = '<svg class="wf" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice"><g class="wf-l"><rect x="60" y="112" width="1320" height="900" rx="18"/><path d="M60 170h1320"/><circle cx="92" cy="141" r="6"/><circle cx="114" cy="141" r="6"/><circle cx="136" cy="141" r="6"/><rect x="980" y="130" width="70" height="22" rx="11"/><rect x="1064" y="130" width="70" height="22" rx="11"/><rect x="1148" y="130" width="70" height="22" rx="11"/><rect x="1240" y="126" width="110" height="30" rx="15"/><rect x="120" y="236" width="440" height="40" rx="10"/><rect x="120" y="290" width="380" height="40" rx="10"/><rect x="120" y="344" width="300" height="40" rx="10"/><rect x="120" y="414" width="400" height="12" rx="6"/><rect x="120" y="436" width="330" height="12" rx="6"/><rect x="120" y="480" width="170" height="48" rx="24"/><rect x="304" y="480" width="130" height="48" rx="24"/><rect x="740" y="226" width="580" height="340" rx="16"/><path d="M740 226l580 340M1320 226 740 566"/><rect x="100" y="628" width="400" height="250" rx="16"/><rect x="520" y="628" width="400" height="250" rx="16"/><rect x="940" y="628" width="400" height="250" rx="16"/></g><g class="wf-d"><path d="M60 80v16M1380 80v16M60 88h580M800 88h580"/><text x="720" y="93">1440</text><path d="M1408 112h16M1408 566h16M1416 112v190M1416 376v190"/><text x="1416" y="344">454</text></g></svg>';
  const CODE = `<section class="hero">
  <h1>Создаю сайты, которые работают на вас</h1>
  <p>От концепции до запуска на вашем домене.</p>
  <a class="btn" href="https://t.me/Dolshanski">Написать в Telegram</a>
</section>

.hero { min-height: 100svh; display: grid; place-items: center; }
.btn  { border-radius: 999px; padding: 0 24px; }
@media (max-width: 900px) { .hero { padding-top: 100px; } }

async function sendLead(form) {
  const data = Object.fromEntries(new FormData(form));
  await fetch('/api/lead', { method: 'POST', body: JSON.stringify(data) });
  form.classList.add('sent');
}

<nav class="menu">
  <a href="#raboty">Работы</a>
  <a href="#uslugi">Услуги</a>
  <a href="#svyaz">Контакты</a>
</nav>

ym(counter, 'reachGoal', 'lead');
<link rel="canonical" href="https://example.ru/">
<meta name="description" content="Сайт, который приводит заявки">`;
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const BG = {
    1: '<i class="g1"></i><i class="gr"></i>',
    2: '<i class="sun"></i><svg class="hill" viewBox="0 0 1440 160" preserveAspectRatio="none"><path d="M0 92C190 34 380 36 580 84S920 150 1100 102 1350 52 1440 70V160H0Z"/></svg><i class="gr"></i>',
    3: hills + '<i class="gr"></i>',
    4: wire,
    5: '<div class="lg"><i></i></div><i class="rl rl-y"></i><i class="rl rl-x"></i><i class="gd"></i>',
    6: '<i class="tg"></i><div class="tl"></div>',
    7: `<pre class="cd">${esc(CODE)}\n<b class="cd-t"></b><i class="cd-k"></i></pre>`,
    8: '<i class="hz"></i><i class="hz2"></i>',
    9: '<i class="sp"></i><i class="vg"></i><i class="gr"></i>',
    10: '<i class="sh"></i><i class="gr"></i>',
  };
  const BGI = {
    3: () => { if (!fine || reduce) return; on('bg', hero, 'pointermove', e => { const r = hero.getBoundingClientRect(); b11.style.setProperty('--px', ((e.clientX - r.left) / r.width - .5).toFixed(3)); }, { passive: true }); },
    6: () => {
      const tl = $('.tl', b11), S = 56; let last = '';
      const lit = (cx, cy, cls = '') => { const d = document.createElement('i'); d.className = cls; d.style.left = cx * S + 'px'; d.style.top = cy * S + 'px'; tl.appendChild(d); setTimeout(() => d.remove(), 1400); };
      if (fine && !reduce) on('bg', hero, 'pointermove', e => { const r = hero.getBoundingClientRect(), cx = Math.floor((e.clientX - r.left) / S), cy = Math.floor((e.clientY - r.top) / S), k = cx + ':' + cy; if (k !== last) { last = k; lit(cx, cy, (cx + cy) % 2 ? 'b' : ''); } }, { passive: true });
      if (!reduce) every('bg', 700, () => { const r = hero.getBoundingClientRect(); lit(Math.floor(Math.random() * r.width / S), Math.floor(Math.random() * r.height / S), 'soft'); });
    },
    7: () => {
      const t = $('.cd-t', b11), P = ['// адаптив под телефон: готово', '// заявки приходят в Telegram', '// сайт добавлен в Яндекс Вебмастер', '// SSL-сертификат выпущен', '// скорость загрузки: 0,9 с'];
      if (reduce) { t.textContent = P[0]; return; }
      let p = 0, c = 0, back = false, wait = 0;
      every('bg', 55, () => {
        if (wait > 0) { wait--; return; }
        const s = P[p];
        if (!back) { c++; if (c >= s.length) { back = true; wait = 40; } }
        else { c -= 2; if (c <= 0) { c = 0; back = false; p = (p + 1) % P.length; wait = 6; } }
        t.textContent = s.slice(0, c);
      });
    },
    9: () => { if (!fine || reduce) return; on('bg', hero, 'pointermove', e => { const r = hero.getBoundingClientRect(); b11.style.setProperty('--mx', (e.clientX - r.left) + 'px'); b11.style.setProperty('--my', (e.clientY - r.top) + 'px'); }, { passive: true }); },
  };
  const renderBG = () => {
    clean('bg'); b11.className = 'b11 bb' + V.bg; b11.innerHTML = BG[V.bg] || '';
    body.classList.toggle('bgdark', V.bg === 9 || V.bg === 10);
    if (BGI[V.bg]) BGI[V.bg]();
  };

  // ================= шапка =================
  const LOGO = $('.hdc-logo .lg6', st).outerHTML;
  const NI = {
    '#raboty': 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z', '#uslugi': 'M5 6h14M5 12h14M5 18h9', '#podhod': 'M4 19h5v-5h5V9h6',
    '#obo-mne': 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 21c1.4-3.8 4.3-5.8 7.5-5.8s6.1 2 7.5 5.8', '#voprosy': 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.6 9.4a2.5 2.5 0 1 1 3.4 2.4c-.6.3-1 .8-1 1.5v.6M12 17.2v.1', '#svyaz': 'M21 3 3 10.5l7 2.6 2.6 7z',
  };
  const links = D.nav.map(([h, t]) => `<a href="${h}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${NI[h]}"/></svg><span>${t}</span></a>`).join('');
  st.insertAdjacentHTML('afterbegin', `<header class="hd11">
    <div class="hd11-top"><div class="hd11-tin"><span>Беру 2-3 проекта в месяц</span><span>Макет бесплатно до оплаты</span><a href="${D.tg}" target="_blank" rel="noopener">Telegram ${D.tgName}</a><a href="${D.price}" target="_blank" rel="noopener">Прайс-лист, PDF</a></div></div>
    <div class="hd11-bar"><div class="hd11-in">
      <a class="logo hdc-logo hd11-logo" href="#top" aria-label="Dolzha, на главную">${LOGO}<span class="wm">Dolzha</span></a>
      <span class="hd11-st"><i></i><span>Беру 2-3 проекта в месяц</span></span>
      <nav class="hd11-nav" aria-label="Разделы"><i class="hd11-ind" aria-hidden="true"></i>${links}</nav>
      <span class="hd11-time" aria-label="Время в Екатеринбурге"></span>
      <a class="hd11-cta" href="#svyaz">Обсудить проект</a>
      <button type="button" class="hd11-menu" aria-expanded="false" aria-controls="hd11-ov"><i class="hm-l" aria-hidden="true"><b></b><b></b></i><span>Меню</span></button>
    </div></div>
  </header>
  <div class="hd11-ov" id="hd11-ov" hidden><div class="hd11-ov-in"><nav class="ov-nav" aria-label="Разделы">${D.nav.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}</nav><div class="ov-c"><p>Связаться</p><a href="${D.tg}" target="_blank" rel="noopener">Telegram ${D.tgName}</a><a href="mailto:${D.mail}">${D.mail}</a><a href="${D.price}" target="_blank" rel="noopener">Прайс-лист, PDF</a></div></div></div>`);
  const hd = $('.hd11', st), ov = $('#hd11-ov'), mb = $('.hd11-menu', hd), nav = $('.hd11-nav', hd), ind = $('.hd11-ind', hd);
  const setMenu = open => { mb.setAttribute('aria-expanded', open); mb.querySelector('span').textContent = open ? 'Закрыть' : 'Меню'; ov.hidden = !open; body.classList.toggle('ov-open', open); hd.classList.toggle('ov', open); if (open) $('a', ov).focus(); };
  mb.addEventListener('click', () => setMenu(mb.getAttribute('aria-expanded') !== 'true'));
  $$('a', ov).forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !ov.hidden) { setMenu(false); mb.focus(); } });
  addEventListener('scroll', () => hd.classList.toggle('sc', scrollY > 10), { passive: true });
  hd.classList.toggle('sc', scrollY > 10);
  // часы Екатеринбурга
  const tm = $('.hd11-time', hd), fmt = new Intl.DateTimeFormat('ru-RU', { timeZone: 'Asia/Yekaterinburg', hour: '2-digit', minute: '2-digit' });
  const tick = () => { tm.textContent = fmt.format(new Date()) + ' в Екатеринбурге'; };
  tick(); setInterval(tick, 15000);
  // бегунок: под пунктом, на который навели, иначе под текущим разделом
  const navA = $$('a', nav); let cur = null;
  const moveInd = a => { if (!a) { ind.style.opacity = 0; return; } ind.style.opacity = 1; ind.style.left = a.offsetLeft + 'px'; ind.style.width = a.offsetWidth + 'px'; };
  navA.forEach(a => a.addEventListener('pointerenter', () => moveInd(a)));
  nav.addEventListener('pointerleave', () => moveInd(cur));
  const secs = D.nav.map(([h]) => document.querySelector(h)).filter(Boolean);
  const spy = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { cur = navA.find(a => a.getAttribute('href') === '#' + e.target.id) || null; if (!nav.matches(':hover')) moveInd(cur); } }), { rootMargin: '-45% 0px -50% 0px' });
  [hero, ...secs].forEach(s => spy.observe(s));
  const renderHH = () => { setMenu(false); moveInd(cur); };

  // ================= цвета логотипа =================
  const LP = [null,
    { c: ['#8BE8C9', '#1FAE95'], h: '#12312B', l: '#FFFFFF', f: '#12312B' },
    { c: ['#1E453C', '#0B1F1B'], h: ['#C6F06A', '#3CC08C'], l: '#FFFFFF', f: '#0B1F1B' },
    { c: ['#D3F477', '#B5E853'], h: '#0F2621', l: '#FFFFFF', f: '#0F2621' },
    { c: ['#22B08F', '#0B5A4C'], h: '#062920', l: '#FFF3D2', f: '#062920' },
    { c: ['#4A5C58', '#1B2523'], h: '#B5E853', l: '#FFFFFF', f: '#1B2523' },
    { c: ['#FFE27D', '#FF9461'], h: '#0F2621', l: '#FFFFFF', f: '#0F2621' },
    { c: ['#A8F0FF', '#3E98EA'], h: '#0F2621', l: '#FFFFFF', f: '#0F2621' },
    { c: ['#FF7BAC', '#7B5CFF'], h: '#1B1238', l: '#FFFFFF', f: '#1B1238' },
    { c: ['#D6F3E2', '#B7E6D0'], h: '#11998E', l: '#0F2621', f: '#D6F3E2' },
    { c: ['#B5E853', '#11998E'], h: '#FFFFFF', l: '#0F2621', f: '#FFFFFF' },
  ];
  const gr = (id, [a, b]) => `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
  body.insertAdjacentHTML('afterbegin', `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>${LP.map((p, i) => p ? gr('lpc' + i, p.c) + (Array.isArray(p.h) ? gr('lph' + i, p.h) : '') : '').join('')}</defs></svg>`);
  const css = LP.map((p, i) => {
    if (!p) return '';
    const s = `body.lp-${i}`, H = Array.isArray(p.h) ? `url(#lph${i})` : p.h;
    return `${s} .lg6 .l6c,${s} .masc svg>circle{fill:url(#lpc${i})}${s} .lg6 .l6h,${s} .masc svg>path{fill:${H}}${s} .lg6 .l6l,${s} .masc .ms-b rect{fill:${p.l}}${s} .lg6 .l6f,${s} .masc .ms-eyes{fill:${p.f}}${s} .lg6 .l6m,${s} .masc .ms-sm{stroke:${p.f}}`;
  }).join('');
  document.head.insertAdjacentHTML('beforeend', `<style id="lp11">${css}</style>`);
  const fav = $('link[rel="icon"]'), fav0 = fav.href;
  const favFor = p => {
    const H = Array.isArray(p.h) ? 'url(%23h)' : p.h.replace('#', '%23'), q = x => x.replace('#', '%23');
    const hd = Array.isArray(p.h) ? `%3ClinearGradient id='h' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='${q(p.h[0])}'/%3E%3Cstop offset='1' stop-color='${q(p.h[1])}'/%3E%3C/linearGradient%3E` : '';
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 52 52'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='${q(p.c[0])}'/%3E%3Cstop offset='1' stop-color='${q(p.c[1])}'/%3E%3C/linearGradient%3E${hd}%3C/defs%3E%3Ccircle cx='26' cy='26' r='25' fill='url(%23g)'/%3E%3Cpath d='M3 34c8-7 15 3 23-3s15-3 24 1v4a25 25 0 0 1-47 0z' fill='${H}'/%3E%3Cg transform='translate(10.36 12.66) scale(.92)'%3E%3Crect width='34' height='23' rx='3.5' fill='${q(p.l)}'/%3E%3Crect x='-3' y='24.5' width='40' height='4.5' rx='2' fill='${q(p.l)}'/%3E%3Ccircle cx='11' cy='10' r='2.4' fill='${q(p.f)}'/%3E%3Ccircle cx='23' cy='10' r='2.4' fill='${q(p.f)}'/%3E%3Cpath d='M11 15c2 3 4.5 4 6 4s4-1 6-4' fill='none' stroke='${q(p.f)}' stroke-width='2.4' stroke-linecap='round'/%3E%3C/g%3E%3C/svg%3E`;
  };
  const renderLP = () => { fav.href = V.lp ? favFor(LP[V.lp]) : fav0; };

  // ================= применение и панель =================
  const R = { hl: renderHL, bg: renderBG, hh: renderHH, lp: renderLP };
  const apply = (k, first) => {
    body.className = body.className.replace(new RegExp(`\\b${k}-\\d+\\b`, 'g'), '').trim() + ` ${k}-${V[k]}`;
    R[k](); if (!first) history.replaceState(null, '', `#hl${V.hl}-bg${V.bg}-hh${V.hh}-lp${V.lp}`);
  };
  G.forEach(([k]) => apply(k, true));
  if (!hm) return;

  body.insertAdjacentHTML('beforeend', `<aside class="p11" aria-label="Варианты"><button type="button" class="p11-t" aria-expanded="true"><span>Варианты, 0 = как сейчас</span><i aria-hidden="true">–</i></button><div class="p11-b">
    ${G.map(([k, n, o]) => `<div class="p11-g"><p class="p11-h"><span>${n}</span><b data-n="${k}">${V[k]}. ${o[V[k]]}</b></p><div class="p11-r" data-k="${k}">${o.map((t, i) => `<button type="button" data-n="${i}" aria-pressed="${V[k] === i}" title="${i}. ${t}">${i}</button>`).join('')}</div></div>`).join('')}
    <div class="p11-f"><button type="button" class="p11-cp">Скопировать выбор</button><span class="p11-ok" hidden>Скопировано</span></div></div></aside>`);
  const pan = $('.p11');
  if (innerWidth <= 900) { pan.classList.add('closed'); $('.p11-t', pan).setAttribute('aria-expanded', 'false'); }
  $('.p11-t', pan).addEventListener('click', e => { const c = pan.classList.toggle('closed'); e.currentTarget.setAttribute('aria-expanded', !c); $('i', e.currentTarget).textContent = c ? '+' : '–'; });
  $$('.p11-r', pan).forEach(g => g.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const k = g.dataset.k; V[k] = +b.dataset.n;
    $$('button', g).forEach(x => x.setAttribute('aria-pressed', x === b));
    $(`[data-n="${k}"]`, pan).textContent = `${V[k]}. ${G.find(x => x[0] === k)[2][V[k]]}`;
    apply(k);
  }));
  $('.p11-cp', pan).addEventListener('click', () => {
    const txt = G.map(([k, n, o]) => `${n} ${V[k]} (${o[V[k]]})`).join('; ');
    const ok = () => { $('.p11-ok', pan).hidden = false; setTimeout(() => { $('.p11-ok', pan).hidden = true; }, 2500); };
    (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(ok, () => prompt('Скопируйте строку:', txt));
  });
})();
