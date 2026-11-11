/* Панель управления LolliPolli (11.11), вариант 1 «Стекло». Движок и загрузка фото от панели Ивы.
   Вкладки: Афиши, Разделы, Фото, Отзывы, Тексты, Копии. Каждое сохранение сразу перерисовывает сайт. */
(function () {
  var I = window.LPI || {};
  var D = null, BK = [], tab = 'af', flt = 'all', W = null, isNew = false, dirty = false;
  var FP = null, RV = null;            // черновики фото и отзывов до «Сохранить»
  var pane = document.getElementById('pane');
  var TABS = [['af', 'Афиши', 'af'], ['sh', 'Разделы', 'sh'], ['ph', 'Фото', 'ph'], ['rv', 'Отзывы', 'rv'], ['tx', 'Тексты', 'tx'], ['bk', 'Копии', 'bk']];
  var SHN = { ng: 'Новогодние', s1: '2-5 лет', s2: '6-10 лет', s3: 'Шоу и мастер-классы', s4: 'Выпускные' };
  var SHFULL = { ng: 'Новогодние программы', s1: 'Первые праздники, 2-5 лет', s2: 'Большие приключения, 6-10 лет', s3: 'Шоу-программы и мастер-классы', s4: 'Выпускные' };
  var LAG = window.LP_LAG || 'на сайте уже видно';

  function $(s, r) { return (r || document).querySelector(s); }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function src(p) { return /^(blob:|https?:)/.test(p) ? p : (window.LP_BASE || '../') + p; }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  var tt;
  function say(t, err) {
    var el = $('#toast'); el.textContent = t; el.className = 'on' + (err ? ' err' : '');
    clearTimeout(tt); tt = setTimeout(function () { el.className = ''; }, err ? 7000 : 2400);
  }
  function api(action, body) {
    return fetch('api.php?do=' + action, {
      method: 'POST', credentials: 'same-origin', cache: 'no-store',
      headers: { 'Content-Type': 'application/json', 'X-CSRF': window.CSRF }, body: JSON.stringify(body || {})
    }).then(function (r) {
      if (r.status === 401) { location.reload(); throw new Error('вход'); }
      return r.json();
    }).then(function (r) {
      if (!r.ok) { say(r.error || 'Не сохранилось', true); throw new Error(r.error); }
      if (r.data) { D = r.data; }
      return r;
    }, function (e) { if (e.message !== 'вход') { say('Нет связи с сервером, правка не сохранилась', true); } throw e; });
  }
  function load() {
    return fetch('api.php?do=load', { credentials: 'same-origin', cache: 'no-store' }).then(function (r) {
      if (r.status === 401) { location.reload(); }
      return r.json();
    }).then(function (r) { D = r.data; BK = r.backups || []; });
  }
  function shelfOf(k) { for (var i = 0; i < D.SH.length; i++) { if (D.SH[i].k === k) { return D.SH[i]; } } return null; }
  function onShelf(k, all) {
    var o = (shelfOf(k) || {}).o || [];
    return D.A.filter(function (x) { return (all || !x.off) && x.sh.indexOf(k) >= 0; })
      .sort(function (a, b) { var i = o.indexOf(a.id), j = o.indexOf(b.id); return (i < 0 ? 9999 : i) - (j < 0 ? 9999 : j); });
  }

  /* ───── вкладки ───── */
  function navs() {
    $('#tabs').innerHTML = TABS.map(function (t) { return '<button class="tab' + (t[0] === tab ? ' on' : '') + '" data-tab="' + t[0] + '">' + (I[t[2]] || '') + t[1] + '</button>'; }).join('');
    $('#bnav').innerHTML = TABS.map(function (t) { return '<button class="' + (t[0] === tab ? 'on' : '') + '" data-tab="' + t[0] + '">' + (I[t[2]] || '') + t[1] + '</button>'; }).join('');
    $('#site').innerHTML = (I.site || '') + '&nbsp;Сайт';
  }
  function go(t) {
    if ((FP || RV) && !confirm('Есть несохранённые изменения. Уйти без сохранения?')) { return; }
    FP = null; RV = null; tab = t; navs(); draw(); scrollTo(0, 0);
  }
  document.addEventListener('click', function (e) { var b = e.target.closest('[data-tab]'); if (b) { go(b.dataset.tab); } });
  function draw() {
    ({ af: afishi, sh: shelves, ph: photos, rv: reviews, tx: texts, bk: copies })[tab]();
  }

  /* ───── Афиши ───── */
  function card(x, k, i, n) {
    var p = x.sh.indexOf('ng') >= 0 && x.sh.length === 1 ? '<span class="np">новогодняя</span>' : (x.p ? '<span>' + esc(x.p) + '</span>' : '<span class="np">цена не указана</span>');
    var mv = k ? '<div class="mv"><button data-mv="-1" data-id="' + esc(x.id) + '"' + (i === 0 ? ' disabled' : '') + ' aria-label="Левее">' + (I.l || '') + '</button><button data-mv="1" data-id="' + esc(x.id) + '"' + (i === n - 1 ? ' disabled' : '') + ' aria-label="Правее">' + (I.r || '') + '</button></div>' : '';
    return '<div class="cd gl' + (x.off ? ' off' : '') + '" data-ed="' + esc(x.id) + '"><img src="' + esc(src(x.img)) + '" alt="" loading="lazy">' +
      (x.off ? '<div class="bdg">' + (I.eyeoff || '') + 'скрыта</div>' : '') + mv + '<b>' + esc(x.n) + '</b>' + p + '</div>';
  }
  function afishi() {
    var list = flt === 'all' ? D.A.slice() : onShelf(flt, true);
    var chips = [['all', 'Все', D.A.length]].concat(D.SH.map(function (s) { return [s.k, SHN[s.k], onShelf(s.k, true).length]; }));
    pane.innerHTML = '<div class="ph"><div><h2>Афиши</h2><p>' + (flt === 'all' ? 'Нажмите на афишу, чтобы поменять цену, картинку или раздел' : 'Стрелками на афише меняется порядок на полке, как на сайте') + '</p></div>' +
      '<button class="bmain" id="newaf">' + (I.add || '') + 'Новая афиша</button></div>' +
      '<div class="chips" style="margin:0 4px 16px">' + chips.map(function (c) { return '<button class="chip' + (c[0] === flt ? ' on' : '') + '" data-flt="' + c[0] + '">' + c[1] + ' <i>' + c[2] + '</i></button>'; }).join('') + '</div>' +
      '<div class="grid">' + list.map(function (x, i) { return card(x, flt === 'all' ? null : flt, i, list.length); }).join('') +
      '<button class="add" id="newaf2">' + (I.add || '') + 'Добавить афишу</button></div>';
  }
  pane.addEventListener('click', function (e) {
    var b;
    if (tab !== 'af') { return; }
    if ((b = e.target.closest('[data-flt]'))) { flt = b.dataset.flt; afishi(); return; }
    if ((b = e.target.closest('[data-mv]'))) { e.stopPropagation(); move(b.dataset.id, +b.dataset.mv); return; }
    if (e.target.closest('#newaf, #newaf2')) { openEd(null); return; }
    if ((b = e.target.closest('[data-ed]'))) { openEd(b.dataset.ed); }
  });
  function move(id, d) {
    var ids = onShelf(flt, true).map(function (x) { return x.id; });
    var i = ids.indexOf(id), j = i + d;
    if (i < 0 || j < 0 || j >= ids.length) { return; }
    ids[i] = ids[j]; ids[j] = id;
    api('order', { k: flt, ids: ids }).then(function () { afishi(); say('Порядок сохранён, ' + LAG); }, function () {});
  }

  /* окно правки афиши */
  function openEd(id) {
    var x = null;
    D.A.forEach(function (a) { if (a.id === id) { x = a; } });
    isNew = !x; dirty = false;
    W = x ? clone(x) : { id: 'a' + Date.now().toString(36), img: '', n: '', p: '', sh: flt !== 'all' ? [flt] : [] };
    var dim = document.createElement('div');
    dim.className = 'dim'; dim.id = 'ed';
    dim.innerHTML = '<div class="modal gl"><div class="pic" id="pic"></div><div class="fm">' +
      '<button class="x" id="edx" aria-label="Закрыть">' + (I.x || '×') + '</button>' +
      '<h3>' + (isNew ? 'Новая афиша' : esc(W.n)) + '</h3>' +
      '<label class="lbl" for="fn">Название</label><input class="inp" id="fn" maxlength="90" value="' + esc(W.n) + '">' +
      '<div class="hint">Видно под афишей и в окне программы</div>' +
      '<label class="lbl" for="fp">Цена</label><input class="inp" id="fp" maxlength="40" value="' + esc(W.p || '') + '" placeholder="от 6 500 ₽">' +
      '<div class="hint">Пишите как на сайте: «от 6 500 ₽» или «750 ₽ за ребёнка». У новогодних цена не показывается</div>' +
      '<span class="lbl">Раздел</span><div class="chips" id="fsh">' + D.SH.map(function (s) { return '<button type="button" class="chip' + (W.sh.indexOf(s.k) >= 0 ? ' on' : '') + '" data-sh="' + s.k + '">' + SHN[s.k] + '</button>'; }).join('') + '</div>' +
      '<div class="hint">Можно выбрать два раздела, афиша встанет на обе полки</div>' +
      '<div class="shw" id="fof">Показывать на сайте<div class="sw' + (W.off ? '' : ' on') + '"></div></div>' +
      '<div class="act"><button class="bmain" id="fsave">' + (I.ok || '') + 'Сохранить</button>' + (isNew ? '' : '<button class="bdel" id="fdel" aria-label="Удалить">' + (I.del || '') + '</button>') + '</div>' +
      '</div></div>';
    document.body.appendChild(dim);
    document.body.style.overflow = 'hidden';
    pic();
    dim.addEventListener('click', edClick);
    dim.addEventListener('input', function () { dirty = true; });
  }
  function pic() {
    $('#pic').innerHTML = W.img
      ? '<img src="' + esc(src(W.img)) + '" alt=""><button class="cam gl" id="fcam">' + (I.ph || '') + 'Сменить афишу</button>'
      : '<button class="noimg" id="fcam">' + (I.ph || '') + 'Загрузить картинку афиши</button>';
  }
  function closeEd(force) {
    if (!force && dirty && !confirm('Изменения не сохранены. Закрыть?')) { return; }
    var e = $('#ed'); if (e) { e.remove(); }
    document.body.style.overflow = ''; W = null;
  }
  function edClick(e) {
    var t = e.target, b;
    if (t.id === 'ed' || t.closest('#edx')) { closeEd(); return; }
    if (t.closest('#fcam')) { pickFile(function (p) { W.img = p; dirty = true; pic(); }, 1600); return; }
    if ((b = t.closest('[data-sh]'))) {
      var k = b.dataset.sh, i = W.sh.indexOf(k);
      if (i >= 0) { W.sh.splice(i, 1); } else { W.sh.push(k); }
      b.classList.toggle('on', i < 0); dirty = true; return;
    }
    if (t.closest('#fof')) { W.off = W.off ? 0 : 1; $('#fof .sw').classList.toggle('on', !W.off); dirty = true; return; }
    if (t.closest('#fdel')) {
      if (!confirm('Удалить афишу «' + W.n + '» с сайта насовсем? Вернуть можно во вкладке «Копии».')) { return; }
      api('del', { id: W.id }).then(function () { closeEd(true); draw(); say('Афиша удалена'); }, function () {});
      return;
    }
    if (t.closest('#fsave')) { save(); }
  }
  function save() {
    W.n = $('#fn').value.trim(); W.p = $('#fp').value.trim();
    if (!W.img) { say('Загрузите картинку афиши', true); return; }
    if (!W.n) { $('#fn').classList.add('bad'); say('Напишите название программы', true); return; }
    if (!W.sh.length) { say('Выберите раздел', true); return; }
    var btn = $('#fsave'); btn.disabled = true;
    api('afisha', { item: W, new: isNew ? 1 : 0 }).then(function () {
      closeEd(true); draw(); say((isNew ? 'Афиша добавлена, ' : 'Сохранено, ') + LAG);
    }, function () { btn.disabled = false; });
  }

  /* ───── Разделы ───── */
  function shelves() {
    pane.innerHTML = '<div class="ph"><div><h2>Разделы</h2><p>Выключенный раздел пропадает с сайта вместе с пунктом меню. Афиши в нём сохраняются, раздел возвращается одним касанием</p></div></div>' +
      '<div class="rows">' + D.SH.map(function (s) {
        var on = onShelf(s.k), th = on.slice(0, 3).map(function (x) { return '<img src="' + esc(src(x.img)) + '" alt="" loading="lazy">'; }).join('');
        return '<div class="row gl"><div class="th">' + th + '</div><div class="tx"><b>' + SHFULL[s.k] + '</b><small>' + on.length + ' ' + plural(on.length) + ' на сайте' +
          (s.k === 'ng' ? '. В январе выключите, к декабрю включите снова' : '') + '</small></div>' +
          '<div class="sv" data-shk="' + s.k + '">На сайте<div class="sw' + (s.off ? '' : ' on') + '"></div></div></div>';
      }).join('') + '</div>';
  }
  function plural(n) { var a = n % 10, b = n % 100; return a === 1 && b !== 11 ? 'афиша' : a >= 2 && a <= 4 && (b < 12 || b > 14) ? 'афиши' : 'афиш'; }
  pane.addEventListener('click', function (e) {
    if (tab !== 'sh') { return; }
    var b = e.target.closest('[data-shk]'); if (!b) { return; }
    var s = shelfOf(b.dataset.shk), off = s.off ? 0 : 1;
    api('shelf', { k: s.k, off: off }).then(function () { shelves(); say((off ? 'Раздел скрыт, ' : 'Раздел снова на сайте, ') + LAG); }, function () {});
  });

  /* ───── Фото с праздников ───── */
  function photos() {
    if (!FP) { FP = null; }
    var L = FP || D.F;
    pane.innerHTML = '<div class="ph"><div><h2>Фото с праздников</h2><p>Первые 6 видны сразу, остальные под кнопкой «Смотреть больше фотографий». Стрелками меняется порядок, «выше» и «ниже» двигают кадр</p></div>' +
      '<button class="bmain" id="fadd">' + (I.add || '') + 'Добавить фото</button></div>' +
      '<div class="fgrid">' + L.map(function (f, i) {
        return '<div class="fc gl"><img src="' + esc(src(f.img)) + '" alt="" loading="lazy" style="object-position:' + esc(f.pos) + '"><span class="n' + (i < 6 ? ' v' : '') + '">' + (i + 1) + (i < 6 ? ' на виду' : '') + '</span>' +
          '<div class="bar"><button data-fm="-1" data-i="' + i + '"' + (i === 0 ? ' disabled' : '') + ' aria-label="Раньше">' + (I.l || '') + '</button><button data-fm="1" data-i="' + i + '"' + (i === L.length - 1 ? ' disabled' : '') + ' aria-label="Позже">' + (I.r || '') + '</button>' +
          '<button data-fy="-10" data-i="' + i + '" aria-label="Кадр выше">' + (I.up || '') + '</button><button data-fy="10" data-i="' + i + '" aria-label="Кадр ниже">' + (I.dn || '') + '</button>' +
          '<button class="d" data-fd="' + i + '" aria-label="Убрать">' + (I.del || '') + '</button></div></div>';
      }).join('') + '</div>' + (FP ? bar('фото') : '');
  }
  function bar(what) { return '<div class="savebar">Есть изменения: ' + what + '<button class="bsec" id="undo">Отменить</button><button class="bmain" id="keep">Сохранить</button></div>'; }
  pane.addEventListener('click', function (e) {
    if (tab !== 'ph') { return; }
    var b, t = e.target;
    if (t.closest('#fadd')) { pickFile(function (p) { FP = FP || clone(D.F); FP.unshift({ img: p, alt: 'Фото с праздника LolliPolli', pos: 'center 40%' }); photos(); }, 1600, true); return; }
    if (t.closest('#undo')) { FP = null; photos(); return; }
    if (t.closest('#keep')) {
      api('photos', { list: FP }).then(function () { FP = null; photos(); say('Фото сохранены, ' + LAG); }, function () {}); return;
    }
    if ((b = t.closest('[data-fm]'))) { FP = FP || clone(D.F); var i = +b.dataset.i, j = i + (+b.dataset.fm); var x = FP[i]; FP[i] = FP[j]; FP[j] = x; photos(); return; }
    if ((b = t.closest('[data-fy]'))) {
      FP = FP || clone(D.F); var f = FP[+b.dataset.i], m = /(\d+)%/.exec(f.pos), v = Math.max(0, Math.min(100, (m ? +m[1] : 40) + (+b.dataset.fy)));
      f.pos = 'center ' + v + '%'; photos(); return;
    }
    if ((b = t.closest('[data-fd]'))) { FP = FP || clone(D.F); if (FP.length < 2) { say('Должно остаться хотя бы одно фото', true); return; } FP.splice(+b.dataset.fd, 1); photos(); }
  });

  /* ───── Отзывы ───── */
  var COLORS = ['var(--pink)', 'var(--yellow)', 'var(--sky)', '#C9B6FF'];
  function reviews() {
    var L = RV || D.R;
    pane.innerHTML = '<div class="ph"><div><h2>Отзывы</h2><p>Отзывы родителей на сайте по порядку. Новый абзац отделяйте пустой строкой</p></div>' +
      '<button class="bmain" id="radd">' + (I.add || '') + 'Добавить отзыв</button></div>' +
      '<div class="rvl">' + L.map(function (r, i) {
        return '<div class="rc gl"><div class="hd"><div><label class="lbl">Имя</label><input class="inp" data-rn="' + i + '" maxlength="60" value="' + esc(r.n) + '"></div>' +
          '<div><label class="lbl">Дата</label><input class="inp" data-rd="' + i + '" maxlength="30" value="' + esc(r.d) + '" placeholder="20 сентября 2026"></div>' +
          '<div class="ops"><button data-rm="-1" data-i="' + i + '" aria-label="Выше">' + (I.up || '') + '</button><button data-rm="1" data-i="' + i + '" aria-label="Ниже">' + (I.dn || '') + '</button><button class="d" data-rx="' + i + '" aria-label="Удалить">' + (I.del || '') + '</button></div></div>' +
          '<label class="lbl">Текст</label><textarea class="inp" data-rt="' + i + '" rows="4">' + esc(r.t.join('\n\n')) + '</textarea></div>';
      }).join('') + '</div>' + (RV ? bar('отзывы') : '');
  }
  function rvRead() {
    RV = RV || clone(D.R);
    pane.querySelectorAll('[data-rn]').forEach(function (el) { RV[+el.dataset.rn].n = el.value; });
    pane.querySelectorAll('[data-rd]').forEach(function (el) { RV[+el.dataset.rd].d = el.value; });
    pane.querySelectorAll('[data-rt]').forEach(function (el) { RV[+el.dataset.rt].t = el.value.split(/\n\s*\n/).map(function (s) { return s.trim(); }).filter(Boolean); });
  }
  pane.addEventListener('input', function (e) {
    if (tab === 'rv' && !RV) { rvRead(); var p = e.target, pos = p.selectionStart, k = p.dataset; reviews(); var q = pane.querySelector(Object.keys(k).map(function (a) { return '[data-' + a.replace(/[A-Z]/g, function (c) { return '-' + c.toLowerCase(); }) + '="' + k[a] + '"]'; }).join('')); if (q) { q.focus(); try { q.setSelectionRange(pos, pos); } catch (x) {} } }
  });
  pane.addEventListener('click', function (e) {
    if (tab !== 'rv') { return; }
    var b, t = e.target;
    if (t.closest('#radd')) { rvRead(); RV.unshift({ n: '', d: '', c: COLORS[RV.length % 4], t: [] }); reviews(); var f = pane.querySelector('[data-rn="0"]'); if (f) { f.focus(); } return; }
    if (t.closest('#undo')) { RV = null; reviews(); return; }
    if (t.closest('#keep')) {
      rvRead();
      api('reviews', { list: RV }).then(function () { RV = null; reviews(); say('Отзывы сохранены, ' + LAG); }, function () {}); return;
    }
    if ((b = t.closest('[data-rm]'))) { rvRead(); var i = +b.dataset.i, j = i + (+b.dataset.rm); if (j < 0 || j >= RV.length) { return; } var x = RV[i]; RV[i] = RV[j]; RV[j] = x; reviews(); return; }
    if ((b = t.closest('[data-rx]'))) { rvRead(); if (!confirm('Убрать отзыв «' + (RV[+b.dataset.rx].n || 'без имени') + '»?')) { return; } RV.splice(+b.dataset.rx, 1); reviews(); }
  });

  /* ───── Тексты и контакты ───── */
  var TX = [
    ['Контакты', [['phone', 'Телефон', 'Меняется везде: шапка, заявка, подвал, кнопка «Позвонить», политика'], ['tg', 'Telegram, ссылка', 'https://t.me/...'], ['tg_name', 'Telegram, как подписан', 'Например, @lollipolli_38'],
      ['max', 'MAX, ссылка', ''], ['vk', 'ВКонтакте, ссылка', ''], ['addr', 'Адрес', 'Город и адрес, как на сайте'], ['gis', 'Ссылка на отзывы в 2ГИС', 'Кнопка «Посмотреть все отзывы»']]],
    ['Тексты', [['bron', 'Строка про бронирование над программами', ''], ['ng_p', 'Подзаголовок новогодних программ', '']]]
  ];
  function texts() {
    pane.innerHTML = '<div class="ph"><div><h2>Тексты и контакты</h2><p>Меню, порядок блоков и оформление сайта через панель не меняются</p></div></div>' +
      TX.map(function (g, gi) {
        return '<div class="tbox gl" style="margin-bottom:14px"><h3>' + g[0] + '</h3>' + g[1].map(function (f) {
          return '<label class="lbl" for="t_' + f[0] + '">' + f[1] + '</label><input class="inp" id="t_' + f[0] + '" data-k="' + f[0] + '" value="' + esc(D.S[f[0]] || '') + '">' + (f[2] ? '<div class="hint">' + f[2] + '</div>' : '');
        }).join('') + '<div class="act"><button class="bmain" data-tg="' + gi + '">' + (I.ok || '') + 'Сохранить</button></div></div>';
      }).join('');
  }
  pane.addEventListener('click', function (e) {
    if (tab !== 'tx') { return; }
    var b = e.target.closest('[data-tg]'); if (!b) { return; }
    var set = {}, box = b.closest('.tbox');
    box.querySelectorAll('[data-k]').forEach(function (el) { el.classList.remove('bad'); if (el.value.trim() !== (D.S[el.dataset.k] || '')) { set[el.dataset.k] = el.value; } });
    if (!Object.keys(set).length) { say('Ничего не поменялось'); return; }
    b.disabled = true;
    fetch('api.php?do=texts', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', 'X-CSRF': window.CSRF }, body: JSON.stringify({ set: set }) })
      .then(function (r) { if (r.status === 401) { location.reload(); } return r.json(); })
      .then(function (r) {
        b.disabled = false;
        if (!r.ok) { var f = r.field && $('#t_' + r.field); if (f) { f.classList.add('bad'); f.focus(); } say(r.error || 'Не сохранилось', true); return; }
        D = r.data; texts(); say('Сохранено, ' + LAG);
      }, function () { b.disabled = false; say('Нет связи с сервером, не сохранилось', true); });
  });

  /* ───── Копии ───── */
  function copies() {
    load().then(function () {
      pane.innerHTML = '<div class="ph"><div><h2>Копии</h2><p>Перед каждым сохранением панель запоминает, как было. «Вернуть» ставит на сайт ту версию целиком</p></div></div>' +
        '<div class="rows">' + (BK.length ? BK.map(function (b) {
          return '<div class="bk gl"><b>' + esc(b.when) + '</b><small>' + esc(b.count) + '</small><button class="bsec" data-rs="' + esc(b.file) + '">Вернуть</button></div>';
        }).join('') : '<div class="empty gl">Копий пока нет: они появятся после первого сохранения</div>') + '</div>';
    });
  }
  pane.addEventListener('click', function (e) {
    if (tab !== 'bk') { return; }
    var b = e.target.closest('[data-rs]'); if (!b) { return; }
    if (!confirm('Вернуть сайт к версии от ' + b.parentNode.querySelector('b').textContent + '? Текущая версия тоже сохранится в копиях.')) { return; }
    api('restore', { file: b.dataset.rs }).then(function () { copies(); say('Версия возвращена, ' + LAG); }, function () {});
  });

  /* ───── фото с телефона: ужать в браузере, HEIC с айфона перевести в JPG, отправить ───── */
  var fileCb = null, fileMax = 1600;
  function pickFile(cb, max, multi) { fileCb = cb; fileMax = max || 1600; var f = $('#file'); f.multiple = !!multi; f.value = ''; f.click(); }
  $('#file').addEventListener('change', function () {
    var list = Array.prototype.slice.call(this.files || []), cb = fileCb, chain = Promise.resolve(), n = 0;
    if (!list.length || !cb) { return; }
    list.forEach(function (f, i) {
      chain = chain.then(function () {
        say('Загружаю фото ' + (i + 1) + ' из ' + list.length + '…');
        return shrink(f, fileMax);
      }).then(function (blob) {
        var fd = new FormData(); fd.append('photo', blob, 'photo.jpg'); fd.append('max', String(fileMax));
        return Promise.race([
          fetch('api.php?do=upload', { method: 'POST', body: fd, credentials: 'same-origin', headers: { 'X-CSRF': window.CSRF } }).then(function (r) { return r.json(); }),
          new Promise(function (ok, no) { setTimeout(no, 90000); })
        ]);
      }).then(function (r) {
        if (r && r.ok) { n++; cb(r.src); } else { say((r && r.error) || 'Фото не загрузилось', true); }
      }, function () { say('Фото не загрузилось, проверьте интернет', true); });
    });
    chain.then(function () { if (n) { say(n > 1 ? 'Загружено фото: ' + n + '. Не забудьте сохранить' : 'Фото загружено. Не забудьте сохранить'); } });
  });
  function shrink(file, max) {
    return new Promise(function (ok) {
      var im = new Image(), url = URL.createObjectURL(file);
      im.onload = function () {
        var k = Math.min(1, max / Math.max(im.width, im.height));
        var c = document.createElement('canvas'); c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        c.toBlob(function (b) { c.width = c.height = 0; ok(b || file); }, 'image/jpeg', 0.86);
      };
      im.onerror = function () {
        URL.revokeObjectURL(url);
        heic(file).then(function (j) { return j ? shrink(j, max) : file; }, function () { return file; }).then(ok);
      };
      im.src = url;
    });
  }
  var heicLib;
  function heic(file) {
    if (file.heicDone) { return Promise.resolve(null); }
    heicLib = heicLib || new Promise(function (ok, bad) {
      var s = document.createElement('script'); s.src = 'heic-to.js'; s.onload = ok;
      s.onerror = function () { heicLib = null; bad(); }; document.body.appendChild(s);
    });
    return heicLib.then(function () { return window.HeicTo.isHeic(file); }).then(function (yes) {
      if (!yes) { return null; }
      return window.HeicTo({ blob: file, type: 'image/jpeg', quality: 0.92 }).then(function (j) { j.heicDone = true; return j; });
    });
  }

  addEventListener('beforeunload', function (e) { if (FP || RV || (W && dirty)) { e.preventDefault(); e.returnValue = ''; } });
  addEventListener('keydown', function (e) { if (e.key === 'Escape' && W) { closeEd(); } });
  load().then(function () { navs(); draw(); });
})();
