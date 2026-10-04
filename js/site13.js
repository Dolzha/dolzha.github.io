/* Тринадцатый круг (04.10): все оставшиеся блоки разом, по 10 вариантов. 0 = как сейчас.
   «Вопросы» (q, кнопку не трогаем), «Контакты» (c, форма та же, только переезжает), подвал (f), маскот (m), анимация логотипа в шапке (l),
   эффекты наведения (h), тексты (t, 5 наборов: уходим от «местного бизнеса» к риторике старого портфолио).
   Классы на body: q13-N c13-N f13-N m13-N l13-N h13-N t13-N; localStorage v14-*. Строки дописываются в панель из site12. */
(function () {
  const D = window.D, ic = window.SB.ic, body = document.body, st = document.getElementById('stage');
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, fine = matchMedia('(pointer:fine)').matches;
  const ls = { get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} } };
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

  const G = [
    ['q', 'Вопросы', '#voprosy', ['Как сейчас', 'Две колонки', 'Переписка', 'Вкладки', 'Карточки открытые', 'Крупные строки', 'Поиск', 'Перевёртыши', 'Липкий заголовок', 'Тёмный блок', 'Карусель']],
    ['c', 'Контакты', '#svyaz', ['Как сейчас', 'Зеркально', 'По центру', 'Тёмная карточка', 'Telegram и форма', 'Заголовок во всю ширину', 'Каналы плитками', 'Визитка', 'Что будет дальше', 'Сплит с цветом', 'Одна большая ссылка']],
    ['f', 'Подвал', '.m-ft', ['Как сейчас', 'Одна строка', 'Плашка «Обсудим»', 'Слоган', 'Светлая карточка', 'По центру', 'С QR-кодом', 'Бегущая строка услуг', 'Часы и загрузка', 'Кнопка «Наверх»', 'Бенто']],
    ['m', 'Маскот', null, ['Как сейчас', 'Помощник в углу', 'Сидит на форме', 'Прощается в подвале', 'Бегунок прокрутки', 'Стикеры у заголовков', 'Выглядывает из блоков', 'Радуется кнопкам', 'Спутник курсора', 'Пасхалка в конце', 'Только в «Обо мне»']],
    ['l', 'Анимация логотипа', 'top', ['Как сейчас', 'Подмигивание', 'Моргает сам', 'Прыжок', 'Монетка', 'Холм поднимается', 'Глаза следят', 'Печатает код', 'Перелив круга', 'Отскок при прокрутке', 'Пульс']],
    ['h', 'Наведение', null, ['Как сейчас', 'Подъём и тень', 'Магнит', 'Свет за курсором', 'Рамка-перелив', 'Приближение картинки', 'Блик', 'Волнистая ссылка', 'Наклон 3D', 'Соседи гаснут', 'Подпись у курсора']],
    ['t', 'Тексты', null, ['Как сейчас', 'Как на старом портфолио', 'Коротко', 'Про результат', 'От первого лица', 'Дизайн впереди']],
  ];
  const V = {};
  G.forEach(([k, , , o]) => { const v = ls.get('v14-' + k); V[k] = v !== null && /^\d+$/.test(v) && +v < o.length ? +v : 1; });
  const bag = {}; G.forEach(([k]) => { bag[k] = []; });
  const every = (k, ms, fn) => { const id = setInterval(fn, ms); bag[k].push(() => clearInterval(id)); };
  const on = (k, el, ev, fn, o) => { el.addEventListener(ev, fn, o); bag[k].push(() => el.removeEventListener(ev, fn, o)); };
  const watch = (k, els, fn, opt) => { const io = new IntersectionObserver(fn, opt); els.forEach(e => e && io.observe(e)); bag[k].push(() => io.disconnect()); };
  const clean = k => { bag[k].forEach(f => f()); bag[k] = []; };
  const LOGO = () => ($('.hd11-logo .lg6') || $('.lg6')).outerHTML;
  const lookAt = (k, scope) => { // глаза маскотов смотрят на курсор
    if (!fine || reduce) return;
    on(k, document, 'pointermove', e => { $$('.lg6', scope).forEach(s => { const r = s.getBoundingClientRect(); if (!r.width) return; const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2), d = Math.hypot(dx, dy) || 1; const f = $('.l6f', s); if (f) f.style.transform = `translate(${(dx / d * 1.6).toFixed(2)}px,${(dy / d * 1.3).toFixed(2)}px)`; }); }, { passive: true });
  };
  const goto = sel => { const el = $(sel); if (el) scrollTo({ top: el.getBoundingClientRect().top + scrollY - 70, behavior: 'smooth' }); };

  // ================= ВОПРОСЫ =================
  const QS = $('#voprosy', st), FAQ = D.faq;
  const qBtn = ($('#voprosy .fq-head .vbtn', st) || {}).outerHTML || '';
  const qLead = (($('#voprosy .fq-head .sec-lead', st) || {}).textContent || '').trim();
  const qHead = (cls = '') => `<div class="fq-head q13-h ${cls}"><h2 class="h2">Вопросы</h2><p class="sec-lead q13-lead">${qLead}</p>${qBtn}</div>`;
  const plus = '<i class="q13-pl" aria-hidden="true"></i>';
  const det = (cls, i, open) => `<details class="${cls}"${open ? ' open' : ''}><summary><span class="q13-q">${FAQ[i][0]}</span>${plus}</summary><div class="q13-a"><p>${FAQ[i][1]}</p></div></details>`;
  const QV = {
    1: () => `<div class="wrap">${qHead('q13-row')}<div class="q13-2c">${FAQ.map((_, i) => det('q13-d', i, i === 0)).join('')}</div></div>`,
    2: () => ({ html: `<div class="wrap q13-split">${qHead()}<div class="q13-chat"><div class="q13-top"><span class="q13-av">${LOGO()}</span><span><b>Dolzha</b><small>обычно отвечает в Telegram</small></span></div><div class="q13-log" aria-live="polite"></div><div class="q13-chips">${FAQ.map(([q], i) => `<button type="button" data-i="${i}">${q}</button>`).join('')}</div></div></div>`,
      init: box => {
        const log = $('.q13-log', box); let busy = false;
        const add = (cls, html) => { const d = document.createElement('div'); d.className = 'q13-msg ' + cls; d.innerHTML = html; log.appendChild(d); log.scrollTop = log.scrollHeight; return d; };
        const ask = (i, instant) => {
          if (busy) return; busy = true; add('me', FAQ[i][0]);
          $$('.q13-chips button', box)[i].disabled = true;
          if (instant || reduce) { add('dz', FAQ[i][1]); busy = false; return; }
          const t = add('dz typing', '<i></i><i></i><i></i>');
          setTimeout(() => { t.classList.remove('typing'); t.textContent = FAQ[i][1]; log.scrollTop = log.scrollHeight; busy = false; }, 900);
        };
        $$('.q13-chips button', box).forEach(b => b.addEventListener('click', () => ask(+b.dataset.i)));
        ask(0, true);
      } }),
    3: () => ({ html: `<div class="wrap">${qHead('q13-row')}<div class="q13-tabs"><div class="q13-tl" role="tablist" aria-label="Вопросы">${FAQ.map(([q], i) => `<button type="button" role="tab" aria-selected="${!i}" data-i="${i}">${q}</button>`).join('')}</div><div class="q13-tp" role="tabpanel"></div></div></div>`,
      init: box => { const p = $('.q13-tp', box), bs = $$('.q13-tl button', box); const set = i => { bs.forEach((b, j) => b.setAttribute('aria-selected', j === i)); p.innerHTML = `<span class="q13-k">Вопрос ${i + 1} из ${FAQ.length}</span><h3>${FAQ[i][0]}</h3><p>${FAQ[i][1]}</p>`; p.classList.remove('sw'); void p.offsetWidth; p.classList.add('sw'); }; bs.forEach((b, i) => { b.addEventListener('click', () => set(i)); b.addEventListener('pointerenter', () => fine && set(i)); }); set(0); } }),
    4: () => `<div class="wrap">${qHead('q13-row')}<div class="q13-grid">${FAQ.map(([q, a]) => `<article class="q13-card"><h3>${q}</h3><p>${a}</p></article>`).join('')}</div></div>`,
    5: () => `<div class="wrap">${qHead('q13-row')}<div class="q13-big">${FAQ.map((_, i) => det('q13-bd', i, false)).join('')}</div></div>`,
    6: () => ({ html: `<div class="wrap q13-split">${qHead()}<div><label class="q13-s"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg><input type="search" placeholder="Например, домен или оплата" aria-label="Поиск по вопросам"></label><div class="q13-sl">${FAQ.map((_, i) => det('q13-d', i, false)).join('')}</div><p class="q13-none" hidden>Такого вопроса тут нет. Напишите в Telegram, отвечу лично.</p></div></div>`,
      init: box => { const inp = $('input', box), ds = $$('.q13-sl details', box), none = $('.q13-none', box); inp.addEventListener('input', () => { const q = inp.value.trim().toLowerCase(); let n = 0; ds.forEach((d, i) => { const hit = !q || (FAQ[i][0] + ' ' + FAQ[i][1]).toLowerCase().includes(q); d.hidden = !hit; if (hit) n++; d.open = !!q && hit && n === 1; }); none.hidden = n > 0; }); } }),
    7: () => ({ html: `<div class="wrap">${qHead('q13-row')}<div class="q13-flip">${FAQ.map(([q, a]) => `<div class="q13-fc"><div class="q13-fi"><div class="q13-ff"><h3>${q}</h3><button type="button" class="q13-fb">Ответ</button></div><div class="q13-fbk"><p>${a}</p><button type="button" class="q13-fb q13-back">К вопросу</button></div></div></div>`).join('')}</div></div>`,
      init: box => $$('.q13-fc', box).forEach(c => $$('.q13-fb', c).forEach(b => b.addEventListener('click', () => { c.classList.toggle('fl'); $(c.classList.contains('fl') ? '.q13-back' : '.q13-ff .q13-fb', c).focus({ preventScroll: true }); }))) }),
    8: () => `<div class="wrap q13-split q13-sticky">${qHead()}<div class="q13-all">${FAQ.map(([q, a], i) => `<div class="q13-it"><span class="q13-n">${String(i + 1).padStart(2, '0')}</span><div><h3>${q}</h3><p>${a}</p></div></div>`).join('')}</div></div>`,
    9: () => `<div class="q13-dark"><div class="wrap q13-split">${qHead()}<div class="q13-dl">${FAQ.map((_, i) => det('q13-dd', i, i === 0)).join('')}</div></div></div>`,
    10: () => ({ html: `<div class="wrap">${qHead('q13-row')}<div class="q13-car"><div class="q13-cs">${FAQ.map(([q, a], i) => `<article class="q13-cc${i ? '' : ' on'}"><span class="q13-k">Вопрос ${i + 1} из ${FAQ.length}</span><h3>${q}</h3><p>${a}</p></article>`).join('')}</div><div class="q13-cn"><button type="button" class="q13-cb" data-d="-1" aria-label="Предыдущий вопрос">${ic.right}</button><div class="q13-dots">${FAQ.map((_, i) => `<button type="button" data-i="${i}" aria-label="Вопрос ${i + 1}"${i ? '' : ' aria-current="true"'}></button>`).join('')}</div><button type="button" class="q13-cb" data-d="1" aria-label="Следующий вопрос">${ic.right}</button></div></div></div>`,
      init: box => { const cs = $$('.q13-cc', box), ds = $$('.q13-dots button', box); let i = 0; const set = n => { i = (n + cs.length) % cs.length; cs.forEach((c, j) => c.classList.toggle('on', j === i)); ds.forEach((d, j) => j === i ? d.setAttribute('aria-current', 'true') : d.removeAttribute('aria-current')); }; $$('.q13-cb', box).forEach(b => b.addEventListener('click', () => set(i + +b.dataset.d))); ds.forEach(d => d.addEventListener('click', () => set(+d.dataset.i))); } }),
  };
  // аккордеон: открыт один вопрос
  QS.addEventListener('toggle', e => { const d = e.target; if (d.matches && d.matches('.x13 details') && d.open) $$('.x13 details', QS).forEach(o => { if (o !== d && o.parentElement === d.parentElement) o.open = false; }); }, true);

  // ================= КОНТАКТЫ =================
  const CS = $('#svyaz', st), CF = $('.cf', CS), CF_HOME = CF && CF.parentElement;
  const ctBtn = ($('#svyaz .ct-copy .vbtn', st) || {}).outerHTML || '';
  const ctLinks = ($('#svyaz .ct-links', st) || {}).outerHTML || '';
  const CT = D.contact;
  const cH = (cls = '') => `<h2 class="h2 c13-h ${cls}"><span class="l l1">${CT.h[0]}</span> <span class="l l2">${CT.h[1]}</span></h2>`;
  const cP = `<p class="ct-p c13-p">${CT.p}</p>`;
  const cQuote = `<p class="c13-q">${CT.quote}</p>`;
  const SLOT = '<div class="c13-slot"></div>';
  const copy = (extra = '') => `<div class="ct-copy c13-copy">${cH()}${cP}${ctBtn}${ctLinks}${extra}</div>`;
  const CV = {
    1: () => `<div class="wrap c13-g c13-rev">${copy(cQuote)}${SLOT}</div>`,
    2: () => `<div class="wrap c13-center"><div class="ct-copy c13-copy">${cH()}${cP}</div>${SLOT}<div class="c13-row">${ctBtn}${ctLinks}</div></div>`,
    3: () => `<div class="wrap"><div class="c13-darkc c13-g">${copy(cQuote)}${SLOT}</div></div>`,
    4: () => `<div class="wrap"><div class="c13-hd">${cH()}${cP}</div><div class="c13-two"><div class="c13-tg"><img src="img/qr-tg.svg" alt="QR-код: Telegram ${esc(D.tgName)}" width="160" height="160"><b>${D.tgName}</b><p>Наведите камеру телефона, откроется чат в Telegram. Это самый быстрый способ.</p>${ctBtn}</div>${SLOT}</div></div>`,
    5: () => `<div class="wrap"><div class="ct-copy c13-copy">${cH('c13-huge')}</div><div class="c13-g c13-g5"><div class="ct-copy c13-copy">${cP}${ctBtn}${ctLinks}${cQuote}</div>${SLOT}</div></div>`,
    6: () => `<div class="wrap"><div class="c13-hd">${cH()}${cP}</div><div class="c13-tiles"><a class="c13-tile c13-t1" href="${D.tg}" target="_blank" rel="noopener"><span>Telegram</span><b>${D.tgName}</b><em>Быстрее всего</em></a><a class="c13-tile" href="mailto:${D.mail}"><span>Почта</span><b>${D.mail}</b><em>Для длинных писем и файлов</em></a><a class="c13-tile" href="${D.price}" target="_blank" rel="noopener"><span>Прайс-лист</span><b>PDF</b><em>Цены и что входит</em></a></div>${SLOT}</div>`,
    7: () => `<div class="wrap c13-g"><div class="c13-card"><img class="c13-ph" src="${D.photos[0][0]}" alt="${esc(D.photos[0][1])}"><div><b class="c13-nm">Dolzha</b><span class="c13-role">Веб-разработчик, Екатеринбург</span></div><p>${CT.p}</p>${ctLinks}${ctBtn}</div><div>${cH('c13-mid')}${SLOT}</div></div>`,
    8: () => `<div class="wrap c13-g"><div class="ct-copy c13-copy">${cH()}<ol class="c13-steps"><li><b>Вы пишете</b><span>Коротко о бизнесе и задаче, в форме или в Telegram.</span></li><li><b>Я показываю макет</b><span>${D.preview.p.split('. ')[0]}.</span></li><li><b>Решаете вы</b><span>Если макет не подходит, вы ничего не платите.</span></li></ol>${ctBtn}</div>${SLOT}</div>`,
    9: () => `<div class="c13-split"><div class="c13-sl"><div class="ct-copy c13-copy">${cH()}${cP}${ctBtn}${ctLinks}</div></div><div class="c13-sr">${SLOT}</div></div>`,
    10: () => ({ html: `<div class="wrap c13-min"><p class="c13-k">${CT.p}</p><a class="c13-big" href="${D.tg}" target="_blank" rel="noopener"><span>${D.tgName}</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg></a><div class="c13-alt"><a href="mailto:${D.mail}">${D.mail}</a><button type="button" class="c13-open" aria-expanded="false">Или оставьте заявку здесь</button></div><div class="c13-fold">${SLOT}</div></div>`,
      init: box => { const b = $('.c13-open', box), f = $('.c13-fold', box); b.addEventListener('click', () => { const o = f.classList.toggle('open'); b.setAttribute('aria-expanded', o); }); } }),
  };

  // ================= ПОДВАЛ =================
  const FT = $('.m-ft .ft', st);
  const navL = D.nav.map(([h, t]) => `<a href="${h}">${t}</a>`).join('');
  const ICO = { tg: 'M21 3 3 10.5l7 2.6 2.6 7z', mail: 'M4 6h16v12H4zM4 7l8 6 8-6', gh: 'M9 19c-4 1.3-4-2-6-2.5m12 4.5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.7 4.7 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.7 11.7 0 0 0-6.2 0C6.6 2.8 5.6 3.1 5.6 3.1a4.3 4.3 0 0 0-.1 3.2A4.7 4.7 0 0 0 4.2 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21', pdf: 'M7 3h7l4 4v14H7zM14 3v4h4M10 13h5M10 17h5' };
  const icn = k => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${ICO[k]}"/></svg>`;
  const socials = `<div class="f13-soc"><a href="${D.tg}" target="_blank" rel="noopener" aria-label="Telegram">${icn('tg')}</a><a href="mailto:${D.mail}" aria-label="Почта">${icn('mail')}</a><a href="${D.github}" target="_blank" rel="noopener" aria-label="GitHub">${icn('gh')}</a><a href="${D.price}" target="_blank" rel="noopener" aria-label="Прайс-лист PDF">${icn('pdf')}</a></div>`;
  const tagT = () => { const p = $('.ft-brand p', st); return (p && (p.dataset.t0 || p.textContent)) || ''; };
  const brand = () => `<div class="f13-brand"><a class="f13-logo" href="#top" aria-label="Dolzha, на главную">${LOGO()}<b>Dolzha</b></a><p class="f13-tag">${TXT_now('foot') || tagT()}</p></div>`;
  const cols = `<div class="f13-col"><p class="f13-h">Разделы</p><nav aria-label="Разделы в подвале">${navL}</nav></div><div class="f13-col"><p class="f13-h">Связь</p><a href="${D.tg}" target="_blank" rel="noopener">Telegram ${D.tgName}</a><a href="mailto:${D.mail}">${D.mail}</a><a href="${D.github}" target="_blank" rel="noopener">github.com/Dolzha</a><a href="${D.price}" target="_blank" rel="noopener">Прайс-лист, PDF</a></div>`;
  const bot = `<div class="f13-bot"><span>${D.footer.copy}</span><span>56.8389° N, 60.6057° E, Екатеринбург</span><a href="#top">Наверх</a></div>`;
  const ycl = new Intl.DateTimeFormat('ru-RU', { timeZone: 'Asia/Yekaterinburg', hour: '2-digit', minute: '2-digit' });
  const FV = {
    1: () => `<div class="wrap f13-one"><div class="f13-line">${brand()}<nav class="f13-nav" aria-label="Разделы в подвале">${navL}</nav>${socials}</div>${bot}</div>`,
    2: () => `<div class="wrap"><div class="f13-cta"><div><b>Обсудим ваш проект?</b><span>Покажу макет до оплаты: главный экран, услуги и работы.</span></div><a class="f13-3d" href="#svyaz">Обсудить проект</a></div><div class="f13-grid">${brand()}${cols}</div>${bot}</div>`,
    3: () => `<div class="wrap"><p class="f13-slog">Создаю сайты, <span>которые работают</span> на вас</p><div class="f13-grid">${brand()}${cols}</div>${bot}</div>`,
    4: () => `<div class="f13-light"><div class="wrap"><div class="f13-card"><div class="f13-grid">${brand()}${cols}</div>${socials}</div>${bot}</div></div>`,
    5: () => `<div class="wrap f13-center">${brand()}<nav class="f13-nav" aria-label="Разделы в подвале">${navL}</nav>${socials}${bot}</div>`,
    6: () => `<div class="wrap"><div class="f13-grid f13-g4">${brand()}${cols}<div class="f13-qr"><img src="img/qr-tg.svg" alt="QR-код: Telegram ${esc(D.tgName)}" width="120" height="120"><span>Наведите камеру, откроется Telegram</span></div></div>${bot}</div>`,
    7: () => `<div class="f13-mq" aria-hidden="true"><div class="f13-mt">${[0, 1].map(() => D.svc.map(s => `<span>${s.name} <b>${s.from ? 'от ' : ''}${s.price} ₽</b></span><i></i>`).join('') + D.extras.map(([t, p]) => `<span>${t} <b>${p} ₽</b></span><i></i>`).join('')).join('')}</div></div><div class="wrap"><div class="f13-grid">${brand()}${cols}</div>${bot}</div>`,
    8: () => ({ html: `<div class="wrap"><div class="f13-now"><span class="f13-dot"></span><span>Беру 2-3 проекта в месяц</span><span class="f13-sep"></span><span class="f13-clock"></span></div><div class="f13-grid">${brand()}${cols}</div>${bot}</div>`,
      init: box => { const c = $('.f13-clock', box), t = () => { c.textContent = 'В Екатеринбурге ' + ycl.format(new Date()); }; t(); every('f', 15000, t); } }),
    9: () => ({ html: `<div class="wrap"><div class="f13-grid f13-g4">${brand()}${cols}<button type="button" class="f13-up" aria-label="Наверх"><svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 6c6 5 8.5 12 7.5 21h-15C15.5 18 18 11 24 6z"/><circle cx="24" cy="17" r="3"/><path d="M16.5 24l-5 7 6-1.5M31.5 24l5 7-6-1.5M20 31h8l-2 5h-4z"/></svg><span>Наверх</span></button></div>${bot}</div>`,
      init: box => { const b = $('.f13-up', box); b.addEventListener('click', () => { b.classList.add('fly'); scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); setTimeout(() => b.classList.remove('fly'), 1400); }); } }),
    10: () => `<div class="wrap"><div class="f13-bento"><div class="f13-b1">${brand()}</div><a class="f13-b2" href="${D.tg}" target="_blank" rel="noopener">${icn('tg')}<b>Telegram</b><span>${D.tgName}</span></a><a class="f13-b3" href="mailto:${D.mail}">${icn('mail')}<b>Почта</b><span>${D.mail}</span></a><a class="f13-b4" href="${D.price}" target="_blank" rel="noopener">${icn('pdf')}<b>Прайс-лист</b><span>PDF</span></a><nav class="f13-b5" aria-label="Разделы в подвале">${navL}</nav></div>${bot}</div>`,
  };

  // ================= МАСКОТ =================
  const say = t => `<span class="m13-say">${t}</span>`;
  const MV = {
    1: () => { body.insertAdjacentHTML('beforeend', `<button type="button" class="m13 m13-corner" aria-label="Перейти к форме заявки">${say('Обсудим проект?')}${LOGO()}</button>`); const m = body.lastElementChild; m.addEventListener('click', () => goto('#svyaz')); every('m', 9000, () => { m.classList.add('talk'); setTimeout(() => m.classList.remove('talk'), 2600); }); lookAt('m', m); return m; },
    2: () => { const host = $('.cf', st); if (!host) return; host.insertAdjacentHTML('afterbegin', `<span class="m13 m13-sit" aria-hidden="true">${LOGO()}${say('Привет! Я Dolzha')}</span>`); const m = $('.m13-sit', host); lookAt('m', m); return m; },
    3: () => { const ft = $('.m-ft .ft', st); ft.insertAdjacentHTML('beforeend', `<span class="m13 m13-bye" aria-hidden="true">${say('Спасибо, что долистали!')}${LOGO()}</span>`); const m = $('.m13-bye', ft); watch('m', [ft], es => es.forEach(e => m.classList.toggle('in', e.isIntersecting)), { threshold: .3 }); lookAt('m', m); return m; },
    4: () => { body.insertAdjacentHTML('beforeend', `<div class="m13 m13-rail" aria-hidden="true"><i class="m13-fill"></i><span class="m13-rider">${LOGO()}</span></div>`); const m = body.lastElementChild, rd = $('.m13-rider', m), fl = $('.m13-fill', m); const upd = () => { const p = Math.min(1, scrollY / (document.documentElement.scrollHeight - innerHeight || 1)); rd.style.top = `calc(${(p * 100).toFixed(2)}% - ${(p * 34).toFixed(1)}px)`; fl.style.transform = `scaleY(${p})`; }; upd(); on('m', window, 'scroll', upd, { passive: true }); return m; },
    5: () => { const T = [['#raboty', 'Тут живые сайты'], ['#obo-mne', 'Это я'], ['#svyaz', 'Пишите!']]; const made = []; T.forEach(([s, t], i) => { const h = $$(`${s} .h2`, st).find(x => x.offsetParent); if (!h) return; h.insertAdjacentHTML('beforeend', `<span class="m13 m13-stk" style="--r:${[-12, 9, -7][i]}deg" aria-hidden="true">${LOGO()}<em>${t}</em></span>`); made.push(h.lastElementChild); }); lookAt('m', st); return made; },
    6: () => { const S = ['#raboty', '#uslugi', '#podhod', '#voprosy'].map(s => $(s, st)).filter(Boolean); const made = S.map((s, i) => { s.insertAdjacentHTML('beforeend', `<span class="m13 m13-peek ${i % 2 ? 'l' : 'r'}" aria-hidden="true">${LOGO()}</span>`); return s.lastElementChild; }); watch('m', S, es => es.forEach(e => { const m = $('.m13-peek', e.target); if (m) m.classList.toggle('in', e.isIntersecting); }), { threshold: .25 }); lookAt('m', st); return made; },
    7: () => { body.insertAdjacentHTML('beforeend', `<span class="m13 m13-pop" aria-hidden="true">${LOGO()}${say('Отличный выбор!')}</span>`); const m = body.lastElementChild; const sel = '.b12,.vbtn,.btn,.hd11-cta,.pdf12,.f13-3d,.btn-2'; on('m', document, 'pointerover', e => { if (e.target.closest(sel)) m.classList.add('up'); }); on('m', document, 'pointerout', e => { const a = e.target.closest(sel); if (a && !a.contains(e.relatedTarget)) m.classList.remove('up'); }); return m; },
    8: () => { if (!fine || reduce) return; body.insertAdjacentHTML('beforeend', `<span class="m13 m13-buddy" aria-hidden="true">${LOGO()}</span>`); const m = body.lastElementChild; let x = -100, y = -100, cx = -100, cy = -100, raf = 0; const tick = () => { cx += (x - cx) * .12; cy += (y - cy) * .12; m.style.transform = `translate(${cx + 22}px,${cy + 18}px) rotate(${Math.max(-14, Math.min(14, (x - cx) * .25))}deg)`; raf = Math.abs(x - cx) + Math.abs(y - cy) > .4 ? requestAnimationFrame(tick) : 0; }; on('m', document, 'pointermove', e => { x = e.clientX; y = e.clientY; m.classList.toggle('hide', !!e.target.closest('input,textarea,.p11')); if (!raf) raf = requestAnimationFrame(tick); }, { passive: true }); bag.m.push(() => cancelAnimationFrame(raf)); lookAt('m', m); return m; },
    9: () => { const ft = $('.m-ft .ft', st); ft.insertAdjacentHTML('afterbegin', `<span class="m13 m13-egg" aria-hidden="true">${LOGO()}${say('Вы долистали до конца. Обсудим проект?')}</span>`); const m = $('.m13-egg', ft); watch('m', [ft], es => es.forEach(e => { if (e.isIntersecting) m.classList.add('drop'); }), { threshold: .15 }); return m; },
    10: () => { const c = $('#obo-mne .car', st) || $('#obo-mne', st); c.insertAdjacentHTML('beforeend', `<span class="m13 m13-ab" aria-hidden="true">${LOGO()}${say('Привет! Это я')}</span>`); const m = $('.m13-ab', c); lookAt('m', m); return m; },
  };
  let mMade = [];

  // ================= АНИМАЦИЯ ЛОГОТИПА В ШАПКЕ =================
  const HL = () => $('.hd11-logo .lg6', st);
  const LV = {
    7: () => { const s = HL(); if (!s || $('.l13-code', s)) return; const g = $('.l6b', s); g && g.insertAdjacentHTML('beforeend', '<g class="l13-code"><rect x="5" y="5" width="11" height="2.6" rx="1.3"/><rect x="5" y="10" width="17" height="2.6" rx="1.3"/><rect x="5" y="15" width="8" height="2.6" rx="1.3"/><rect class="l13-cur" x="15" y="15" width="2" height="2.6"/></g>'); },
    8: () => { const gr = $('#lgGr'); if (!gr || $('animateTransform', gr)) return; gr.insertAdjacentHTML('beforeend', '<animateTransform class="l13-anim" attributeName="gradientTransform" type="rotate" from="0 .5 .5" to="360 .5 .5" dur="7s" repeatCount="indefinite"/>'); },
    9: () => { let t = 0, last = scrollY; const a = $('.hd11-logo', st); on('l', window, 'scroll', () => { const d = scrollY - last; last = scrollY; a.classList.toggle('dn', d > 0); clearTimeout(t); t = setTimeout(() => { a.classList.remove('dn'); a.classList.remove('bnc'); void a.offsetWidth; a.classList.add('bnc'); }, 160); }, { passive: true }); },
  };
  const lClean = () => { $$('.l13-code').forEach(x => x.remove()); $$('#lgGr .l13-anim').forEach(x => x.remove()); const a = $('.hd11-logo', st); if (a) a.classList.remove('dn', 'bnc'); const f = $('.hd11-logo .l6f', st); if (f) f.style.transform = ''; };

  // ================= НАВЕДЕНИЕ =================
  const CARD = '.x12-w a[data-k], .xs7-c, .sn-c, .q13-card, .q13-d, .c13-tile, .xw2-t';
  const HV = {
    2: () => { if (!fine || reduce) return; on('h', document, 'pointermove', e => { const b = e.target.closest('.b12,.vbtn,.btn,.hd11-cta,.pdf12,.btn-2'); $$('.h13-mag').forEach(x => { if (x !== b) { x.style.translate = ''; x.classList.remove('h13-mag'); } }); if (!b) return; const r = b.getBoundingClientRect(); b.classList.add('h13-mag'); b.style.translate = `${((e.clientX - r.left - r.width / 2) * .25).toFixed(1)}px ${((e.clientY - r.top - r.height / 2) * .35).toFixed(1)}px`; }, { passive: true }); },
    3: () => { if (!fine) return; on('h', document, 'pointermove', e => { const c = e.target.closest(CARD + ',.b12,.vbtn'); if (!c) return; const r = c.getBoundingClientRect(); c.style.setProperty('--hx', (e.clientX - r.left) + 'px'); c.style.setProperty('--hy', (e.clientY - r.top) + 'px'); }, { passive: true }); },
    8: () => { if (!fine || reduce) return; on('h', document, 'pointermove', e => { const c = e.target.closest(CARD); $$('.h13-tilt').forEach(x => { if (x !== c) { x.style.transform = ''; x.classList.remove('h13-tilt'); } }); if (!c) return; const r = c.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5; c.classList.add('h13-tilt'); c.style.transform = `perspective(900px) rotateY(${(px * 8).toFixed(2)}deg) rotateX(${(-py * 8).toFixed(2)}deg) translateZ(0)`; }, { passive: true }); },
    10: () => { if (!fine) return; body.insertAdjacentHTML('beforeend', '<span class="h13-lbl" aria-hidden="true">Смотреть</span>'); const l = body.lastElementChild; bag.h.push(() => l.remove()); on('h', document, 'pointermove', e => { const c = e.target.closest('.x12-w a[data-k]'); l.classList.toggle('on', !!c); l.style.transform = `translate(${e.clientX}px,${e.clientY}px)`; }, { passive: true }); },
  };
  const hClean = () => { $$('.h13-mag').forEach(x => { x.style.translate = ''; x.classList.remove('h13-mag'); }); $$('.h13-tilt').forEach(x => { x.style.transform = ''; x.classList.remove('h13-tilt'); }); };

  // ================= ТЕКСТЫ =================
  // Без «местного/малого бизнеса»: бизнес и специалисты, слоган «Создаю сайты, которые работают на вас», риторика dolzha.github.io.
  const TX = {
    1: { hero: 'Помогаю бизнесу и специалистам создать сайт мечты, от концепции до запуска. Понимаю, какие решения нужны именно вашему проекту.',
      works: 'Каждая работа открывается по кнопке. Это реальные работающие сайты.',
      appr: 'От первого сообщения до запуска на вашем домене. Каждая оплата привязана к этапу работы.',
      ab1: 'Веб-разработчик из Екатеринбурга. Делаю быстрые сайты для бизнеса, от лендинга до многостраничника. Настоящие работающие сайты, а не картинки.',
      ab2: 'Структура, дизайн, вёрстка и запуск в одних руках. Беру 2-3 проекта в месяц, поэтому на каждый хватает времени.',
      faq: 'Ответы на частые вопросы. Не нашли свой, спросите в Telegram.',
      ct: 'Расскажите о вашей идее, предложу решение и сроки. Быстрее всего в Telegram.',
      foot: 'Создаю современные и эффективные веб-решения для бизнеса и частных специалистов.' },
    2: { hero: 'Сайты для бизнеса и специалистов. Сам продумываю, рисую, верстаю и запускаю.',
      works: 'Нажмите на работу, чтобы посмотреть её на компьютере и телефоне.',
      appr: 'Пять шагов от первого сообщения до запуска. Платите по этапам.',
      ab1: 'Веб-разработчик из Екатеринбурга. Делаю сайты от лендинга до каталога.',
      ab2: 'Беру 2-3 проекта в месяц, поэтому каждому хватает времени.',
      faq: 'Коротко о главном. Остальное спросите в Telegram.',
      ct: 'Напишите, чем занимаетесь, и я предложу решение и сроки.',
      foot: 'Сайты, которые работают на вас.' },
    3: { hero: 'Делаю сайты, на которых клиент быстро находит услугу, видит цену и оставляет заявку. От идеи до запуска на вашем домене.',
      works: 'Это не макеты, а сайты, которые уже работают на своих владельцев. Откройте любой.',
      appr: 'Вы видите результат до оплаты, а платите по этапам. Так проще доверять.',
      ab1: 'Веб-разработчик из Екатеринбурга. Мне важно, чтобы сайт приводил заявки, а не просто красиво выглядел.',
      ab2: 'Сам собираю структуру, дизайн и код, поэтому ничего не теряется между подрядчиками. Беру 2-3 проекта в месяц.',
      faq: 'Вопросы, которые задают чаще всего перед заказом.',
      ct: 'Опишите задачу. Подскажу, какой сайт нужен и во сколько он обойдётся.',
      foot: 'Сайты для бизнеса и специалистов, которые приводят клиентов.' },
    4: { hero: 'Я Dolzha, делаю сайты для бизнеса и специалистов. Разбираюсь в вашем деле и собираю сайт, который не стыдно показать клиентам.',
      works: 'Мои работы. Нажмите на любую, покажу, что внутри.',
      appr: 'Всё делаю сам, от первого разговора до запуска. Вы всегда знаете, на каком мы этапе.',
      ab1: 'Привет! Я веб-разработчик из Екатеринбурга. Делаю сайты от лендинга до многостраничника и каждый довожу до запуска.',
      ab2: 'Беру 2-3 проекта в месяц, чтобы на каждый хватало внимания.',
      faq: 'Здесь ответы на то, что обычно спрашивают. Если вашего вопроса нет, просто напишите мне.',
      ct: 'Расскажите о своей идее. Отвечу, предложу решение и назову сроки.',
      foot: 'Делаю сайты для бизнеса и специалистов.' },
    5: { hero: 'Продумываю, рисую и собираю сайты, в которых удобно и красиво. Для бизнеса и специалистов, от концепции до запуска.',
      works: 'Каждый сайт сделан под свой бизнес: свой стиль, своя структура. Откройте и полистайте.',
      appr: 'Сначала макет, потом код. Дизайн вы видите до оплаты.',
      ab1: 'Веб-разработчик и дизайнер из Екатеринбурга. Сам рисую макеты в Figma и сам их верстаю, поэтому сайт выглядит так, как задумано.',
      ab2: 'Беру 2-3 проекта в месяц, чтобы не делать по шаблону.',
      faq: 'Ответы на вопросы о сроках, оплате и правах на сайт.',
      ct: 'Покажу, как может выглядеть ваш сайт, ещё до оплаты. Начнём с короткого сообщения.',
      foot: 'Дизайн и разработка сайтов для бизнеса и специалистов.' },
  };
  const TSEL = { hero: '.m-hero .h11 .lead, .m-hero .hero-in .lead', works: '#raboty .l12, #raboty .sec-lead', appr: '#podhod .l12, #podhod .sec-lead', ab1: '#obo-mne .ab-p, #obo-mne .a12-p', ab2: '#obo-mne .ab-p2, #obo-mne .a12-p2', faq: '#voprosy .sec-lead', ct: '#svyaz .ct-p', foot: '.ft-brand p' };
  function TXT_now(k) { return V.t ? (TX[V.t] || {})[k] : null; }
  const metaD = $('meta[name="description"]'), meta0 = metaD && metaD.content;
  let tBusy = false;
  const applyTexts = () => {
    if (tBusy) return; tBusy = true;
    Object.entries(TSEL).forEach(([k, sel]) => $$(sel, st).forEach(el => { if (el.dataset.t0 === undefined) el.dataset.t0 = el.textContent; const want = TXT_now(k) || el.dataset.t0; if (el.textContent !== want) el.textContent = want; }));
    if (metaD) metaD.content = V.t ? 'Веб-разработчик Dolzha, Екатеринбург. ' + TX[V.t].foot : meta0;
    tBusy = false;
  };
  let tT = 0; new MutationObserver(() => { clearTimeout(tT); tT = setTimeout(applyTexts, 30); }).observe(st, { childList: true, subtree: true });

  // ================= применение =================
  const X = { q: QS, c: CS, f: FT };
  Object.entries(X).forEach(([k, sec]) => { if (sec) sec.insertAdjacentHTML('beforeend', `<div class="x13 x13-${k}"></div>`); });
  const SET = { q: QV, c: CV, f: FV };
  const render = k => {
    clean(k);
    if (SET[k]) {
      const box = $(`.x13-${k}`, X[k]); if (!box) return;
      if (k === 'c' && CF && CF_HOME) CF_HOME.appendChild(CF); // форма возвращается домой, потом переезжает в новый слот
      box.innerHTML = '';
      if (V[k]) { const r = SET[k][V[k]](), html = typeof r === 'string' ? r : r.html; box.innerHTML = html; if (r.init) r.init(box); }
      if (k === 'c' && V.c && CF) { const s = $('.c13-slot', box); if (s) s.appendChild(CF); }
      if (k === 'f' || k === 'c') { applyTexts(); }
      return;
    }
    if (k === 'm') { mMade.flat().forEach(x => x && x.remove()); mMade = []; if (V.m) { const r = MV[V.m](); mMade = [].concat(r || []); } return; }
    if (k === 'l') { lClean(); if (LV[V.l]) LV[V.l](); if (V.l === 6) lookAt('l', $('.hd11-logo', st)); return; }
    if (k === 'h') { hClean(); if (HV[V.h]) HV[V.h](); return; }
    if (k === 't') { render('f'); applyTexts(); }
  };
  const apply = k => { body.className = body.className.replace(new RegExp(`\\b${k}13-\\d+\\b`, 'g'), '').trim() + ` ${k}13-${V[k]}`; render(k); };
  body.classList.add('v13');
  // маскот 2 садится на форму: форму сначала ставим на место
  ['c', 'q', 'f', 't', 'l', 'h', 'm'].forEach(apply);

  // ================= панель: строки в общую панель site12 =================
  const pan = $('.p12'); if (!pan) return;
  pan.classList.add('p13');
  $('.p11-t span', pan).textContent = 'Варианты блоков, 0 = как сейчас';
  $('.p11-f', pan).insertAdjacentHTML('beforebegin', G.map(([k, n, go, o]) => `<div class="p11-g"><p class="p11-h">${go ? `<button type="button" class="p12-go" data-go="${go}">${n} ↓</button>` : `<span>${n}</span>`}<b data-n13="${k}">${V[k]}. ${o[V[k]]}</b></p><div class="p11-r" data-k13="${k}">${o.map((t, i) => `<button type="button" data-n="${i}" aria-pressed="${V[k] === i}" title="${i}. ${t}">${i}</button>`).join('')}</div></div>`).join(''));
  $$('.p12-go[data-go]', pan).forEach(b => b.addEventListener('click', () => { const g = b.dataset.go; if (g === 'top') scrollTo({ top: 0, behavior: 'smooth' }); else goto(g); }));
  $$('.p11-r[data-k13]', pan).forEach(g => g.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const k = g.dataset.k13; V[k] = +b.dataset.n; ls.set('v14-' + k, V[k]);
    $$('button', g).forEach(x => x.setAttribute('aria-pressed', x === b));
    $(`[data-n13="${k}"]`, pan).textContent = `${V[k]}. ${G.find(x => x[0] === k)[3][V[k]]}`;
    const sec = X[k], before = sec ? sec.getBoundingClientRect().top : 0;
    apply(k);
    if (sec) scrollTo({ top: sec.getBoundingClientRect().top + scrollY - (before > 0 ? before : 80) });
  }));
  // «Скопировать выбор»: все строки панели
  const old = $('.p11-cp', pan), cp = old.cloneNode(true); old.replaceWith(cp);
  cp.addEventListener('click', () => {
    const t = $$('.p11-g', pan).map(g => `${$('.p11-h button, .p11-h span', g).textContent.replace(/ ↓|: открыть ↗/, '')} ${$('.p11-h b', g).textContent}`).join('; ');
    const ok = () => { $('.p11-ok', pan).hidden = false; setTimeout(() => { $('.p11-ok', pan).hidden = true; }, 2500); };
    (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(ok, () => prompt('Скопируйте строку:', t));
  });
})();
