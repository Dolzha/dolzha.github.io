/* Пятнадцатый круг (04.10). Закреплено: главная 5 (по центру с дымкой), окно 15 (мятная рамка), кнопка Telegram 2 без анимаций,
   текст контактов 2, работы без подписей (как у студий: подпись внутри окна). На выбор: раскладка главной ×10 (hc16-N),
   интерфейс окна ×10 (mi16-N), 3D-телефон ×11 (ph16-N, js/phone3d.js). Ключи localStorage v16-*. */
(function () {
  const D = window.D, ic = window.SB.ic, body = document.body, st = document.getElementById('stage');
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const ls = { get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} } };
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const W = D.works, INFO = window.WINFO || {}, pan = $('.p12');
  body.classList.add('v15');

  // ---------- закрепляем выбор, нажимая спрятанные кнопки строк site14 ----------
  const lock = sel => { const b = pan && $(sel, pan); if (b && b.getAttribute('aria-pressed') !== 'true') b.click(); };
  [['dm', 15], ['ht', 5], ['tb', 2], ['ct', 2], ['cap', 1]].forEach(([k, n]) => lock(`.p11-r[data-k14="${k}"] button[data-n="${n}"]`));
  scrollTo(0, 0);

  // ---------- работы: без подписей, название только для экранного диктора ----------
  const label = () => $$('.xw6-c', st).forEach(a => { const k = a.dataset.k; if (k && !a.getAttribute('aria-label')) a.setAttribute('aria-label', `${W[k].name}, ${W[k].biz}: подробнее`); });
  label();

  // ---------- окно работы: интерфейс ×10 ----------
  const keyByName = n => Object.keys(W).find(k => W[k].name === n);
  const host = k => W[k].show.split('/')[0];
  const ARR = '<svg class="mx-ar" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>';
  const CHK = '<svg class="mx-ck" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7"/></svg>';
  const LOCK = '<svg class="mx-lk" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 11h10v9H7zM9.5 11V8.5a2.5 2.5 0 0 1 5 0V11"/></svg>';
  const go = (k, cls, inner) => `<a class="${cls}" href="${W[k].url}" target="_blank" rel="noopener">${inner}</a>`;
  const MI = {
    2: k => `<div class="mx mx2"><h3 class="mx-n">${W[k].name}</h3><dl class="mx2-dl"><div><dt>Ниша</dt><dd>${W[k].biz}</dd></div><div><dt>Сайт</dt><dd>${go(k, 'mx2-l', `${W[k].show}${ARR}`)}</dd></div><div><dt>Что сделано</dt><dd><ul>${W[k].tags.map(t => `<li>${t}</li>`).join('')}</ul></dd></div></dl><p class="mx-d">${INFO[k] || ''}</p>${go(k, 'mx-btn', `<span>Открыть сайт</span>${ARR}`)}</div>`,
    3: k => `<div class="mx mx3">${go(k, 'mx3-url', `${LOCK}<span class="mx3-h">${W[k].show}</span><span class="mx3-o">Открыть${ARR}</span>`)}<h3 class="mx-n">${W[k].name}</h3><p class="mx-b">${W[k].biz}</p><p class="mx-d">${INFO[k] || ''}</p><ul class="mx3-f">${W[k].tags.map(t => `<li>${CHK}<span>${t}</span></li>`).join('')}</ul></div>`,
    4: k => `<div class="mx mx4"><p class="mx-b">${W[k].biz}</p><h3 class="mx-n">${W[k].name}</h3><ol class="mx4-f">${W[k].tags.map((t, i) => `<li><b>${String(i + 1).padStart(2, '0')}</b><span>${t}</span></li>`).join('')}</ol><p class="mx-d">${INFO[k] || ''}</p>${go(k, 'mx4-go', `<span>${W[k].show}</span>${ARR}`)}</div>`,
    5: k => `<div class="mx mx5"><div class="mx5-a"><h3 class="mx-n">${W[k].name}</h3><p class="mx-b">${W[k].biz}</p></div><p class="mx-d">${INFO[k] || ''}</p><ul class="mx5-f">${W[k].tags.map(t => `<li>${CHK}${t}</li>`).join('')}</ul>${go(k, 'mx-btn', `<span>Открыть сайт</span>${ARR}`)}</div>`,
    6: k => `<div class="mx mx6"><p class="mx-b">${W[k].biz}</p><h3 class="mx-n">${W[k].name}</h3><p class="mx-d">${INFO[k] || ''}</p><ul class="mx6-f">${W[k].tags.map(t => `<li>${CHK}<span>${t}</span></li>`).join('')}</ul>${go(k, 'mx6-go', `<span>${host(k)}</span>${ARR}`)}</div>`,
    7: k => `<div class="mx mx7"><h3 class="mx-n">${W[k].name}</h3><p class="mx-b">${W[k].biz}</p><div class="mx7-t" role="tablist" aria-label="О работе"><button type="button" role="tab" aria-selected="true" data-t="0">О проекте</button><button type="button" role="tab" aria-selected="false" data-t="1">Что сделано</button><button type="button" role="tab" aria-selected="false" data-t="2">Сайт</button></div><div class="mx7-p on"><p class="mx-d">${INFO[k] || ''}</p></div><div class="mx7-p"><ul class="mx3-f">${W[k].tags.map(t => `<li>${CHK}<span>${t}</span></li>`).join('')}</ul></div><div class="mx7-p">${go(k, 'mx3-url', `${LOCK}<span class="mx3-h">${W[k].show}</span><span class="mx3-o">Открыть${ARR}</span>`)}</div></div>`,
    8: k => `<div class="mx mx8"><p class="mx8-k"><b>${W[k].name}</b><span>${W[k].biz}</span></p><p class="mx8-q">${INFO[k] || ''}</p><ul class="mx8-f">${W[k].tags.map(t => `<li>${CHK}<span>${t}</span></li>`).join('')}</ul>${go(k, 'mx8-go', `<span>${W[k].show}</span>${ARR}`)}</div>`,
    9: k => `<div class="mx mx9"><h3 class="mx-n">${W[k].name}</h3><div class="mx9-g"><div class="mx9-t"><span>Ниша</span><b>${W[k].biz}</b></div>${go(k, 'mx9-t mx9-l', `<span>Сайт</span><b>${host(k)}</b>${ARR}`)}${W[k].tags.map(t => `<div class="mx9-t mx9-f">${CHK}<b>${t}</b></div>`).join('')}<div class="mx9-t mx9-d"><p>${INFO[k] || ''}</p></div></div></div>`,
    10: k => `<div class="mx mx10"><h3 class="mx-n">${W[k].name}</h3><p class="mx-b">${W[k].biz}</p>${go(k, 'mx10-go', `<span>${host(k)}</span>${ARR}`)}<p class="mx10-f">${W[k].tags.join(', ')}</p><p class="mx-d">${INFO[k] || ''}</p></div>`,
  };
  const dm = $('.dm'), dmInfo = dm && $('.dm-info', dm), dmN = dm && $('.dm-n', dm);
  if (dmInfo) dmInfo.insertAdjacentHTML('afterbegin', '<div class="dmx"></div>');
  const dmx = dmInfo && $('.dmx', dmInfo);
  const renderInfo = () => {
    if (!dmx) return; const k = keyByName(dmN.textContent); if (!k) return;
    dmx.innerHTML = V.mi > 1 ? MI[V.mi](k) : '';
    $$('.mx7-t button', dmx).forEach(b => b.addEventListener('click', () => { $$('.mx7-t button', dmx).forEach(x => x.setAttribute('aria-selected', x === b)); $$('.mx7-p', dmx).forEach((p, i) => p.classList.toggle('on', i === +b.dataset.t)); }));
  };
  if (dmN) new MutationObserver(renderInfo).observe(dmN, { childList: true, characterData: true, subtree: true });

  // ---------- 3D-телефон ----------
  const stage = dm && $('.dm-stage', dm);
  let unmount = null;
  const mountPhone = () => {
    if (unmount) { unmount(); unmount = null; }
    const phw = stage && $('.dm-phw', stage); if (!phw || !window.Phone3D) return;
    const k = keyByName(dmN.textContent); if (!k) return;
    phw.classList.add('p3d-on');
    try { unmount = window.Phone3D.mount(phw, { k, host: host(k), variant: V.ph }); } catch (e) { phw.classList.remove('p3d-on'); }
  };
  if (stage) new MutationObserver(() => { const phw = $('.dm-phw', stage); if (phw && !phw.classList.contains('p3d-on')) mountPhone(); if (!phw && unmount) { unmount(); unmount = null; } }).observe(stage, { childList: true });
  addEventListener('phone3d-ready', () => { if (stage && $('.dm-phw', stage)) mountPhone(); });

  // ---------- строки панели ----------
  const G = [
    ['hc', 'Главный экран: раскладка', 'top', ['', 'Как сейчас', 'Заголовок в две строки', 'Лесенка', 'Подводка над заголовком', 'Кнопки в столбик', 'Средняя строка крупнее', 'Текст и кнопки по краям', 'Линза', 'Две колонки', 'Текст в две колонки']],
    ['mi', 'Окно: интерфейс', 'open', ['', 'Как сейчас', 'Паспорт проекта', 'Адресная строка', 'Крупные пункты', 'Нижняя панель', 'Тёмная карточка', 'Вкладки', 'Описание крупно', 'Плитки', 'Минимум']],
    ['ph', 'Телефон 3D', 'phone', ['', 'Прежний поворот (4-й круг)', 'Разворот со спины', 'Встаёт со стола', 'Облёт камерой', 'Из глубины', 'Въезд ребром', 'Снизу в кадр', 'Полтора оборота', 'Три четверти', 'Опускается сверху', 'Крупный план и отъезд']],
  ];
  const V = {};
  G.forEach(([k, , , o]) => { const v = ls.get('v16-' + k); V[k] = v !== null && /^\d+$/.test(v) && +v > 0 && +v < o.length ? +v : 1; });
  const apply = k => {
    body.className = body.className.replace(new RegExp(`\\b${k}16-\\d+\\b`, 'g'), '').trim() + ` ${k}16-${V[k]}`;
    if (k === 'mi') renderInfo();
    if (k === 'ph' && stage && $('.dm-phw', stage)) mountPhone();
  };
  G.forEach(([k]) => apply(k));
  new MutationObserver(label).observe(st, { childList: true, subtree: true });

  if (!pan) return;
  const openWork = phone => { const c = $('.xw6-c', st) || $('#raboty .wk'); if (!c) return; if (!dm.hidden) { const b = phone && $('.dm-sw button[data-v="ph"]'); if (b) b.click(); return; } c.click(); if (phone) setTimeout(() => { const b = $('.dm-sw button[data-v="ph"]'); if (b) b.click(); }, 80); };
  $('.p11-f', pan).insertAdjacentHTML('beforebegin', G.map(([k, n, g, o]) => `<div class="p11-g p15"><p class="p11-h"><button type="button" class="p12-go" data-go15="${g}">${n}${g === 'top' ? ' ↓' : ': открыть ↗'}</button><b data-n15="${k}">${V[k]}. ${o[V[k]]}</b></p><div class="p11-r" data-k15="${k}">${o.slice(1).map((t, i) => `<button type="button" data-n="${i + 1}" aria-pressed="${V[k] === i + 1}" title="${i + 1}. ${esc(t)}">${i + 1}</button>`).join('')}</div></div>`).join(''));
  $$('[data-go15]', pan).forEach(b => b.addEventListener('click', () => { const g = b.dataset.go15; if (g === 'top') scrollTo({ top: 0, behavior: 'smooth' }); else openWork(g === 'phone'); }));
  $$('.p11-r[data-k15]', pan).forEach(g => g.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const k = g.dataset.k15; V[k] = +b.dataset.n; ls.set('v16-' + k, V[k]);
    $$('button', g).forEach(x => x.setAttribute('aria-pressed', x === b));
    $(`[data-n15="${k}"]`, pan).textContent = `${V[k]}. ${G.find(x => x[0] === k)[3][V[k]]}`;
    apply(k);
  }));
  // «Скопировать выбор» из site13 собирает все строки: подпись у новых кнопок без «: открыть ↗»
})();
