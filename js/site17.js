/* Семнадцатый круг (04.10). Закреплено: «Смотреть проекты» 2 (стеклянная с кружком), кнопки и текст 4 (столбиком справа),
   предпросмотр 4 (паспарту). Стрелка «Написать в Telegram» на главной смотрит вправо и не поворачивается.
   На выбор: анимация «Смотреть проекты» ×5 (sa18-N), выделение текста «Помогаю бизнесу…» ×5 (la18-N). Ключи v18-*. */
(function () {
  const body = document.body, st = document.getElementById('stage');
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const ls = { get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} } };
  const pan = $('.p12');
  body.classList.add('v17');

  const lock = sel => { const b = pan && $(sel, pan); if (b && b.getAttribute('aria-pressed') !== 'true') b.click(); };
  [['sp', 2], ['cm', 4], ['pv', 4]].forEach(([k, n]) => lock(`.p11-r[data-k16="${k}"] button[data-n="${n}"]`));

  // стрелка вправо в кнопке Telegram на главной
  const tg = $('.m-hero .hx10 .actions .btn .i', st);
  if (tg) tg.innerHTML = '<path d="M4 12h15M13 6l6 6-6 6"/>';

  // «Смотреть проекты»: слой для заливки и подпись поверх него
  const sp = $('.m-hero .hx10 .actions .btn-2', st);
  if (sp && !$('.sp-g', sp)) { sp.insertAdjacentHTML('afterbegin', '<i class="sp-g" aria-hidden="true"></i>'); const t = $(':scope > span:not(.sp-ic)', sp); if (t) t.classList.add('sp-txt'); }

  const G = [
    ['sa', 'Анимация «Смотреть проекты»', ['', 'Градиент, как у Telegram', 'Заливка из кружка', 'Стрелка проезжает', 'Тёмная заливка', 'Контур и подъём']],
    ['la', 'Выделение текста под заголовком', ['', 'Мятный контур', 'Тёмная карточка', 'Мятная карточка', 'Полоса слева', 'Крупнее и темнее']],
  ];
  const V = {};
  G.forEach(([k, , o]) => { const v = ls.get('v18-' + k); V[k] = v !== null && /^\d+$/.test(v) && +v > 0 && +v < o.length ? +v : 1; });
  const apply = k => { body.className = body.className.replace(new RegExp(`\\b${k}18-\\d+\\b`, 'g'), '').trim() + ` ${k}18-${V[k]}`; };
  G.forEach(([k]) => apply(k));
  scrollTo(0, 0);

  if (!pan) return;
  $('.p11-f', pan).insertAdjacentHTML('beforebegin', G.map(([k, n, o]) => `<div class="p11-g p17"><p class="p11-h"><button type="button" class="p12-go" data-go17>${n} ↑</button><b data-n17="${k}">${V[k]}. ${o[V[k]]}</b></p><div class="p11-r" data-k17="${k}">${o.slice(1).map((t, i) => `<button type="button" data-n="${i + 1}" aria-pressed="${V[k] === i + 1}" title="${i + 1}. ${t}">${i + 1}</button>`).join('')}</div></div>`).join(''));
  $$('[data-go17]', pan).forEach(b => b.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' })));
  $$('.p11-r[data-k17]', pan).forEach(g => g.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const k = g.dataset.k17; V[k] = +b.dataset.n; ls.set('v18-' + k, V[k]);
    $$('button', g).forEach(x => x.setAttribute('aria-pressed', x === b));
    $(`[data-n17="${k}"]`, pan).textContent = `${V[k]}. ${G.find(x => x[0] === k)[2][V[k]]}`;
    apply(k);
  }));
})();
