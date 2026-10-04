/* Двенадцатый круг (04.10): «Работы», «Услуги», «Один человек за весь сайт», «Обо мне» по 10 вариантов. 0 = как сейчас.
   Классы на body: w12-N s12-N p12-N a12-N; адрес #w1-s1-p1-a1; localStorage v12-*. Клик по работе открывает подробную карточку из site6. */
(function () {
  const D = window.D, ic = window.SB.ic, body = document.body, st = document.getElementById('stage');
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, fine = matchMedia('(pointer:fine)').matches;
  const ls = { get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} } };
  const W = D.works, INFO = window.WINFO || {};
  const ORD = ['gurumotors', 'veha', 'norden', 'bambini', 'garage', 'private', 'once', 'mentors', 'zest', 'porfume'];

  const G = [
    ['w', 'Работы', ['Как сейчас', 'Журнал', 'Бенто', 'Лента вбок', 'Список с превью', 'Карусель', 'Компьютер / телефон', 'Шторки', 'Фильтр', 'Витрина с описанием', 'Стопка', 'Слайдер с миниатюрами', 'Две колонки крупно', 'Главная и список', 'Ноутбуки', 'Кирпичная кладка', 'Цвет проекта', 'Строки-аккордеон', 'Колонны с параллаксом', 'Плитки с разворотом', 'Одна крупно и лента']],
    ['s', 'Услуги', ['Как сейчас', 'Тарифы', 'Вкладки', 'Калькулятор', 'Сравнение', 'Строки', 'Смета', 'Перевёртыши', 'Лестница', 'Тёмные с подсветкой', 'Колонны']],
    ['p', 'Один человек', ['Как сейчас', 'Змейка 3+2', 'Змейка 2+2+1', 'Зигзаг вниз', 'Змейка вбок', 'Пунктир и маскот']],
    ['a', 'Обо мне', ['Как сейчас', 'Колода', 'Полароиды', 'Свайп', 'Миниатюры', 'Истории', 'Плёнка', 'Веер', 'Коллаж', 'Смена прокруткой', 'Кружки']],
  ];
  // выбор Роберта 04.10: работы 2 «Бенто», услуги 7 «Перевёртыши» (переворот по кнопке), обо мне 0 (как было, новые стрелки).
  // Открыт только «Один человек»: он один на панели. Ссылка вида #w5-s3-p1-a2 показывает другие варианты и всю панель.
  const V = { w: 2, s: 7, p: 1, a: 0 };
  { const v = ls.get('v13-p'); if (v !== null && /^[0-5]$/.test(v)) V.p = +v; }
  { const v = ls.get('v13-w'); if (v !== null && /^(1\d|20|\d)$/.test(v)) V.w = +v; } // 04.10: «Работы» снова выбираем, 20 вариантов
  const hm = location.hash.match(/^#w(\d+)-s(\d+)-p(\d+)-a(\d+)$/);
  if (hm) G.forEach(([k], i) => { const n = +hm[i + 1]; if (n < G[i][2].length) V[k] = n; });

  const bag = { w: [], s: [], p: [], a: [] };
  const every = (k, ms, fn) => { const id = setInterval(fn, ms); bag[k].push(() => clearInterval(id)); };
  const on = (k, el, ev, fn, o) => { el.addEventListener(ev, fn, o); bag[k].push(() => el.removeEventListener(ev, fn, o)); };
  const watch = (k, els, fn, opt) => { const io = new IntersectionObserver(fn, opt); els.forEach(e => io.observe(e)); bag[k].push(() => io.disconnect()); };
  const clean = k => { bag[k].forEach(f => f()); bag[k] = []; };
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const num = s => +String(s).replace(/\D/g, '');
  const rub = n => n.toLocaleString('ru-RU') + ' ₽';
  const tags = k => `<ul class="tg12">${W[k].tags.map(t => `<li>${t}</li>`).join('')}</ul>`;
  const more = `<span class="mo12"><span>Подробнее</span>${ic.right}</span>`;
  // картинка работы; при наведении листается длинный снимок страницы
  const shot = (k, cls = '', src = `img/w/${k}.jpg`, l = '') => `<span class="hs ${cls}" data-k="${k}"${l ? ` data-l="${l}"` : ''}><img src="${src}" alt="Сайт ${esc(W[k].name)}" loading="lazy" decoding="async"><img class="lng" alt="" aria-hidden="true"></span>`;
  const card = (k, cls, inner) => `<a class="${cls}" href="${W[k].url}" data-k="${k}">${inner}</a>`;

  // секции и контейнеры вариантов
  const SEC = { w: $('#raboty', st), s: $('#uslugi', st), p: $('#podhod', st), a: $('#obo-mne', st) };
  const BOX = {};
  Object.entries(SEC).forEach(([k, sec]) => { const call = k === 'p' && $('.ap-call', sec); const html = `<div class="x12 x12-${k}"></div>`; call ? call.insertAdjacentHTML('beforebegin', html) : sec.insertAdjacentHTML('beforeend', html); BOX[k] = $('.x12', sec); });

  // подробная карточка работы: нажимаем на скрытую исходную карточку, у неё уже есть обработчик
  BOX.w.addEventListener('click', e => { const a = e.target.closest('a[data-k]'); if (!a || e.target.closest('[data-skip]')) return; e.preventDefault(); const o = $(`#raboty .wk-${a.dataset.k}`); o && o.click(); });
  const hsGo = el => {
    const l = $('.lng', el); if (!l || reduce) return;
    const go = () => { el.style.setProperty('--h', el.clientHeight + 'px'); el.style.setProperty('--d', Math.max(4, Math.min(11, l.naturalHeight / l.naturalWidth * 2.2)) + 's'); el.classList.add('go'); };
    if (!l.getAttribute('src')) { l.src = el.dataset.l || `img/long/${el.dataset.k}.jpg`; l.onload = () => el.matches(':hover') && go(); } else if (l.complete) go();
  };
  if (fine) {
    st.addEventListener('pointerover', e => { const el = e.target.closest('.x12 .hs'); if (el && !el.classList.contains('go')) hsGo(el); });
    st.addEventListener('pointerout', e => { const el = e.target.closest('.x12 .hs'); if (el && !el.contains(e.relatedTarget)) el.classList.remove('go'); });
  }

  const HEAD_W = `<div class="h12"><h2 class="h2">Живые сайты, а не картинки</h2><p class="l12">Каждая работа открывается по кнопке. Это реальный сайт реального бизнеса.</p></div>`;

  // ================= РАБОТЫ =================
  const WK = {
    1: () => { // журнал: крупные строки с описанием, остальные сеткой
      const F = ORD.slice(0, 4), R = ORD.slice(4);
      return `<div class="wrap">${HEAD_W}<div class="xw1-rows">${F.map(k => card(k, 'xw1-row', `${shot(k)}<span class="xw1-tx"><span class="xw1-b">${W[k].biz}</span><b class="xw1-n">${W[k].name}</b><span class="xw1-d">${INFO[k] || ''}</span>${tags(k)}${more}</span>`)).join('')}</div><div class="xw1-more">${R.map(k => card(k, 'xw1-c', `${shot(k, '', `img/w/${k}-s.jpg`)}<b>${W[k].name}</b><span>${W[k].biz}</span>`)).join('')}</div></div>`;
    },
    2: () => { // 04.10 Роберт: ВЕХА обычной карточкой справа от Guru Motors, под ней NORDEN и Bambini; ниже шесть одинаковых в два ряда
      const T = ['gurumotors', 'veha', 'norden', 'bambini'], B = ['mentors', 'zest', 'once', 'garage', 'private', 'porfume'];
      const tile = k => card(k, `xw2-t xw2-${k}`, `${k === 'gurumotors' ? shot(k, '', 'img/w/gurumotors-tall.jpg') : shot(k)}<span class="xw2-l"><b>${W[k].name}</b><span>${W[k].biz}</span></span>`);
      return `<div class="wrap">${HEAD_W}<div class="xw2-g">${T.map(tile).join('')}</div><div class="xw2-b">${B.map(tile).join('')}</div></div>`;
    },
    3: () => ({ html: `<div class="xw3"><div class="xw3-pin"><div class="wrap xw3-top">${HEAD_W}<div class="xw3-c"><b>01</b> / ${String(ORD.length).padStart(2, '0')}</div></div><div class="xw3-tr">${ORD.map(k => card(k, 'xw3-s', `${shot(k)}<span class="xw3-m"><b>${W[k].name}</b><span>${W[k].biz}</span>${tags(k)}</span>`)).join('')}</div><div class="wrap"><i class="xw3-bar"><i></i></i></div></div></div>`,
      init: box => {
        const xw3 = $('.xw3', box), tr = $('.xw3-tr', box), bar = $('.xw3-bar i', box), cnt = $('.xw3-c b', box);
        if (innerWidth <= 900) { on('w', tr, 'scroll', () => { const p = tr.scrollLeft / (tr.scrollWidth - tr.clientWidth || 1); bar.style.transform = `scaleX(${p})`; cnt.textContent = String(Math.min(ORD.length, Math.round(p * (ORD.length - 1)) + 1)).padStart(2, '0'); }, { passive: true }); return; }
        const size = () => { const dist = tr.scrollWidth - innerWidth + 120; xw3.style.height = (innerHeight + dist) + 'px'; xw3.dataset.dist = dist; };
        const upd = () => { const r = xw3.getBoundingClientRect(), dist = +xw3.dataset.dist, p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight || 1))); tr.style.transform = `translateX(${-p * dist}px)`; bar.style.transform = `scaleX(${p})`; cnt.textContent = String(Math.min(ORD.length, Math.floor(p * ORD.length) + 1)).padStart(2, '0'); };
        size(); upd(); on('w', window, 'scroll', upd, { passive: true }); on('w', window, 'resize', () => { size(); upd(); });
        if (document.fonts) document.fonts.ready.then(() => { size(); upd(); });
        $$('img', tr).forEach(i => i.addEventListener('load', () => { size(); upd(); }, { once: true }));
      } }),
    4: () => ({ html: `<div class="wrap">${HEAD_W}<div class="xw4-l">${ORD.map((k, i) => card(k, 'xw4-r', `<span class="xw4-th"><img src="img/w/${k}-s.jpg" alt="" loading="lazy"></span><b class="xw4-n">${W[k].name}</b><span class="xw4-b">${W[k].biz}</span><span class="xw4-t">${W[k].tags.join(' и ')}</span><svg class="xw4-go" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>`)).join('')}</div></div><div class="xw4-pv" aria-hidden="true">${ORD.map(k => `<img src="img/w/${k}.jpg" alt="" data-k="${k}" loading="lazy">`).join('')}</div>`,
      init: box => {
        const pv = $('.xw4-pv', box), ims = $$('img', pv); body.appendChild(pv); bag.w.push(() => pv.remove()); let x = 0, y = 0, cx = 0, cy = 0, raf = 0, shown = false;
        const tick = () => { cx += (x - cx) * .18; cy += (y - cy) * .18; pv.style.transform = `translate3d(${cx}px,${cy}px,0) rotate(${Math.max(-6, Math.min(6, (x - cx) * .06))}deg)`; raf = Math.abs(x - cx) + Math.abs(y - cy) > .5 ? requestAnimationFrame(tick) : 0; };
        $$('.xw4-r', box).forEach(r => {
          r.addEventListener('pointerenter', () => { ims.forEach(m => m.classList.toggle('on', m.dataset.k === r.dataset.k)); pv.classList.add('show'); if (!shown) { cx = x; cy = y; shown = true; } });
          r.addEventListener('pointerleave', () => pv.classList.remove('show'));
        });
        on('w', $('.xw4-l', box), 'pointermove', e => { x = e.clientX + 24; y = e.clientY - 120; if (!raf) raf = requestAnimationFrame(tick); }, { passive: true });
      } }),
    5: () => ({ html: `<div class="wrap">${HEAD_W}<div class="xw5"><div class="xw5-st" tabindex="0" aria-label="Работы, листайте стрелками">${ORD.map(k => card(k, 'xw5-s', shot(k))).join('')}</div><div class="xw5-cap"><button type="button" class="xw5-b xw5-pv" aria-label="Предыдущая работа">${ic.right}</button><div class="xw5-tx"><b class="xw5-n"></b><span class="xw5-bz"></span></div><button type="button" class="xw5-b xw5-nx" aria-label="Следующая работа">${ic.right}</button></div></div></div>`,
      init: box => {
        const ss = $$('.xw5-s', box), n = ss.length; let c = 0;
        const lay = () => { ss.forEach((s, i) => { let o = i - c; if (o > n / 2) o -= n; if (o < -n / 2) o += n; const a = Math.abs(o); s.style.setProperty('--o', o); s.style.setProperty('--a', a); s.classList.toggle('cur', o === 0); s.tabIndex = o === 0 ? 0 : -1; s.setAttribute('data-skip', ''); if (o === 0) s.removeAttribute('data-skip'); }); $('.xw5-n', box).textContent = W[ORD[c]].name; $('.xw5-bz', box).textContent = W[ORD[c]].biz; };
        const go = d => { c = (c + d + n) % n; lay(); };
        ss.forEach((s, i) => s.addEventListener('click', e => { if (!s.classList.contains('cur')) { e.preventDefault(); e.stopPropagation(); c = i; lay(); } }));
        $('.xw5-pv', box).addEventListener('click', () => go(-1)); $('.xw5-nx', box).addEventListener('click', () => go(1));
        $('.xw5-st', box).addEventListener('keydown', e => { if (e.key === 'ArrowLeft') go(-1); if (e.key === 'ArrowRight') go(1); });
        let sx = null; const stg = $('.xw5-st', box);
        stg.addEventListener('pointerdown', e => { sx = e.clientX; });
        stg.addEventListener('pointerup', e => { if (sx !== null && Math.abs(e.clientX - sx) > 50) { go(e.clientX < sx ? 1 : -1); } sx = null; });
        lay();
      } }),
    6: () => ({ html: `<div class="wrap"><div class="xw6-h">${HEAD_W}<div class="xw6-sw" role="group" aria-label="Версия сайта"><button type="button" data-v="pc" aria-pressed="true">Компьютер</button><button type="button" data-v="ph" aria-pressed="false">Телефон</button><i></i></div></div><div class="xw6 pc">${ORD.map(k => card(k, 'xw6-c', `<span class="xw6-pc">${shot(k)}</span><span class="xw6-ph"><span class="xw6-fr"><span class="xw6-sb"><b>9:41</b></span><span class="xw6-vp"><img src="img/mob/${k}.jpg" alt="Мобильная версия сайта ${esc(W[k].name)}" loading="lazy"></span></span></span><b class="xw6-n">${W[k].name}</b><span class="xw6-b">${W[k].biz}</span>`)).join('')}</div></div>`,
      init: box => { const g = $('.xw6', box), bs = $$('.xw6-sw button', box); bs.forEach(b => b.addEventListener('click', () => { bs.forEach(x => x.setAttribute('aria-pressed', x === b)); g.classList.toggle('pc', b.dataset.v === 'pc'); g.classList.toggle('ph', b.dataset.v === 'ph'); $('.xw6-sw', box).classList.toggle('r', b.dataset.v === 'ph'); })); } }),
    7: () => ({ html: `<div class="wrap">${HEAD_W}<div class="xw7">${ORD.map((k, i) => card(k, `xw7-s${i ? '' : ' on'}`, `<img src="img/w/${k}.jpg" alt="Сайт ${esc(W[k].name)}" loading="lazy"><span class="xw7-v">${W[k].name}</span><span class="xw7-m"><b>${W[k].name}</b><span>${W[k].biz}</span>${tags(k)}</span>`)).join('')}</div></div>`,
      init: box => { const ss = $$('.xw7-s', box); const set = s => ss.forEach(x => x.classList.toggle('on', x === s)); ss.forEach(s => { s.addEventListener('pointerenter', () => set(s)); s.addEventListener('focus', () => set(s)); }); } }),
    8: () => {
      const CAT = [['Все', ORD], ['Авто и тюнинг', ['gurumotors', 'garage', 'norden']], ['Услуги и недвижимость', ['veha', 'mentors', 'bambini']], ['Магазины', ['once', 'porfume']], ['Кафе и галерея', ['zest', 'private']]];
      return { html: `<div class="wrap"><div class="xw8-h">${HEAD_W}<div class="xw8-f" role="group" aria-label="Фильтр работ">${CAT.map(([t, l], i) => `<button type="button" data-i="${i}" aria-pressed="${!i}">${t}<sup>${l.length}</sup></button>`).join('')}</div></div><div class="xw8">${ORD.map(k => card(k, 'xw8-c', `${shot(k)}<span class="xw8-m"><b>${W[k].name}</b><span>${W[k].biz}</span></span>${tags(k)}`)).join('')}</div></div>`,
        init: box => {
          const cs = $$('.xw8-c', box), bs = $$('.xw8-f button', box);
          bs.forEach(b => b.addEventListener('click', () => {
            bs.forEach(x => x.setAttribute('aria-pressed', x === b)); const keep = CAT[+b.dataset.i][1];
            const first = new Map(cs.map(c => [c, c.getBoundingClientRect()]));
            cs.forEach(c => c.classList.toggle('out', !keep.includes(c.dataset.k)));
            if (reduce) return;
            cs.forEach(c => { if (c.classList.contains('out')) return; const a = first.get(c), z = c.getBoundingClientRect(); if (!a.width) { c.animate([{ opacity: 0, transform: 'scale(.94)' }, { opacity: 1, transform: 'none' }], { duration: 400, easing: 'cubic-bezier(.2,.8,.2,1)' }); return; } c.animate([{ transform: `translate(${a.left - z.left}px,${a.top - z.top}px)` }, { transform: 'none' }], { duration: 500, easing: 'cubic-bezier(.2,.8,.2,1)' }); });
          }));
        } };
    },
    9: () => ({ html: `<div class="wrap">${HEAD_W}<div class="xw9"><div class="xw9-pan"><div class="xw9-in"><span class="xw9-c"><b>01</b> / ${String(ORD.length).padStart(2, '0')}</span><b class="xw9-n"></b><span class="xw9-b"></span><p class="xw9-d"></p><div class="xw9-t"></div><a class="xw9-go" href="#" data-k=""><span>Подробнее о работе</span>${ic.arrow}</a></div></div><div class="xw9-l">${ORD.map((k, i) => card(k, 'xw9-s', `${shot(k)}<span class="xw9-mob"><b>${W[k].name}</b><span>${W[k].biz}</span></span>`)).join('')}</div></div></div>`,
      init: box => {
        const pan = $('.xw9-in', box);
        const set = k => { const i = ORD.indexOf(k); $('.xw9-c b', box).textContent = String(i + 1).padStart(2, '0'); $('.xw9-n', box).textContent = W[k].name; $('.xw9-b', box).textContent = W[k].biz; $('.xw9-d', box).textContent = INFO[k] || ''; $('.xw9-t', box).innerHTML = tags(k); const g = $('.xw9-go', box); g.dataset.k = k; g.href = W[k].url; pan.classList.remove('sw'); void pan.offsetWidth; pan.classList.add('sw'); };
        set(ORD[0]);
        watch('w', $$('.xw9-s', box), es => es.forEach(e => { if (e.isIntersecting) set(e.target.dataset.k); }), { rootMargin: '-45% 0px -45% 0px' });
      } }),
    10: () => {
      const F = ORD.slice(0, 6), R = ORD.slice(6);
      return `<div class="wrap">${HEAD_W}<div class="xw10">${F.map((k, i) => card(k, 'xw10-c', `<span class="xw10-in">${shot(k)}<span class="xw10-tx"><span class="xw10-i">${String(i + 1).padStart(2, '0')}</span><b>${W[k].name}</b><span class="xw10-b">${W[k].biz}</span><span class="xw10-d">${INFO[k] || ''}</span>${tags(k)}${more}</span></span>`).replace('class="xw10-c"', `class="xw10-c" style="--i:${i}"`)).join('')}</div><div class="xw10-more">${R.map(k => card(k, 'xw1-c', `${shot(k, '', `img/w/${k}-s.jpg`)}<b>${W[k].name}</b><span>${W[k].biz}</span>`)).join('')}</div></div>`;
    },
    // ---------- 04.10, ещё 10 вариантов «Работ» (11-20) ----------
    11: () => ({ html: `<div class="wrap">${HEAD_W}<div class="xw11"><div class="xw11-st">${ORD.map((k, i) => card(k, `xw11-s${i ? '' : ' on'}`, `${shot(k)}<span class="xw11-cap"><b>${W[k].name}</b><span>${W[k].biz}</span>${more}</span>`)).join('')}<button type="button" class="xw11-b xw11-pv" aria-label="Предыдущая работа">${ic.right}</button><button type="button" class="xw11-b xw11-nx" aria-label="Следующая работа">${ic.right}</button></div><div class="xw11-th" role="group" aria-label="Работы">${ORD.map((k, i) => `<button type="button" data-i="${i}" aria-pressed="${!i}" aria-label="${esc(W[k].name)}"><img src="img/w/${k}-s.jpg" alt="" loading="lazy"></button>`).join('')}</div></div></div>`,
      init: box => { // слайдер на всю ширину с миниатюрами, сам листается
        const ss = $$('.xw11-s', box), th = $$('.xw11-th button', box), st_ = $('.xw11', box); let i = 0;
        const set = n => { i = (n + ss.length) % ss.length; ss.forEach((s, j) => { s.classList.toggle('on', j === i); s.tabIndex = j === i ? 0 : -1; }); th.forEach((b, j) => b.setAttribute('aria-pressed', j === i)); th[i].scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' }); };
        $('.xw11-pv', box).addEventListener('click', () => set(i - 1)); $('.xw11-nx', box).addEventListener('click', () => set(i + 1));
        th.forEach(b => b.addEventListener('click', () => set(+b.dataset.i)));
        if (!reduce) every('w', 5000, () => { if (!st_.matches(':hover') && !st_.contains(document.activeElement)) set(i + 1); });
      } }),
    12: () => `<div class="wrap">${HEAD_W}<div class="xw12">${ORD.map(k => card(k, 'xw12-c', `${shot(k)}<span class="xw12-m"><b>${W[k].name}</b><span>${W[k].biz}</span></span>${tags(k)}`)).join('')}</div></div>`,
    13: () => ({ html: `<div class="wrap">${HEAD_W}<div class="xw13"><div class="xw13-f">${ORD.map((k, i) => card(k, `xw13-big${i ? '' : ' on'}`, `${shot(k)}<span class="xw13-tx"><b>${W[k].name}</b><span>${W[k].biz}</span><span class="xw13-d">${INFO[k] || ''}</span>${more}</span>`)).join('')}</div><ul class="xw13-l">${ORD.map((k, i) => `<li><button type="button" data-i="${i}" aria-pressed="${!i}"><img src="img/w/${k}-s.jpg" alt="" loading="lazy"><span><b>${W[k].name}</b><span>${W[k].biz}</span></span></button></li>`).join('')}</ul></div></div>`,
      init: box => { const bs = $$('.xw13-l button', box), bg = $$('.xw13-big', box); const set = i => { bs.forEach((b, j) => b.setAttribute('aria-pressed', j === i)); bg.forEach((b, j) => b.classList.toggle('on', j === i)); }; bs.forEach((b, i) => { b.addEventListener('click', () => set(i)); b.addEventListener('pointerenter', () => fine && set(i)); }); } }),
    14: () => `<div class="wrap">${HEAD_W}<div class="xw14">${ORD.map(k => card(k, 'xw14-c', `<span class="xw14-lap"><span class="xw14-scr">${shot(k)}</span><i class="xw14-base"></i></span><span class="xw14-m"><b>${W[k].name}</b><span>${W[k].biz}</span></span>`)).join('')}</div></div>`,
    15: () => {
      const H = [1.25, .8, 1.05, .7, 1.2, .9, .75, 1.1, .85, 1]; // разная высота кирпичей: видно больше или меньше страницы
      return `<div class="wrap">${HEAD_W}<div class="xw15">${ORD.map((k, i) => card(k, 'xw15-c', `<span class="hs xw15-h" data-k="${k}" style="aspect-ratio:1/${H[i]}"><img src="img/long/${k}.jpg" alt="Сайт ${esc(W[k].name)}" loading="lazy" decoding="async"><img class="lng" alt="" aria-hidden="true"></span><span class="xw15-m"><b>${W[k].name}</b><span>${W[k].biz}</span></span>`)).join('')}</div></div>`;
    },
    16: () => {
      const C = { gurumotors: ['#17110D', '#fff', '#FF6A13'], veha: ['#E6EDE9', '#1E2D29', '#4F8F74'], norden: ['#101317', '#fff', '#C9D1D9'], bambini: ['#FFEEDD', '#3A2A1A', '#FF7A59'], garage: ['#1B1D20', '#fff', '#F5A524'], private: ['#F1E4D8', '#3B2A22', '#C2643F'], once: ['#F4ECDF', '#2E2219', '#8C5A3C'], mentors: ['#0F1B3D', '#fff', '#5B84FF'], zest: ['#170B2B', '#fff', '#F7E01B'], porfume: ['#EFE6DF', '#2B211C', '#9C7457'] };
      return `<div class="wrap">${HEAD_W}<div class="xw16">${ORD.map(k => card(k, 'xw16-c', `<span class="xw16-tx"><b>${W[k].name}</b><span>${W[k].biz}</span>${tags(k)}</span>${shot(k)}`).replace('class="xw16-c"', `class="xw16-c" style="--bg:${C[k][0]};--ink:${C[k][1]};--ac:${C[k][2]}"`)).join('')}</div></div>`;
    },
    17: () => ({ html: `<div class="wrap">${HEAD_W}<div class="xw17">${ORD.map((k, i) => `<details class="xw17-r"${i ? '' : ' open'}><summary><span class="xw17-i">${String(i + 1).padStart(2, '0')}</span><b>${W[k].name}</b><span class="xw17-b">${W[k].biz}</span><span class="xw17-t">${W[k].tags.join(', ')}</span><i class="xw17-x" aria-hidden="true"></i></summary><div class="xw17-in">${card(k, 'xw17-shot', shot(k))}<div class="xw17-tx"><p>${INFO[k] || ''}</p>${card(k, 'xw17-go', `<span>Подробнее о работе</span>${ic.arrow}`)}</div></div></details>`).join('')}</div></div>`,
      init: box => $$('.xw17-r', box).forEach(d => d.addEventListener('toggle', () => { if (d.open) $$('.xw17-r', box).forEach(o => { if (o !== d) o.open = false; }); })) }),
    18: () => ({ html: `<div class="wrap">${HEAD_W}<div class="xw18"><div class="xw18-col">${ORD.filter((_, i) => i % 2 === 0).map(k => card(k, 'xw18-c', `${shot(k)}<span class="xw18-m"><b>${W[k].name}</b><span>${W[k].biz}</span></span>`)).join('')}</div><div class="xw18-col xw18-r">${ORD.filter((_, i) => i % 2).map(k => card(k, 'xw18-c', `${shot(k)}<span class="xw18-m"><b>${W[k].name}</b><span>${W[k].biz}</span></span>`)).join('')}</div></div></div>`,
      init: box => { // правая колонка едет медленнее левой
        if (reduce || innerWidth <= 900) return; const g = $('.xw18', box), r = $('.xw18-r', box);
        const upd = () => { const q = g.getBoundingClientRect(), p = (innerHeight - q.top) / (innerHeight + q.height); r.style.transform = `translateY(${(p - .5) * -160}px)`; };
        upd(); on('w', window, 'scroll', upd, { passive: true });
      } }),
    19: () => ({ html: `<div class="wrap">${HEAD_W}<div class="xw19">${ORD.map((k, i) => `<div class="xw19-c" data-i="${i}"><button type="button" class="xw19-t" aria-expanded="false"><img src="img/w/${k}-s.jpg" alt="Сайт ${esc(W[k].name)}" loading="lazy"><span><b>${W[k].name}</b><span>${W[k].biz}</span></span></button><div class="xw19-o">${card(k, 'xw19-shot', shot(k))}<div class="xw19-tx"><b>${W[k].name}</b><span>${W[k].biz}</span><p>${INFO[k] || ''}</p>${tags(k)}${card(k, 'xw19-go', `<span>Подробнее о работе</span>${ic.arrow}`)}</div></div></div>`).join('')}</div></div>`,
      init: box => { const cs = $$('.xw19-c', box); cs.forEach(c => $('.xw19-t', c).addEventListener('click', () => { const on_ = !c.classList.contains('open'); cs.forEach(x => { x.classList.remove('open'); $('.xw19-t', x).setAttribute('aria-expanded', 'false'); }); if (on_) { c.classList.add('open'); $('.xw19-t', c).setAttribute('aria-expanded', 'true'); setTimeout(() => c.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 80); } })); } }),
    20: () => {
      const [S1, ...R] = ORD;
      return `<div class="wrap">${HEAD_W}${card(S1, 'xw20-star', `${shot(S1, '', 'img/w/gurumotors-tall.jpg')}<span class="xw20-tx"><b>${W[S1].name}</b><span class="xw20-b">${W[S1].biz}</span><span class="xw20-d">${INFO[S1] || ''}</span>${tags(S1)}${more}</span>`)}</div><div class="xw20-row">${R.map(k => card(k, 'xw20-c', `${shot(k)}<b>${W[k].name}</b><span>${W[k].biz}</span>`)).join('')}</div>`;
    },
  };

  // ================= УСЛУГИ =================
  const S = D.svc, X = D.extras;
  const pr = s => `${s.from ? '<small>от</small> ' : ''}${s.price}&nbsp;₽`;
  const chk = '<svg class="ck12" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7"/></svg>';
  const incL = s => `<ul class="inc12">${s.inc.map(t => `<li>${chk}<span>${t}</span></li>`).join('')}</ul>`;
  const talk = (t = 'Обсудить') => `<a class="b12" href="${D.tg}" target="_blank" rel="noopener"><span>${t}</span>${ic.arrow}</a>`;
  const pdf = `<a class="pdf12" href="${D.price}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h7l4 4v14H7zM14 3v4h4M10 13h5M10 17h5"/></svg><span>Прайс-лист, PDF</span></a>`;
  const HEAD_S = (lead = 'Цены «от»: итог зависит от состава сайта. Сроки в рабочих днях.') => `<div class="h12"><h2 class="h2">Услуги</h2><p class="l12">${lead}</p></div>`;
  const xRows = (cls = 'xr12') => `<div class="${cls}"><h3>Дополнительно</h3><ul>${X.map(([t, p, d]) => `<li><b>${t}</b><span>${d}</span><em>${p}&nbsp;₽</em></li>`).join('')}</ul></div>`;
  const xChips = () => `<div class="xc12"><span class="xc12-h">Дополнительно:</span>${X.map(([t, p]) => `<span class="xc12-i">${t} <b>${p}&nbsp;₽</b></span>`).join('')}</div>`;
  const payTxt = () => `<p class="pay12">Оплата частями: ${D.pay.map(p => `${p.split} (${p.when.toLowerCase()})`).join(', ')}. ${D.payNote}</p>`;
  const SV = {
    1: () => `<div class="wrap">${HEAD_S()}<div class="xs1">${S.map((s, i) => `<article class="xs1-c${i === 1 ? ' hot' : ''}"><h3>${s.name}</h3><p class="xs1-l">${s.line}</p><p class="xs1-p">${pr(s)}</p><p class="xs1-d">${s.days}</p>${incL(s)}${talk()}</article>`).join('')}</div>${xChips()}<div class="s12-f">${payTxt()}${pdf}</div></div>`,
    2: () => ({ html: `<div class="wrap">${HEAD_S()}<div class="xs2"><div class="xs2-t" role="tablist" aria-label="Услуги">${S.map((s, i) => `<button type="button" role="tab" aria-selected="${!i}" data-i="${i}"><b>${s.name}</b><span>${s.from ? 'от ' : ''}${s.price} ₽</span></button>`).join('')}</div><div class="xs2-p" role="tabpanel"></div></div>${xRows()}<div class="s12-f">${payTxt()}${pdf}</div></div>`,
      init: box => { const p = $('.xs2-p', box), bs = $$('.xs2-t button', box); const set = i => { const s = S[i]; bs.forEach((b, j) => b.setAttribute('aria-selected', j === i)); p.innerHTML = `<div class="xs2-top"><h3>${s.name}</h3><p class="xs2-pr">${pr(s)}</p></div><p class="xs2-d">${s.desc}</p><p class="xs2-dy">${s.days}</p>${incL(s)}${talk('Обсудить ' + s.name.toLowerCase())}`; p.classList.remove('sw'); void p.offsetWidth; p.classList.add('sw'); }; bs.forEach((b, i) => b.addEventListener('click', () => set(i))); set(0); } }),
    3: () => ({ html: `<div class="wrap">${HEAD_S('Соберите состав и сразу увидите цену и график оплаты.')}<div class="xs3"><div class="xs3-l"><p class="xs3-q">Что нужно</p><div class="xs3-o">${S.map((s, i) => `<label class="xs3-r"><input type="radio" name="xs3" value="${i}"${i ? '' : ' checked'}><span><b>${s.name}</b><small>${s.line}</small></span><em>${s.from ? 'от ' : ''}${s.price} ₽</em></label>`).join('')}</div><p class="xs3-q">Дополнительно</p><div class="xs3-o">${X.map(([t, p, d], i) => `<label class="xs3-x"><input type="checkbox" value="${i}"><span><b>${t}</b><small>${d}</small></span><em>+${p} ₽</em></label>`).join('')}</div></div><div class="xs3-r2"><div class="xs3-sum"><p>Итого</p><b class="xs3-t"></b><p class="xs3-dy"></p><ul class="xs3-pay"></ul><p class="xs3-n">${D.payNote}</p>${talk('Обсудить этот состав')}${pdf}</div></div></div></div>`,
      init: box => {
        const upd = () => {
          const i = +$('input[name=xs3]:checked', box).value, s = S[i]; let t = num(s.price);
          $$('.xs3-x input', box).forEach(c => { c.closest('label').classList.toggle('on', c.checked); if (c.checked) t += num(X[+c.value][1]); });
          $$('.xs3-r', box).forEach(l => l.classList.toggle('on', $('input', l).checked));
          $('.xs3-t', box).innerHTML = (s.from ? '<small>от</small> ' : '') + rub(t); $('.xs3-dy', box).textContent = s.days;
          const p = t < 40000 ? D.pay[0] : D.pay[1];
          $('.xs3-pay', box).innerHTML = p.parts.map(([pc, w]) => `<li><b>${rub(Math.round(t * pc / 100))}</b><span>${pc}% ${w}</span></li>`).join('');
        };
        $$('input', box).forEach(c => c.addEventListener('change', upd)); upd();
      } }),
    4: () => {
      const R = [['Главный экран, услуги и цены, фото работ', [1, 1, 1]], ['Отзывы, адрес, график, как добраться', [1, 1, 1]], ['Кнопки звонка и мессенджеров, форма заявки', [1, 1, 1]], ['Своя страница под каждую услугу', [0, 1, 0]], ['Каждая страница под свой поисковый запрос', [0, 1, 0]], ['Каталог по разделам, поиск и фильтры', [0, 0, 1]], ['Карточка товара: фото, цена, наличие', [0, 0, 1]], ['Заказы с сайта в Telegram', [0, 0, 1]], ['Панель управления', ['+5 000 ₽', '+5 000 ₽', 1]]];
      const T = S.slice(0, 3), c = v => v === 1 ? `<span class="xs4-y">${chk}<i class="sr">есть</i></span>` : v === 0 ? '<span class="xs4-n" aria-label="нет">—</span>' : `<span class="xs4-x">${v}</span>`;
      return `<div class="wrap">${HEAD_S()}<div class="xs4-w"><table class="xs4"><thead><tr><th></th>${T.map((s, i) => `<th class="${i === 1 ? 'hot' : ''}"><b>${s.name}</b><span>${pr(s)}</span><small>${s.days}</small></th>`).join('')}</tr></thead><tbody>${R.map(([t, v]) => `<tr><td>${t}</td>${v.map((x, i) => `<td class="${i === 1 ? 'hot' : ''}">${c(x)}</td>`).join('')}</tr>`).join('')}</tbody><tfoot><tr><td></td>${T.map((s, i) => `<td class="${i === 1 ? 'hot' : ''}">${talk()}</td>`).join('')}</tr></tfoot></table></div><div class="xs4-card"><div><h3>${S[3].name}</h3><p>${S[3].line}</p></div><p class="xs4-cp">${pr(S[3])}<small>${S[3].days}</small></p>${talk()}</div>${xRows()}<div class="s12-f">${payTxt()}${pdf}</div></div>`;
    },
    5: () => `<div class="wrap">${HEAD_S()}<div class="xs5">${S.map((s, i) => `<details class="xs5-r"${i ? '' : ' open'}><summary><b class="xs5-n">${s.name}</b><span class="xs5-l">${s.line}</span><span class="xs5-dy">${s.days}</span><span class="xs5-p">${pr(s)}</span><i class="xs5-i" aria-hidden="true"></i></summary><div class="xs5-m"><p>${s.desc}</p>${incL(s)}${talk()}</div></details>`).join('')}</div><div class="xs5-x"><h3>Дополнительно</h3><div class="xs5-xt">${X.map(([t, p, d]) => `<div class="xs5-xc"><b>${t}</b><span>${d}</span><em>${p}&nbsp;₽</em></div>`).join('')}</div></div><div class="s12-f">${payTxt()}${pdf}</div></div>`,
    6: () => ({ html: `<div class="wrap">${HEAD_S('Выберите вид сайта и допы: смета пересчитается.')}<div class="xs6"><div class="xs6-l"><div class="xs6-seg" role="radiogroup" aria-label="Вид сайта">${S.map((s, i) => `<button type="button" role="radio" aria-checked="${!i}" data-i="${i}">${s.name}</button>`).join('')}</div><p class="xs6-d"></p><div class="xs6-xs">${X.map(([t, p, d], i) => `<button type="button" class="xs6-x" aria-pressed="false" data-i="${i}"><b>${t}</b><span>${d}</span><em>+${p} ₽</em></button>`).join('')}</div></div><div class="xs6-r"><div class="xs6-ch"><p class="xs6-hd"><b>Смета</b><span>Dolzha, веб-разработчик</span></p><ul class="xs6-li"></ul><p class="xs6-tt"><span>Итого</span><b></b></p><ul class="xs6-pay"></ul><p class="xs6-n">${D.payNote} ${D.daysNote}</p></div>${talk('Отправить смету в Telegram')}</div></div><div class="s12-f">${pdf}</div></div>`,
      init: box => {
        let si = 0; const xs = new Set();
        const upd = () => {
          const s = S[si]; let t = num(s.price);
          $$('.xs6-seg button', box).forEach((b, i) => b.setAttribute('aria-checked', i === si));
          $$('.xs6-x', box).forEach(b => b.setAttribute('aria-pressed', xs.has(+b.dataset.i)));
          $('.xs6-d', box).textContent = s.desc;
          const lines = [[s.name + (s.from ? ', от' : ''), s.price + ' ₽'], ...s.inc.map(x => [x, 'входит'])];
          xs.forEach(i => { lines.push([X[i][0], X[i][1] + ' ₽']); t += num(X[i][1]); });
          $('.xs6-li', box).innerHTML = lines.map(([a, b], j) => `<li class="${j ? '' : 'main'}"><span>${a}</span><i></i><b>${b}</b></li>`).join('') + `<li><span>Срок</span><i></i><b>${s.days}</b></li>`;
          $('.xs6-tt b', box).innerHTML = (s.from ? '<small>от</small> ' : '') + rub(t);
          const p = t < 40000 ? D.pay[0] : D.pay[1];
          $('.xs6-pay', box).innerHTML = p.parts.map(([pc, w]) => `<li><span>${pc}% ${w}</span><b>${rub(Math.round(t * pc / 100))}</b></li>`).join('');
        };
        $$('.xs6-seg button', box).forEach(b => b.addEventListener('click', () => { si = +b.dataset.i; upd(); }));
        $$('.xs6-x', box).forEach(b => b.addEventListener('click', () => { const i = +b.dataset.i; xs.has(i) ? xs.delete(i) : xs.add(i); upd(); }));
        upd();
      } }),
    7: () => ({ html: `<div class="wrap">${HEAD_S('Нажмите «Что входит», карточка перевернётся.')}<div class="xs7">${S.map((s, i) => `<div class="xs7-c" tabindex="0"><div class="xs7-in"><div class="xs7-f"><span class="xs7-k">${s.days}</span><h3>${s.name}</h3><p class="xs7-p">${pr(s)}</p><p class="xs7-l">${s.line}</p><button type="button" class="xs7-h" aria-expanded="false">Что входит ${ic.right}</button></div><div class="xs7-b"><div class="xs7-bh"><h3>${s.name}</h3><span>${pr(s)}</span></div><p class="xs7-bk">Что входит</p>${incL(s)}<div class="xs7-ba">${talk()}<button type="button" class="xs7-back">Назад</button></div></div></div></div>`).join('')}</div>${xRows()}<div class="s12-f">${payTxt()}${pdf}</div></div>`,
      init: box => $$('.xs7-c', box).forEach(c => {
        const h = $('.xs7-h', c), bk = $('.xs7-back', c);
        const flip = on => { c.classList.toggle('fl', on); h.setAttribute('aria-expanded', on); (on ? bk : h).focus({ preventScroll: true }); };
        h.addEventListener('click', () => flip(true)); bk.addEventListener('click', () => flip(false));
      }) }),
    8: () => `<div class="wrap">${HEAD_S()}<div class="xs8"><div class="xs8-st">${S.slice(0, 3).map((s, i) => `<article class="xs8-c" style="--i:${i}"><span class="xs8-up">${['Старт', 'Рост', 'Магазин'][i]}</span><h3>${s.name}</h3><p class="xs8-p">${pr(s)}</p><p class="xs8-dy">${s.days}</p>${incL(s)}${talk()}</article>`).join('')}</div><aside class="xs8-side"><span class="xs8-up">Без сайта</span><h3>${S[3].name}</h3><p class="xs8-p">${pr(S[3])}</p><p class="xs8-dy">${S[3].days}</p><p class="xs8-l">${S[3].line}</p>${talk()}</aside></div>${xRows()}<div class="s12-f">${payTxt()}${pdf}</div></div>`,
    9: () => ({ html: `<div class="xs9-bg"><div class="wrap">${HEAD_S()}<div class="xs9">${S.map(s => `<article class="xs9-c"><i class="xs9-glow" aria-hidden="true"></i><div class="xs9-in"><h3>${s.name}</h3><p class="xs9-p">${pr(s)}</p><p class="xs9-dy">${s.days}</p><p class="xs9-l">${s.line}</p>${incL(s)}${talk()}</div></article>`).join('')}</div>${xRows('xr12 xr12-d')}<div class="s12-f">${payTxt()}${pdf}</div></div></div>`,
      init: box => { if (fine && !reduce) $$('.xs9-c', box).forEach(c => c.addEventListener('pointermove', e => { const r = c.getBoundingClientRect(); c.style.setProperty('--x', (e.clientX - r.left) + 'px'); c.style.setProperty('--y', (e.clientY - r.top) + 'px'); })); } }),
    10: () => ({ html: `<div class="wrap">${HEAD_S('Наведите на колонку, чтобы раскрыть услугу.')}<div class="xs10">${S.map((s, i) => `<article class="xs10-c${i ? '' : ' on'}" tabindex="0"><div class="xs10-sh"><span class="xs10-v">${s.name}</span><span class="xs10-vp">${s.from ? 'от ' : ''}${s.price} ₽</span></div><div class="xs10-full"><p class="xs10-dy">${s.days}</p><h3>${s.name}</h3><p class="xs10-p">${pr(s)}</p><p class="xs10-d">${s.desc}</p>${incL(s)}${talk()}</div></article>`).join('')}</div>${xRows()}<div class="s12-f">${payTxt()}${pdf}</div></div>`,
      init: box => { const cs = $$('.xs10-c', box); const set = c => cs.forEach(x => x.classList.toggle('on', x === c)); cs.forEach(c => { c.addEventListener('pointerenter', () => set(c)); c.addEventListener('focus', () => set(c)); }); } }),
  };

  // ================= ОДИН ЧЕЛОВЕК ЗА ВЕСЬ САЙТ =================
  const STP = D.steps, ART = $$('#podhod .ap-cv svg', st).map(s => s.outerHTML);
  const HEAD_P = `<div class="h12 h12-row"><h2 class="h2">${D.approachHead}</h2><p class="l12">${D.approachLead}</p></div>`;
  const art = i => `<span class="ar12 cv-5">${ART[i] || ''}</span>`;
  // 04.10 Роберт: змейка (бывший вариант 3) понравилась, но всё мелко и нечитаемо. Пять змеек: иконки крупные, текст под иконкой,
  // у каждой своя анимация. Линия строится по настоящим центрам иконок, поэтому проходит через них при любой ширине.
  const stepCard = i => `<li class="sn-c" data-i="${i}"><span class="sn-ic">${art(i)}</span><span class="sn-k">Шаг ${i + 1}</span><h3>${STP[i][0]}</h3><p>${STP[i][1]}</p></li>`;
  const snSvg = `<svg class="sn-svg" aria-hidden="true"><defs><linearGradient id="snG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#B5E853"/><stop offset="1" stop-color="#11998E"/></linearGradient></defs><path class="sn-track"/><path class="sn-line"/><circle class="sn-dot" r="9" cx="-50" cy="-50"/></svg>`;
  const snakePath = (pts, out) => { // в ряду прямо, при смене ряда дуга наружу (змейка) или S-изгиб (зигзаг)
    let d = `M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`, dir = 1;
    for (let i = 1; i < pts.length; i++) {
      const p = pts[i - 1], q = pts[i], dx = q.x - p.x, dy = q.y - p.y;
      if (Math.abs(dy) < 40) { d += ` L${q.x.toFixed(1)} ${q.y.toFixed(1)}`; dir = Math.sign(dx) || dir; continue; }
      const prevRow = i > 1 && Math.abs(pts[i - 1].y - pts[i - 2].y) < 40;
      if (prevRow && out) { const x = dir > 0 ? Math.max(p.x, q.x) + out : Math.min(p.x, q.x) - out; d += ` C${x.toFixed(1)} ${p.y.toFixed(1)} ${x.toFixed(1)} ${q.y.toFixed(1)} ${q.x.toFixed(1)} ${q.y.toFixed(1)}`; dir = -dir; }
      else d += ` C${p.x.toFixed(1)} ${(p.y + dy * .55).toFixed(1)} ${q.x.toFixed(1)} ${(q.y - dy * .55).toFixed(1)} ${q.x.toFixed(1)} ${q.y.toFixed(1)}`;
    }
    return d;
  };
  // общий движок: строит путь, рисует его по доле p (0…1), ставит точку и включает карточки
  const snake = (root, out = 150) => {
    const svg = $('.sn-svg', root), track = $('.sn-track', svg), line = $('.sn-line', svg), dot = $('.sn-dot', svg), cards = $$('.sn-c', root);
    const S = { L: 0, at: [], p: 0, pts: [] };
    S.build = () => {
      const rr = root.getBoundingClientRect(); if (!rr.width) return;
      svg.setAttribute('viewBox', `0 0 ${rr.width} ${rr.height}`); svg.setAttribute('width', rr.width); svg.setAttribute('height', rr.height);
      S.pts = cards.map(c => { const r = $('.sn-ic', c).getBoundingClientRect(); return { x: r.left - rr.left + r.width / 2, y: r.top - rr.top + r.height / 2 }; });
      const d = snakePath(S.pts, out); track.setAttribute('d', d); line.setAttribute('d', d);
      S.L = line.getTotalLength(); line.style.strokeDasharray = S.L;
      const N = 240, sm = Array.from({ length: N + 1 }, (_, k) => line.getPointAtLength(S.L * k / N)); let from = 0;
      S.at = S.pts.map(p => { let best = from, bd = 1e9; for (let k = from; k <= N; k++) { const dd = (sm[k].x - p.x) ** 2 + (sm[k].y - p.y) ** 2; if (dd < bd) { bd = dd; best = k; } } from = best; return best / N; });
      S.set(S.p);
    };
    S.set = p => {
      S.p = p; if (!S.L) return;
      line.style.strokeDashoffset = S.L * (1 - p);
      const q = line.getPointAtLength(S.L * p); dot.setAttribute('cx', q.x); dot.setAttribute('cy', q.y); dot.style.opacity = p > 0.001 && p < .999 ? 1 : 0;
      cards.forEach((c, i) => c.classList.toggle('on', p >= S.at[i] - .015));
    };
    const ro = new ResizeObserver(() => S.build()); ro.observe(root); bag.p.push(() => ro.disconnect());
    if (document.fonts) document.fonts.ready.then(() => S.build());
    $$('img', root).forEach(i => i.addEventListener('load', S.build, { once: true }));
    S.build(); return S;
  };
  const byScroll = (root, S) => { const upd = () => { const r = root.getBoundingClientRect(); S.set(reduce ? 1 : Math.min(1, Math.max(0, (innerHeight * .78 - r.top) / (r.height * .82)))); }; upd(); on('p', window, 'scroll', upd, { passive: true }); on('p', window, 'resize', upd); };
  const SN = (n, extra = '') => `<div class="wrap">${HEAD_P}<div class="sn sn${n}">${snSvg}<ol>${STP.map((_, i) => stepCard(i)).join('')}</ol>${extra}</div></div>`;
  const PV = {
    1: () => ({ html: SN(1), init: box => { const r = $('.sn', box); byScroll(r, snake(r, 120)); } }), // 3+2: линия рисуется прокруткой, по ней бежит огонёк
    2: () => ({ html: SN(2), init: box => { const r = $('.sn', box); byScroll(r, snake(r, 110)); } }), // 2+2+1, крупно, карточки выезжают со своей стороны
    3: () => ({ html: SN(3), init: box => { const r = $('.sn', box); byScroll(r, snake(r, 0)); } }), // зигзаг вниз
    4: () => ({ html: `<div class="sn4w"><div class="sn4-pin"><div class="wrap">${HEAD_P}</div><div class="sn4-vp"><div class="sn sn4">${snSvg}<ol>${STP.map((_, i) => stepCard(i)).join('')}</ol></div></div><div class="wrap"><i class="sn4-bar"><i></i></i></div></div></div>`,
      init: box => { // змейка вбок: страница идёт вниз, змейка едет влево
        const w = $('.sn4w', box), r = $('.sn', box), bar = $('.sn4-bar i', box), S = snake(r, 0);
        if (innerWidth <= 900) { S.set(1); return; }
        const size = () => { const dist = Math.max(0, r.scrollWidth - innerWidth + 160); w.style.height = (innerHeight + dist) + 'px'; w.dataset.dist = dist; };
        const upd = () => { const q = w.getBoundingClientRect(), dist = +w.dataset.dist, p = Math.min(1, Math.max(0, -q.top / (q.height - innerHeight || 1))); r.style.transform = `translateX(${-p * dist}px)`; bar.style.transform = `scaleX(${p})`; S.set(reduce ? 1 : Math.min(1, p * 1.08 + .04)); };
        size(); upd(); on('p', window, 'scroll', upd, { passive: true }); on('p', window, 'resize', () => { size(); upd(); });
      } }),
    5: () => ({ html: SN(5, `<div class="sn-bot" aria-hidden="true">${$('.hd11-logo .lg6') ? $('.hd11-logo .lg6').outerHTML : ''}</div>`),
      init: box => { // пунктир бежит сам, маскот-логотип идёт по шагам и останавливается у каждой карточки
        const r = $('.sn', box), S = snake(r, 120), bot = $('.sn-bot', r), cards = $$('.sn-c', r);
        if (reduce) { cards.forEach(c => c.classList.add('on')); return; }
        let k = 0, t0 = 0, from = 0, raf = 0; const MOVE = 1300, STAY = 1700;
        const ease = x => x < .5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2;
        const put = f => { if (!S.L) return; const q = $('.sn-line', r).getPointAtLength(S.L * f); bot.style.transform = `translate(${q.x}px,${q.y}px)`; };
        const tick = t => {
          if (!document.body.contains(r)) return;
          if (!t0) t0 = t; const to = S.at[k] ?? 0, e = t - t0;
          if (e < MOVE) put(from + (to - from) * ease(e / MOVE));
          else { put(to); cards.forEach((c, i) => c.classList.toggle('cur', i === k)); if (e > MOVE + STAY) { from = to; k = (k + 1) % cards.length; if (!k) from = 0; t0 = t; } }
          raf = requestAnimationFrame(tick);
        };
        cards.forEach(c => c.classList.add('on'));
        watch('p', [r], es => es.forEach(en => { if (en.isIntersecting && !raf) raf = requestAnimationFrame(tick); else if (!en.isIntersecting && raf) { cancelAnimationFrame(raf); raf = 0; } }));
        bag.p.push(() => cancelAnimationFrame(raf));
      } }),
  };

  // ================= ОБО МНЕ =================
  const A = D.about, PH = D.photos;
  const facts = () => `<dl class="fa12">${A.facts.map(([n, t]) => `<div><dt>${n}</dt><dd>${t}</dd></div>`).join('')}</dl>`;
  const stack = (mode = 'list') => mode === 'chips' ? `<div class="stk12 chips"><p>${D.stackLabel}</p><ul>${D.stack.map(([n, d]) => `<li title="${esc(d)}">${n}</li>`).join('')}</ul></div>` : `<div class="stk12"><p>${D.stackLabel}</p><dl>${D.stack.map(([n, d]) => `<div><dt>${n}</dt><dd>${d}</dd></div>`).join('')}</dl></div>`;
  const tgB = `<a class="b12 b12-3d" href="${D.tg}" target="_blank" rel="noopener"><span>Написать в Telegram</span></a>`;
  const txt = (m = 'list') => `<div class="a12-t"><h2 class="h2">${A.h}</h2><p class="a12-p">${A.p}</p><p class="a12-p2">${A.p2}</p>${facts()}${stack(m)}${tgB}</div>`;
  const img = ([s, a], cls = '') => `<img${cls ? ` class="${cls}"` : ''} src="${s}" alt="${esc(a)}" loading="lazy" decoding="async">`;
  const hint = t => `<p class="a12-h">${t}</p>`;
  const deckInit = (box, sel, onSet) => { // общий «по кругу» для колод: щелчок, клавиши, свайп
    const cs = $$(sel, box), n = cs.length; let ord = cs.map((_, i) => i);
    const lay = () => { ord.forEach((ci, d) => { cs[ci].style.setProperty('--d', d); cs[ci].classList.toggle('top', d === 0); }); onSet && onSet(ord[0]); };
    const next = (back) => { if (back) ord.unshift(ord.pop()); else ord.push(ord.shift()); lay(); };
    lay(); return { next, cs, get top() { return ord[0]; }, set: i => { while (ord[0] !== i) ord.push(ord.shift()); lay(); } };
  };
  const AV = {
    1: () => ({ html: `<div class="wrap a12-g"><div class="xa1"><div class="xa1-st" tabindex="0" role="button" aria-label="Следующее фото">${PH.map(p => `<figure class="xa1-c">${img(p)}</figure>`).join('')}</div>${hint('Нажмите на фото, чтобы листать')}</div>${txt()}</div>`,
      init: box => { const d = deckInit(box, '.xa1-c'); const st_ = $('.xa1-st', box); let busy = 0; const go = () => { if (busy) return; busy = 1; const t = d.cs[d.top]; t.classList.add('fly'); setTimeout(() => { t.classList.remove('fly'); d.next(); busy = 0; }, reduce ? 0 : 380); }; st_.addEventListener('click', go); st_.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') { e.preventDefault(); go(); } }); } }),
    2: () => ({ html: `<div class="wrap a12-g"><div class="xa2">${PH.map((p, i) => `<button type="button" class="xa2-c" style="--r:${[-8, 6, -3, 9, -5][i]}deg;--x:${[0, 34, 10, 46, 20][i]}%;--y:${[0, 6, 30, 26, 52][i]}%" aria-label="Показать фото: ${esc(p[1])}"><span class="xa2-f">${img(p)}</span><span class="xa2-cap">${p[1].replace('Dolzha', '').replace(/^[,\s]+/, '') || 'Dolzha'}</span></button>`).join('')}</div>${txt('chips')}</div>`,
      init: box => { let z = 10; $$('.xa2-c', box).forEach(c => c.addEventListener('click', () => { $$('.xa2-c', box).forEach(x => x.classList.remove('up')); c.style.zIndex = ++z; c.classList.add('up'); })); } }),
    3: () => ({ html: `<div class="wrap a12-g"><div class="xa3"><div class="xa3-st">${PH.map(p => `<figure class="xa3-c">${img(p)}</figure>`).join('')}</div><div class="xa3-ctl"><button type="button" class="xa3-b">Следующее фото</button><span class="xa3-n"><b>1</b> из ${PH.length}</span></div>${hint('Смахните фото в сторону')}</div>${txt()}</div>`,
      init: box => {
        const d = deckInit(box, '.xa3-c', i => { $('.xa3-n b', box).textContent = i + 1; }); let sx = 0, dx = 0, drag = null;
        const throwIt = dir => { const t = d.cs[d.top]; t.style.transition = ''; t.style.transform = `translate(${dir * 140}%,-10px) rotate(${dir * 18}deg)`; t.style.opacity = 0; setTimeout(() => { t.style.transform = ''; t.style.opacity = ''; d.next(); }, reduce ? 0 : 320); };
        $('.xa3-b', box).addEventListener('click', () => throwIt(1));
        $('.xa3-st', box).addEventListener('pointerdown', e => { drag = d.cs[d.top]; sx = e.clientX; dx = 0; drag.style.transition = 'none'; drag.setPointerCapture(e.pointerId); });
        $('.xa3-st', box).addEventListener('pointermove', e => { if (!drag) return; dx = e.clientX - sx; drag.style.transform = `translateX(${dx}px) rotate(${dx / 18}deg)`; });
        const up = () => { if (!drag) return; const t = drag; drag = null; if (Math.abs(dx) > 90) throwIt(Math.sign(dx)); else { t.style.transition = ''; t.style.transform = ''; } };
        $('.xa3-st', box).addEventListener('pointerup', up); $('.xa3-st', box).addEventListener('pointercancel', up);
      } }),
    4: () => ({ html: `<div class="wrap a12-g"><div class="xa4"><div class="xa4-m">${PH.map((p, i) => img(p, i ? '' : 'on')).join('')}</div><div class="xa4-th" role="group" aria-label="Фото">${PH.map((p, i) => `<button type="button" aria-pressed="${!i}" data-i="${i}" aria-label="${esc(p[1])}">${img(p)}</button>`).join('')}</div></div>${txt('chips')}</div>`,
      init: box => { const ms = $$('.xa4-m img', box), bs = $$('.xa4-th button', box); bs.forEach((b, i) => b.addEventListener('click', () => { ms.forEach((m, j) => m.classList.toggle('on', j === i)); bs.forEach((x, j) => x.setAttribute('aria-pressed', j === i)); })); } }),
    5: () => ({ html: `<div class="wrap a12-g"><div class="xa5"><div class="xa5-f"><div class="xa5-bars">${PH.map(() => '<i><i></i></i>').join('')}</div>${PH.map((p, i) => img(p, i ? '' : 'on')).join('')}<button type="button" class="xa5-z xa5-l" aria-label="Предыдущее фото"></button><button type="button" class="xa5-z xa5-r" aria-label="Следующее фото"></button><span class="xa5-me">${window.SB && $('.hd11-logo .lg6') ? $('.hd11-logo .lg6').outerHTML : ''}<b>Dolzha</b><span>веб-разработчик</span></span></div></div>${txt()}</div>`,
      init: box => { const ms = $$('.xa5-f>img', box), bars = $$('.xa5-bars>i', box), f = $('.xa5-f', box); let i = 0;
        const set = n => { i = (n + ms.length) % ms.length; ms.forEach((m, j) => m.classList.toggle('on', j === i)); bars.forEach((b, j) => { b.classList.toggle('done', j < i); b.classList.remove('run'); }); void f.offsetWidth; bars[i].classList.add('run'); };
        $('.xa5-l', box).addEventListener('click', () => set(i - 1)); $('.xa5-r', box).addEventListener('click', () => set(i + 1));
        bars.forEach(b => b.addEventListener('animationend', () => { if (!f.matches(':hover')) set(i + 1); else { b.classList.remove('run'); void b.offsetWidth; b.classList.add('run'); } })); set(0); } }),
    6: () => ({ html: `<div class="xa6"><div class="xa6-strip"><div class="xa6-tr">${[...PH, ...PH, ...PH].map((p, i) => `<button type="button" class="xa6-c" style="--r:${[-3, 2, -1.5, 3, -2][i % 5]}deg" data-i="${i % PH.length}"${i >= PH.length ? ' tabindex="-1" aria-hidden="true"' : ''} aria-label="Открыть фото: ${esc(p[1])}">${img(p)}</button>`).join('')}</div></div><div class="wrap xa6-t">${txt('chips')}</div><div class="xa6-lb" hidden><button type="button" class="xa6-x" aria-label="Закрыть">×</button><img alt=""></div></div>`,
      init: box => { const lb = $('.xa6-lb', box), li = $('img', lb); $$('.xa6-c', box).forEach(c => c.addEventListener('click', () => { const p = PH[+c.dataset.i]; li.src = p[0]; li.alt = p[1]; lb.hidden = false; $('.xa6-x', box).focus(); })); const close = () => { lb.hidden = true; }; $('.xa6-x', box).addEventListener('click', close); lb.addEventListener('click', e => { if (e.target === lb) close(); }); on('a', document, 'keydown', e => { if (e.key === 'Escape') close(); }); } }),
    7: () => ({ html: `<div class="wrap a12-g"><div class="xa7"><div class="xa7-st">${PH.map((p, i) => `<button type="button" class="xa7-c" style="--i:${i - 2}" data-i="${i}" aria-label="Показать фото: ${esc(p[1])}">${img(p)}</button>`).join('')}</div>${hint('Наведите, фото разойдутся веером. Нажмите, чтобы вынести вперёд')}</div>${txt()}</div>`,
      init: box => { const cs = $$('.xa7-c', box); const set = i => { cs.forEach((c, j) => { const o = ((j - i + 7) % 5) - 2; c.style.setProperty('--i', o); c.classList.toggle('top', o === 0); }); }; cs.forEach(c => c.addEventListener('click', () => set(+c.dataset.i))); set(2); } }),
    8: () => ({ html: `<div class="wrap a12-g"><div class="xa8"><div class="xa8-m">${PH.map((p, i) => img(p, i ? '' : 'on')).join('')}</div>${PH.map((p, i) => `<button type="button" class="xa8-s" data-i="${i}" aria-pressed="${!i}" aria-label="${esc(p[1])}">${img(p)}</button>`).join('')}</div>${txt('chips')}</div>`,
      init: box => { const ms = $$('.xa8-m img', box), bs = $$('.xa8-s', box); bs.forEach((b, i) => b.addEventListener('click', () => { ms.forEach((m, j) => m.classList.toggle('on', j === i)); bs.forEach((x, j) => x.setAttribute('aria-pressed', j === i)); })); } }),
    9: () => ({ html: `<div class="xa9" style="--n:${PH.length}"><div class="xa9-pin"><div class="wrap a12-g"><div class="xa9-f">${PH.map((p, i) => img(p, i ? '' : 'on')).join('')}<span class="xa9-c"><b>1</b> / ${PH.length}</span></div>${txt('chips')}</div></div></div>`,
      init: box => { const w = $('.xa9', box), ms = $$('.xa9-f img', box); if (innerWidth <= 900) { let i = 0; every('a', 3000, () => { i = (i + 1) % ms.length; ms.forEach((m, j) => m.classList.toggle('on', j === i)); $('.xa9-c b', box).textContent = i + 1; }); return; }
        const upd = () => { const r = w.getBoundingClientRect(), p = Math.min(.999, Math.max(0, -r.top / (r.height - innerHeight || 1))), i = Math.floor(p * ms.length); ms.forEach((m, j) => m.classList.toggle('on', j === i)); $('.xa9-c b', box).textContent = i + 1; };
        upd(); on('a', window, 'scroll', upd, { passive: true }); } }),
    10: () => ({ html: `<div class="wrap a12-g"><div class="xa10"><div class="xa10-m">${PH.map((p, i) => img(p, i ? '' : 'on')).join('')}</div>${PH.map((p, i) => `<button type="button" class="xa10-s" style="--a:${-150 + i * 60}deg" data-i="${i}" aria-pressed="${!i}" aria-label="${esc(p[1])}">${img(p)}</button>`).join('')}</div>${txt()}</div>`,
      init: box => { const ms = $$('.xa10-m img', box), bs = $$('.xa10-s', box); bs.forEach((b, i) => b.addEventListener('click', () => { ms.forEach((m, j) => m.classList.toggle('on', j === i)); bs.forEach((x, j) => x.setAttribute('aria-pressed', j === i)); })); } }),
  };

  // ================= применение и панель =================
  const SET = { w: WK, s: SV, p: PV, a: AV };
  const render = k => {
    clean(k); BOX[k].innerHTML = '';
    if (!V[k]) return;
    const r = SET[k][V[k]](), html = typeof r === 'string' ? r : r.html;
    BOX[k].innerHTML = html;
    if (r.init) r.init(BOX[k]);
  };
  const apply = (k, first) => {
    body.className = body.className.replace(new RegExp(`\\b${k}12-\\d+\\b`, 'g'), '').trim() + ` ${k}12-${V[k]}`;
    render(k); if (!first) history.replaceState(null, '', `#w${V.w}-s${V.s}-p${V.p}-a${V.a}`);
  };
  // «Обо мне» (вариант 0): стрелки в одной капсуле, ровные иконки
  { const car = $('#obo-mne .car', st), pv = car && $('.car-prev', car), nx = car && $('.car-next', car);
    if (pv && nx) {
      const ar = d => `<svg class="ca12" viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
      pv.innerHTML = ar('M19.5 12h-15M10.5 6l-6 6 6 6'); nx.innerHTML = ar('M4.5 12h15M13.5 6l6 6-6 6');
      pv.setAttribute('aria-label', 'Предыдущее фото'); nx.setAttribute('aria-label', 'Следующее фото');
      const ctl = document.createElement('div'); ctl.className = 'car-ctl'; pv.before(ctl); ctl.append(pv, nx);
    } }
  body.classList.add('v12');
  G.forEach(([k]) => apply(k, true));

  body.insertAdjacentHTML('beforeend', `<aside class="p11 p12" aria-label="Варианты блоков"><button type="button" class="p11-t" aria-expanded="true"><span>Варианты блоков, 0 = как сейчас</span><i aria-hidden="true">–</i></button><div class="p11-b">
    ${G.filter(([k]) => hm || k === 'p' || k === 'w').map(([k, n, o]) => `<div class="p11-g"><p class="p11-h"><button type="button" class="p12-go" data-g="${k}">${n} ↓</button><b data-n="${k}">${V[k]}. ${o[V[k]]}</b></p><div class="p11-r" data-k="${k}">${o.map((t, i) => `<button type="button" data-n="${i}" aria-pressed="${V[k] === i}" title="${i}. ${t}">${i}</button>`).join('')}</div></div>`).join('')}
    <div class="p11-f"><button type="button" class="p11-cp">Скопировать выбор</button><span class="p11-ok" hidden>Скопировано</span></div></div></aside>`);
  const pan = $('.p12');
  if (innerWidth <= 900) { pan.classList.add('closed'); $('.p11-t', pan).setAttribute('aria-expanded', 'false'); $('.p11-t i', pan).textContent = '+'; }
  $('.p11-t', pan).addEventListener('click', e => { const c = pan.classList.toggle('closed'); e.currentTarget.setAttribute('aria-expanded', !c); $('i', e.currentTarget).textContent = c ? '+' : '–'; });
  $$('.p12-go', pan).forEach(b => b.addEventListener('click', () => { const s = SEC[b.dataset.g]; scrollTo({ top: s.getBoundingClientRect().top + scrollY - 70, behavior: 'smooth' }); }));
  $$('.p11-r', pan).forEach(g => g.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const k = g.dataset.k; V[k] = +b.dataset.n; ls.set((k === 'p' || k === 'w' ? 'v13-' : 'v12-') + k, V[k]);
    $$('button', g).forEach(x => x.setAttribute('aria-pressed', x === b));
    $(`[data-n="${k}"]`, pan).textContent = `${V[k]}. ${G.find(x => x[0] === k)[2][V[k]]}`;
    const sec = SEC[k], before = sec.getBoundingClientRect().top;
    apply(k);
    scrollTo({ top: sec.getBoundingClientRect().top + scrollY - (before > 0 ? before : 80) }); // блок остаётся на экране
  }));
  $('.p11-cp', pan).addEventListener('click', () => {
    const t = G.filter(([k]) => hm || k === 'p' || k === 'w').map(([k, n, o]) => `${n} ${V[k]} (${o[V[k]]})`).join('; ');
    const ok = () => { $('.p11-ok', pan).hidden = false; setTimeout(() => { $('.p11-ok', pan).hidden = true; }, 2500); };
    (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(ok, () => prompt('Скопируйте строку:', t));
  });
})();
