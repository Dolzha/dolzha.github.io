/* Четырнадцатый круг (04.10). Выбор Роберта закреплён: работы 6, вопросы 4, контакты 4, подвал 6 (без QR и координат).
   Старые строки панели спрятаны, но «Скопировать выбор» их по-прежнему перечисляет (Один человек, маскот, логотип, наведение, тексты).
   Новое на выбор: подписи работ ×6, окно работы ×15 (1-5 прежние), телефон ×11 (1 = как было), главный экран: текст ×6,
   кнопка Telegram в контактах ×5, контакты: текст ×5. Классы на body: cap14-N ht14-N tb14-N ct14-N ph14-N, window.DMV = окно. */
(function () {
  const D = window.D, body = document.body, st = document.getElementById('stage');
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, fine = matchMedia('(pointer:fine)').matches;
  const ls = { get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} } };
  const pan = $('.p12');
  body.classList.add('v14');

  // ---------- закрепляем выбор: нажимаем спрятанные кнопки старых строк (те сами применяют вариант и запоминают) ----------
  const hashed = /^#w\d+-s\d+-p\d+-a\d+$/.test(location.hash);
  const lock = (sel) => { const b = pan && $(sel, pan); if (b && b.getAttribute('aria-pressed') !== 'true') b.click(); };
  if (!hashed) { lock('.p11-r[data-k="w"] button[data-n="6"]'); }
  lock('.p11-r[data-k13="q"] button[data-n="4"]');
  lock('.p11-r[data-k13="c"] button[data-n="4"]');
  lock('.p11-r[data-k13="f"] button[data-n="6"]');
  scrollTo(0, 0);

  // ---------- главная: кнопки по ширине заголовка ----------
  const hw = () => {
    const c = $('.m-hero .hx10 .hx-copy', st); if (!c) return;
    const rg = document.createRange(); let w = 0;
    $$('.h1 .l', c).forEach(l => { rg.selectNodeContents(l); w = Math.max(w, rg.getBoundingClientRect().width); });
    if (w) c.style.setProperty('--hw', Math.ceil(w) + 'px');
  };
  hw(); addEventListener('resize', hw); if (document.fonts) document.fonts.ready.then(hw);

  // ---------- работы 6: подписи ×6 ----------
  const W = D.works;
  const decorate = () => $$('.xw6-c', st).forEach((c, i) => {
    if ($('.xw6-x', c)) return; const k = c.dataset.k;
    const n = $('.xw6-n', c), b = $('.xw6-b', c), cap = document.createElement('span'); cap.className = 'xw6-cap'; n.before(cap); cap.append(n, b);
    $('.xw6-n', c).insertAdjacentHTML('beforebegin', `<span class="xw6-x"><span class="xw6-i">${String(i + 1).padStart(2, '0')}</span><span class="xw6-u">${W[k].show}</span></span>`);
    c.insertAdjacentHTML('beforeend', `<ul class="xw6-t">${W[k].tags.map(t => `<li>${t}</li>`).join('')}</ul><svg class="xw6-ar" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>`);
    $('.xw6-pc .hs', c).insertAdjacentHTML('afterbegin', `<span class="xw6-bar" aria-hidden="true"><i></i><i></i><i></i><b>${W[k].show}</b></span>`);
  });

  // ---------- контакты 4: кнопка Telegram ×5, «Дальше» без «или Enter» ----------
  const PLANE = '<svg class="tg-ic" viewBox="0 0 24 24" aria-hidden="true"><path class="tg-b" d="M21.5 3.5 2.8 10.7c-1 .4-1 1.8 0 2.1l4.7 1.5 1.8 5.6c.3.9 1.4 1.1 2 .4l2.6-2.7 4.8 3.5c.8.6 1.9.1 2.1-.8l3-15.2c.2-1-.8-1.9-1.8-1.6z"/><path class="tg-f" d="M7.6 14.3 17.4 8l-7.2 7.3-.7 4.2"/></svg>';
  const ARR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>';
  const TB = {
    1: `<span>Написать в Telegram</span>`,
    2: `${PLANE}<span>Написать в Telegram</span>`,
    3: `${PLANE}<span>Открыть чат</span>${ARR}`,
    4: `<span class="tb-at">${D.tgName}</span><span class="tb-go">Написать ${ARR}</span>`,
    5: `<span>Написать в Telegram</span>${ARR}`,
  };
  const tgBtn = () => { const a = $('.c13-tg .vbtn', st); if (!a) return; a.className = 'vbtn tb14'; a.innerHTML = TB[V.tb] || TB[1]; };

  // ---------- телефон 8: наклон за курсором ----------
  if (fine && !reduce) document.addEventListener('pointermove', e => {
    if (V.ph !== 8) return; const ph = $('.dm:not([hidden]) .iph'); if (!ph) return;
    const r = ph.getBoundingClientRect(), x = (e.clientX - (r.left + r.width / 2)) / innerWidth, y = (e.clientY - (r.top + r.height / 2)) / innerHeight;
    ph.style.setProperty('--ry', (x * 34).toFixed(2) + 'deg'); ph.style.setProperty('--rx', (-y * 22).toFixed(2) + 'deg');
  }, { passive: true });

  // ---------- строки панели ----------
  const G = [
    ['cap', 'Подписи работ', '#raboty', ['', 'Как сейчас', 'В одну строку', 'Плашка на картинке', 'Номер и адрес', 'С тегами', 'Адрес как вкладка']],
    ['dm', 'Окно работы', 'open', ['', 'Прежнее 1: по центру', 'Прежнее 2: тёмное во весь экран', 'Прежнее 3: шторка справа', 'Прежнее 4: раскрытие из карточки', 'Прежнее 5: компьютер и телефон рядом', 'Лист снизу', 'Тёмное окно', 'Стекло', 'Окно macOS', 'Шторка слева', 'Карточка поверх сайта', 'Журнал', 'Компактное', 'Раскрытие кругом', 'Мятная рамка']],
    ['ph', 'Телефон в окне', 'phone', ['', 'Как сейчас', 'Выезжает снизу', 'Поворот вокруг оси', 'Из горизонтали в вертикаль', 'Без рамки', 'Android', 'Мятный корпус, падает сверху', 'Наклон за курсором', 'Парит', 'Тёмный с бликом', 'Чертёж прорисовывается']],
    ['ht', 'Главный экран: текст', 'top', ['', 'Слева, кнопки по заголовку', 'Слева крупнее', 'Стеклянная карточка', 'Внизу, как постер', 'По центру с дымкой', 'Заголовок и текст рядом']],
    ['tb', 'Кнопка Telegram в контактах', '#svyaz', ['', 'Тёмная, как была', 'С самолётиком', 'Зелёная объёмная', 'Ник и «Написать»', 'Контурная']],
    ['ct', 'Контакты: текст', '#svyaz', ['', 'По центру', 'Заголовок слева, текст справа', 'В левой карточке', 'Крупно слева', 'Только заголовок']],
  ];
  const V = {};
  G.forEach(([k, , , o]) => { const v = ls.get('v15-' + k); V[k] = v !== null && /^\d+$/.test(v) && +v > 0 && +v < o.length ? +v : 1; });
  const apply = k => {
    body.className = body.className.replace(new RegExp(`\\b${k}14-\\d+\\b`, 'g'), '').trim() + ` ${k}14-${V[k]}`;
    if (k === 'dm') window.DMV = V.dm;
    if (k === 'tb') tgBtn();
    if (k === 'ht') hw();
  };
  G.forEach(([k]) => apply(k));
  decorate(); tgBtn();
  // варианты site12/13 могут перерисоваться: подпись и кнопку ставим заново
  new MutationObserver(() => { decorate(); if ($('.c13-tg .vbtn:not(.tb14)', st)) tgBtn(); hw(); }).observe(st, { childList: true, subtree: true });

  if (!pan) return;
  $('.p11-t span', pan).textContent = 'Что ещё выбираем';
  $('.p11-f', pan).insertAdjacentHTML('beforebegin', G.map(([k, n, go, o]) => `<div class="p11-g p14"><p class="p11-h"><button type="button" class="p12-go" data-go14="${go}">${go === 'open' ? n + ': открыть ↗' : go === 'phone' ? n + ': открыть ↗' : n + ' ↓'}</button><b data-n14="${k}">${V[k]}. ${o[V[k]]}</b></p><div class="p11-r" data-k14="${k}">${o.slice(1).map((t, i) => `<button type="button" data-n="${i + 1}" aria-pressed="${V[k] === i + 1}" title="${i + 1}. ${t}">${i + 1}</button>`).join('')}</div></div>`).join(''));
  const openWork = (phone) => { const c = $('.xw6-c', st) || $('#raboty .wk'); if (!c) return; c.click(); if (phone) setTimeout(() => { const b = $('.dm-sw button[data-v="ph"]'); if (b && !$('.dm-duo')) b.click(); }, 60); };
  $$('[data-go14]', pan).forEach(b => b.addEventListener('click', () => {
    const g = b.dataset.go14;
    if (g === 'open') return openWork(false);
    if (g === 'phone') return openWork(true);
    if (g === 'top') return scrollTo({ top: 0, behavior: 'smooth' });
    const el = $(g); if (el) scrollTo({ top: el.getBoundingClientRect().top + scrollY - 70, behavior: 'smooth' });
  }));
  $$('.p11-r[data-k14]', pan).forEach(g => g.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const k = g.dataset.k14; V[k] = +b.dataset.n; ls.set('v15-' + k, V[k]);
    $$('button', g).forEach(x => x.setAttribute('aria-pressed', x === b));
    $(`[data-n14="${k}"]`, pan).textContent = `${V[k]}. ${G.find(x => x[0] === k)[3][V[k]]}`;
    apply(k);
    if (k === 'dm' || k === 'ph') { const dm = $('.dm'); if (dm && !dm.hidden) { const x = $('.dm-x', dm); x && x.click(); setTimeout(() => openWork(k === 'ph'), 450); } }
  }));
})();
