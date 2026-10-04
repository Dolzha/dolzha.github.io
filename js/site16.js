/* Шестнадцатый круг (04.10). Закреплено: главная 7 (заголовок по центру, текст и кнопки по нижним краям), окно 2 «Паспорт»
   без строки «Сайт», телефон 11 (iPhone, js/phone3d.js). На выбор: кнопка «Смотреть проекты» ×5 (sp17-N),
   компоновка кнопок и текста ×5 (cm17-N), предпросмотр сайта в окне без ссылок и рамки браузера ×5 (pv17-N). Ключи v17-*. */
(function () {
  const body = document.body, st = document.getElementById('stage');
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const ls = { get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} } };
  const pan = $('.p12');
  body.classList.add('v16');

  // закрепляем выбор: нажимаем спрятанные кнопки строк site15
  const lock = sel => { const b = pan && $(sel, pan); if (b && b.getAttribute('aria-pressed') !== 'true') b.click(); };
  [['hc', 7], ['mi', 2], ['ph', 11]].forEach(([k, n]) => lock(`.p11-r[data-k15="${k}"] button[data-n="${n}"]`));
  scrollTo(0, 0);

  // «Смотреть проекты»: стрелку кладём в отдельный кружок, чтобы вариантам было что оформлять
  const prep = () => { const b = $('.m-hero .hx10 .actions .btn-2', st); if (!b || b.classList.contains('sp17')) return; b.classList.add('sp17'); const i = $('svg', b); if (i) { const w = document.createElement('span'); w.className = 'sp-ic'; i.before(w); w.append(i); } };
  prep();

  const G = [
    ['sp', 'Кнопка «Смотреть проекты»', 'top', ['', 'Контурная пилюля', 'Стеклянная с кружком', 'Тёмная', 'Ссылка с линией', 'Круг со стрелкой вниз']],
    ['cm', 'Главная: кнопки и текст', 'top', ['', 'Как сейчас', 'Одна нижняя панель', 'Под заголовком по центру', 'Кнопки столбиком справа', 'Кнопки слева, текст справа']],
    ['pv', 'Окно: предпросмотр сайта', 'open', ['', 'Чистый скриншот', 'Ноутбук', 'Монитор', 'Паспарту', 'Во всю панель']],
  ];
  const V = {};
  G.forEach(([k, , , o]) => { const v = ls.get('v17-' + k); V[k] = v !== null && /^\d+$/.test(v) && +v > 0 && +v < o.length ? +v : 1; });
  const apply = k => { body.className = body.className.replace(new RegExp(`\\b${k}17-\\d+\\b`, 'g'), '').trim() + ` ${k}17-${V[k]}`; };
  G.forEach(([k]) => apply(k));

  if (!pan) return;
  const openWork = () => { const c = $('.xw6-c', st) || $('#raboty .wk'); if (c && $('.dm').hidden) c.click(); };
  $('.p11-f', pan).insertAdjacentHTML('beforebegin', G.map(([k, n, g, o]) => `<div class="p11-g p16"><p class="p11-h"><button type="button" class="p12-go" data-go16="${g}">${n}${g === 'top' ? ' ↑' : ': открыть ↗'}</button><b data-n16="${k}">${V[k]}. ${o[V[k]]}</b></p><div class="p11-r" data-k16="${k}">${o.slice(1).map((t, i) => `<button type="button" data-n="${i + 1}" aria-pressed="${V[k] === i + 1}" title="${i + 1}. ${t}">${i + 1}</button>`).join('')}</div></div>`).join(''));
  $$('[data-go16]', pan).forEach(b => b.addEventListener('click', () => { if (b.dataset.go16 === 'top') scrollTo({ top: 0, behavior: 'smooth' }); else openWork(); }));
  $$('.p11-r[data-k16]', pan).forEach(g => g.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const k = g.dataset.k16; V[k] = +b.dataset.n; ls.set('v17-' + k, V[k]);
    $$('button', g).forEach(x => x.setAttribute('aria-pressed', x === b));
    $(`[data-n16="${k}"]`, pan).textContent = `${V[k]}. ${G.find(x => x[0] === k)[3][V[k]]}`;
    apply(k);
  }));
})();
