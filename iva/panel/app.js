/* Панель управления Ивы.
   Данные лежат в ../data/catalog.js, их отдаёт и меняет api.php. Каждое действие
   сохраняется сразу и только своим букетом: сервер вносит правку в свежий файл,
   поэтому два телефона в двух салонах не затирают друг друга. */
(function () {
  'use strict';

  var D = { P: [], CAT: [], HOT: [] }, SAL = {}, BK = [], S = {}, ICN = {}, HOTW = null;
  var tab = 'today', vsal = 'm8', flt = 'all', q = '';
  var pane = document.getElementById('pane');
  var ST = ['in', 'zak', 'nk', 'na'];
  var STN = { in: 'В наличии', zak: 'Под заказ', nk: 'Соберём нужное количество', na: 'Уточнить у менеджера' };
  var STS = { in: 'В наличии', zak: 'Под заказ', nk: 'Соберём', na: 'Уточнить' };
  var STD = {
    in: 'Покупатель видит «В наличии» и кладёт букет в корзину',
    zak: 'На сайте «Под заказ»: цену и срок назовёт менеджер',
    nk: 'Для штучных цветов: соберём столько, сколько нужно',
    na: 'На сайте «Уточнить наличие у менеджера»'
  };
  var SC = { in: '#2F6B4A', zak: '#B83E70', nk: '#B07A1E', na: '#7A8683' };
  var AUTO = ['do3', '3do5', 'ot5'];   // разделы по цене сайт ставит сам
  var TABS = [['today', 'Сегодня', 'house'], ['buk', 'Букеты', 'flower-tulip'], ['cat', 'Разделы', 'squares-four'], ['txt', 'Тексты', 'text-aa'], ['copies', 'Копии', 'clock-counter-clockwise']];
  var TABK = TABS.map(function (t) { return t[0]; });
  /* группы плиток — те же, что в index.html (var GR) */
  var GR = [['Букеты', ['do3', '3do5', 'ot5', 'mono']], ['По поводу', ['nev', 'prazd', 'deti', 'svof']], ['Ещё в салонах', ['shar', 'korz', 'rast', 'shtuk', 'dop']]];
  /* Тексты сайта блоками, сверху вниз, как на странице. [ключ, подпись, где видно, тип] */
  var TXT = [
    { t: 'Контакты и время работы', a: 'kontakty', d: 'Телефон и часы меняются сразу во всех местах сайта: шапка, контакты, доставка, подвал, страница букета, корзина, кнопки «Позвонить» и «Написать в Telegram».', f: [
      ['phone', 'Телефон', 'Шапка, контакты, подвал, кнопки «Позвонить». На этот же номер ведут все кнопки «Написать в Telegram»'],
      ['h_m8', 'Время работы: 8 Марта, 101', 'Шапка, контакты, карта, доставка, подвал, страница букета, корзина'],
      ['h_kir', 'Время работы: Кировградская, 4/2', 'Контакты, карта, доставка, подвал, страница букета, корзина'],
      ['srv_m8', 'Что есть в салоне на 8 Марта', 'Контакты, карта, подвал'],
      ['srv_kir', 'Что есть в салоне на Кировградской', 'Контакты, карта, подвал'],
      ['tel_note', 'Подпись под телефоном', 'Блок «Контакты»'],
      ['chan', 'Ссылка на Telegram-канал', 'Значок в шапке, блок «Контакты», подвал'],
      ['chan_note', 'Подпись под каналом', 'Блок «Контакты»'],
      ['vk', 'Ссылка ВКонтакте', 'Значок в шапке, подвал'],
      ['kont_p', 'Подпись под заголовком «Контакты»', 'Блок «Контакты»', 'area'],
      ['kont_img', 'Фото салона', 'Блок «Контакты», слева', 'img']] },
    { t: 'Главный экран', a: 'top', d: 'Первое, что видит покупатель.', f: [
      ['hero_a', 'Заголовок', 'Крупно на фото'],
      ['hero_b', 'Вторая строка заголовка', 'Выделена цветом'],
      ['hero_lead', 'Текст под заголовком', 'Под заголовком', 'area'],
      ['hero_img', 'Фото главного экрана', 'Во весь экран за заголовком. Лучше горизонтальное', 'img'],
      ['search_ph', 'Подсказка в строке поиска', 'Серый текст в пустой строке поиска']] },
    { t: 'Онлайн-витрина', a: 'vitrina', d: 'Заголовок блока и условия каждого салона под переключателем.', f: [
      ['vit_a', 'Заголовок', ''], ['vit_b', 'Выделенная часть заголовка', 'Цветом'],
      ['vit_p', 'Текст под заголовком', '', 'area'],
      ['area_m8', 'Район салона на 8 Марта', 'Под переключателем салонов и на карте'],
      ['vit_m8_t', 'Условия витрины 8 Марта: коротко', 'Под переключателем и под букетами'],
      ['vit_m8_s', 'Условия витрины 8 Марта: подробно', 'Под букетами витрины', 'area'],
      ['area_kir', 'Район салона на Кировградской', 'Под переключателем салонов и на карте'],
      ['vit_kir_t', 'Условия витрины Кировградской: коротко', 'Под переключателем и под букетами'],
      ['vit_kir_s', 'Условия витрины Кировградской: подробно', 'Под букетами витрины и на странице букета', 'area'],
      ['vit_btn', 'Кнопка под витриной', 'Ведёт в Telegram']] },
    { t: 'Каталог', a: 'katalog', d: 'Заголовок над плитками разделов. Сами плитки — на вкладке «Разделы».', f: [
      ['kat_a', 'Заголовок', ''], ['kat_b', 'Выделенная часть заголовка', 'Цветом'], ['kat_p', 'Текст под заголовком', '', 'area']] },
    { t: 'Доставка и самовывоз', a: 'dostavka', d: 'Три карточки и блок «Не нашли нужный букет?». Время работы — в блоке «Контакты и время работы».', f: [
      ['dost_a', 'Заголовок', ''], ['dost_b', 'Выделенная часть заголовка', 'Цветом'], ['dost_p', 'Текст под заголовком', ''],
      ['d1_h', 'Карточка «Доставка»: заголовок', ''], ['d1_p', 'Карточка «Доставка»: текст', '', 'area'],
      ['d2_p', 'Карточка «8 Марта»: текст под часами', '', 'area'], ['d3_p', 'Карточка «Кировградская»: текст под часами', '', 'area'],
      ['dn_t', '«Не нашли нужный букет?»: заголовок', ''], ['dn_s', '«Не нашли нужный букет?»: текст', '', 'area'], ['dn_btn', '«Не нашли нужный букет?»: кнопка', 'Ведёт в Telegram'],
      ['deliv_line', 'Строка о доставке на странице букета', 'Страница букета, «Получение»']] },
    { t: 'Страница букета и корзина', a: 'katalog', d: 'Пояснения, которые видит покупатель на странице букета с такой отметкой, и подпись в корзине.', f: [
      ['b_zak', 'Для букетов «Под заказ»', '', 'area'], ['b_nk', 'Для «Соберём нужное количество»', '', 'area'],
      ['b_na', 'Для «Уточнить наличие у менеджера»', '', 'area'], ['b_o', 'Для оформления мероприятий', '', 'area'],
      ['b_order', 'Подсказка под кнопкой заказа', 'Страница букета', 'area'], ['cart_note', 'Подпись под кнопкой «Отправить заказ»', 'Корзина', 'area']] },
    { t: 'Подвал', a: 'kontakty', d: 'Самый низ страницы.', f: [
      ['foot_tag', 'Подпись под логотипом', ''], ['req', 'Реквизиты', 'Строка внизу: ИП, ИНН, ОГРНИП']] }
  ];

  /* ── помощники ── */
  function $(s, r) { return (r || document).querySelector(s); }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function I(n, c, s) {
    var i = window.ICONS[n]; if (!i) { return ''; }
    return '<svg class="ic" viewBox="0 0 ' + i.w + ' ' + i.h + '" width="' + (s || 20) + '" height="' + (s || 20) + '" style="color:' + (c || 'currentColor') + '">' + i.b + '</svg>';
  }
  /* на github.io фото, только что загруженное из панели, показываем до пересборки сайта (gh.js) */
  function src(p) { return window.IVA_SRC ? window.IVA_SRC(p) : '../' + p; }
  /* на github.io сайт пересобирается после сохранения, правка видна не сразу */
  var LAG = window.IVA_LAG ? 'сайт обновится через 1-2 минуты' : 'на сайте уже видно';
  function stOf(x) { return x.zak ? 'zak' : x.nk ? 'nk' : x.na ? 'na' : 'in'; }
  function price(x) { return x.p ? x.p.toLocaleString('ru-RU') + ' ₽' + (x.u ? ' / шт' : '') : ''; }
  function byId(id) { for (var i = 0; i < D.P.length; i++) { if (D.P[i].id === id) { return D.P[i]; } } return null; }
  function catName(k) { for (var i = 0; i < D.CAT.length; i++) { if (D.CAT[i].k === k) { return D.CAT[i].n; } } return k; }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function newId() { return 'u' + Date.now().toString(36); }
  var tt;
  function say(t, err) {
    var el = $('#toast'); el.textContent = t; el.className = 'show' + (err ? ' err' : '');
    clearTimeout(tt); tt = setTimeout(function () { el.className = ''; }, err ? 7000 : 2200);
  }
  function stChip(x, btn) {
    var k = stOf(x);
    if (x.off) { return '<' + (btn ? 'button data-st="' + x.id + '"' : 'span') + ' class="st off">Скрыт</' + (btn ? 'button' : 'span') + '>'; }
    return '<' + (btn ? 'button data-st="' + x.id + '"' : 'span') + ' class="st" style="--c:' + SC[k] + '">' + STS[k] + '</' + (btn ? 'button' : 'span') + '>';
  }

  /* ── сервер ── */
  function api(action, body) {
    return fetch('api.php?do=' + action, {
      method: 'POST', credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', 'X-CSRF': window.CSRF },
      body: JSON.stringify(body || {})
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
      if (r.status === 401) { location.reload(); throw new Error('вход'); }
      return r.json();
    }).then(function (r) { D = r.data; SAL = r.salons; BK = r.backups || []; S = r.site || {}; ICN = r.icons || {}; });
  }
  function quick(id, set, msg) {
    return api('quick', { id: id, set: set }).then(function () { draw(); say(msg || 'Сохранено, ' + LAG); }, function () { draw(); });   // не сохранилось — возвращаем переключатель как было
  }

  /* ── меню ── */
  function navs() {
    $('#tabs').innerHTML = TABS.map(function (t) {
      return '<a class="tb' + (tab === t[0] ? ' on' : '') + '" href="#' + t[0] + '">' + I('ph:' + t[2], null, 18) + t[1] + '</a>';
    }).join('');
    $('#bnav').innerHTML = TABS.map(function (t) {
      return '<button class="' + (tab === t[0] ? 'on' : '') + '" data-go="' + t[0] + '">' + I('ph:' + t[2] + (tab === t[0] && window.ICONS['ph:' + t[2] + '-fill'] ? '-fill' : ''), null, 24) + t[1] + '</button>';
    }).join('');
  }

  /* ── карточка букета ── */
  function card(x, opt) {
    opt = opt || {};
    var ph = x.ph && x.ph.length
      ? '<img src="' + esc(src(x.ph[0])) + '" alt="" loading="lazy">'
      : '<span class="noph">' + I('ph:camera', '#6F6669', 28) + 'Нет фото</span>';
    var sal = !opt.vit && x.s ? '<span class="salon">Витрина ' + esc(SAL[x.s] ? SAL[x.s].split(',')[0] : '') + '</span>' : '';
    var nph = x.ph && x.ph.length > 1 ? '<span class="nph">' + x.ph.length + ' фото</span>' : '';
    var pr = x.p ? '<span class="pr">' + price(x) + '</span>' : '<span class="pr ask">цена у менеджера</span>';
    var bottom = opt.vit
      ? '<div class="r">' + pr + '</div><div class="onv">' + (x.off ? 'Продан, скрыт' : 'На витрине') + '<button class="tgl' + (x.off ? '' : ' on') + '" data-vit="' + x.id + '" aria-label="На витрине"></button></div>'
      : '<div class="r">' + pr + stChip(x, true) + '</div>';
    return '<article class="cd gl' + (x.off ? (opt.vit ? ' sold' : ' hid') : '') + '"><div class="ph" data-ed="' + x.id + '">' + ph + sal + nph + '</div>' +
      '<b data-ed="' + x.id + '">' + esc(x.n) + '</b>' + bottom + '</article>';
  }

  /* ── экран «Сегодня» ── */
  function today() {
    var d = new Date();
    var days = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
    var mons = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    var cnt = function (s) { return D.P.filter(function (x) { return x.s === s && !x.off; }).length; };
    var noph = D.P.filter(function (x) { return !x.off && !(x.ph && x.ph.length); }).length;
    var hid = D.P.filter(function (x) { return x.off; }).length;
    var pic = { m8: '../hero.jpg', kir: '../img/b/1598_0.jpg' };
    var sal = Object.keys(SAL).map(function (k) {
      return '<button class="sc' + (vsal === k ? ' on' : '') + '" data-sal="' + k + '"><img src="' + pic[k] + '" alt=""><div class="tx"><small>Салон</small><b>' + esc(SAL[k]) + '</b>' +
        '<div class="nums"><span>' + cnt(k) + ' на витрине</span><span>' + (k === 'm8' ? 'доставка и самовывоз' : 'только самовывоз') + '</span></div></div></button>';
    }).join('');
    var att = [];
    if (noph) { att.push('<button data-flt="noph">' + I('ph:image-broken', '#B83E70') + 'Букеты без фото<em>' + noph + '</em></button>'); }
    if (hid) { att.push('<button data-flt="off">' + I('ph:eye-slash', '#B83E70') + 'Скрыты с сайта<em>' + hid + '</em></button>'); }
    var vit = D.P.filter(function (x) { return x.s === vsal; });
    pane.innerHTML =
      '<div class="hd"><div><h1>Сегодня, ' + days[d.getDay()] + ' ' + d.getDate() + ' ' + mons[d.getMonth()] + '</h1><p>Что стоит на витринах салонов и что требует внимания</p></div></div>' +
      '<div class="sal">' + sal + '<div class="att gl"><h3>Требует внимания</h3>' + (att.join('') || '<p class="ok">Всё в порядке: у всех букетов есть фото, скрытых нет.</p>') + '</div></div>' +
      '<div class="vh"><h2>Витрина</h2><div class="seg2">' + Object.keys(SAL).map(function (k) { return '<button class="' + (vsal === k ? 'on' : '') + '" data-sal="' + k + '">' + esc(SAL[k]) + '</button>'; }).join('') + '</div>' +
      '<p class="hint" style="margin:0">Букет продали: выключите переключатель, и он пропадёт с сайта. Собрали новый: «Поставить на витрину».</p></div>' +
      '<div class="grid vit">' + vit.map(function (x) { return card(x, { vit: 1 }); }).join('') +
      '<button class="addv" data-new="' + vsal + '">' + I('ph:camera', '#B83E70', 34) + 'Поставить на витрину<br>новый букет</button></div>';
  }

  /* ── экран «Букеты» ── */
  var FLT = [['all', 'Все'], ['m8', 'Витрина 8 Марта'], ['kir', 'Витрина Кировградская'], ['kat', 'Каталог'], ['zak', 'Под заказ'], ['nk', 'Соберём'], ['na', 'Уточнить'], ['noph', 'Без фото'], ['nopr', 'Без цены'], ['off', 'Скрытые']];
  function fit(x, f) {
    switch (f) {
      case 'm8': case 'kir': return x.s === f;
      case 'kat': return !x.s;
      case 'zak': case 'nk': case 'na': return !!x[f];
      case 'noph': return !(x.ph && x.ph.length);
      case 'nopr': return !x.p && !x.zak && !x.nk;
      case 'off': return !!x.off;
      default: return true;
    }
  }
  function match(x) {
    if (!q) { return true; }
    var t = (x.n + ' ' + (x.sv || []).join(' ') + ' ' + (x.c || []).map(catName).join(' ')).toLowerCase();
    return q.toLowerCase().split(/\s+/).every(function (w) { return t.indexOf(w) >= 0; });
  }
  function buk() {
    var list = D.P.filter(function (x) { return fit(x, flt) && match(x); });
    pane.innerHTML =
      '<div class="hd"><div><h1>Букеты</h1><p>' + D.P.length + ' в каталоге. Нажмите на отметку наличия, чтобы сменить её, на фото — чтобы открыть букет.</p></div></div>' +
      '<div class="chips">' + FLT.map(function (f) {
        var n = D.P.filter(function (x) { return fit(x, f[0]); }).length;
        return '<button class="chip' + (flt === f[0] ? ' on' : '') + '" data-flt="' + f[0] + '">' + f[1] + ' <em>' + n + '</em></button>';
      }).join('') + '</div>' +
      (q ? '<p class="hint" style="margin:0 4px 12px">Поиск: «' + esc(q) + '», найдено ' + list.length + '</p>' : '') +
      (list.length ? '<div class="grid">' + list.map(function (x) { return card(x); }).join('') + '</div>' : '<div class="empty gl">Ничего не нашлось</div>') +
      '<button class="btn acc fab" data-new="">' + I('ph:plus-bold', '#fff', 18) + 'Добавить букет</button>';
  }

  /* ── экран «Разделы»: плитки как на сайте + «Часто ищут» ── */
  function tile(c) {
    return '<div class="kc"><b>' + esc(c.n) + '</b><span class="kb"><span style="--m:' + esc(ICN[c.k] || 'none') + '"></span></span></div>';
  }
  function cats() {
    if (!HOTW) { HOTW = clone(D.HOT || []); }
    var byK = {}; D.CAT.forEach(function (c) { byK[c.k] = c; });
    pane.innerHTML = '<div class="hd"><div><h1>Разделы каталога</h1><p>Плитки разделов в блоке «Каталог» на сайте. Меняются название на плитке и заголовок над букетами раздела. Значки и набор разделов задаёт дизайн сайта, новые добавляет разработчик.</p></div>' +
      '<div class="r"><a class="btn lite sm" href="../#katalog" target="_blank" rel="noopener">' + I('ph:arrow-square-out', null, 16) + 'Посмотреть на сайте</a></div></div>' +
      GR.map(function (g) {
        return '<h3 class="grl">' + g[0] + '</h3><div class="tilegrid">' + g[1].map(function (k) {
          var c = byK[k]; if (!c) { return ''; }
          var n = D.P.filter(function (x) { return !x.off && (x.c || []).indexOf(k) >= 0; }).length;
          var auto = AUTO.indexOf(k) >= 0;
          return '<div class="trow gl" data-k="' + k + '">' + tile(c) +
            '<div class="tf"><label><span>Название на плитке</span><input class="in" data-n value="' + esc(c.n) + '" maxlength="80"></label>' +
            '<label><span>Заголовок над букетами, когда раздел открыт</span><input class="in" data-t value="' + esc(c.t || '') + '" placeholder="' + esc(c.n) + '" maxlength="160"></label>' +
            '<p class="hint">' + (auto ? 'Букеты попадают сюда сами по цене.' : 'Отмечено букетов: ' + n + '. Отмечают в карточке букета.') + '</p>' +
            '<button class="btn sm" data-savecat="' + k + '">Сохранить</button></div></div>';
        }).join('') + '</div>';
      }).join('') +
      '<div class="hd" style="margin-top:34px"><div><h2>Часто ищут</h2><p>Подсказки с фото, которые выпадают в поиске сайта, пока покупатель ещё ничего не ввёл. Нажатие ищет по слову из поля «Что искать».</p></div></div>' +
      '<div class="hotprev gl"><span class="lbl">Как видит покупатель</span><div class="hchips">' + HOTW.map(function (h) { return '<span class="hc">' + (h.img ? '<img src="' + esc(src(h.img)) + '" alt="">' : '') + esc(h.l) + '</span>'; }).join('') + '</div></div>' +
      '<div class="rows">' + HOTW.map(function (h, i) {
        return '<div class="hrow gl" data-i="' + i + '"><img src="' + (h.img ? esc(src(h.img)) : '../favicon.png') + '" alt="" data-hpick="' + i + '" title="Сменить фото">' +
          '<label><span>Подпись</span><input class="in" data-hl value="' + esc(h.l) + '" maxlength="30"></label>' +
          '<label><span>Что искать</span><input class="in" data-hq value="' + esc(h.q) + '" maxlength="40"></label>' +
          '<div class="hb"><button class="xb" data-hup="' + i + '" aria-label="Выше"' + (i ? '' : ' disabled') + '>' + I('ph:arrow-up', '#2F4A3E', 16) + '</button>' +
          '<button class="xb" data-hdn="' + i + '" aria-label="Ниже"' + (i < HOTW.length - 1 ? '' : ' disabled') + '>' + I('ph:arrow-down', '#2F4A3E', 16) + '</button>' +
          '<button class="xb" data-hdel="' + i + '" aria-label="Убрать">' + I('ph:trash', '#B83E70', 16) + '</button></div></div>';
      }).join('') + '</div>' +
      '<div class="hd" style="margin-top:12px"><div class="r" style="margin-left:0">' + (HOTW.length < 12 ? '<button class="btn lite" data-hadd>' + I('ph:plus-bold', '#2F4A3E', 16) + 'Добавить подсказку</button>' : '') +
      '<button class="btn" data-hsave>' + I('ph:check-bold', '#fff', 16) + 'Сохранить подсказки</button></div></div>';
  }
  function hotRead() {
    pane.querySelectorAll('.hrow').forEach(function (r) {
      var h = HOTW[+r.dataset.i]; if (!h) { return; }
      h.l = r.querySelector('[data-hl]').value; h.q = r.querySelector('[data-hq]').value;
    });
  }
  function pickPhoto(title, done) {
    var all = [];
    D.P.forEach(function (x) { (x.ph || []).forEach(function (p) { if (all.indexOf(p) < 0) { all.push(p); } }); });
    var sh = document.createElement('div'); sh.className = 'sh';
    sh.innerHTML = '<div class="shb gl" style="width:min(720px,100%)"><i class="grab"></i><div class="shh"><div><b>' + esc(title) + '</b><span>Выберите из фото букетов</span></div></div><div class="pick">' +
      all.map(function (p) { return '<img src="' + esc(src(p)) + '" data-p="' + esc(p) + '" loading="lazy" alt="">'; }).join('') + '</div></div>';
    sh.addEventListener('click', function (e) {
      var im = e.target.closest('img[data-p]');
      if (im) { sh.remove(); done(im.dataset.p); } else if (e.target === sh) { sh.remove(); }
    });
    document.body.appendChild(sh);
  }

  /* ── экран «Тексты и контакты» ── */
  function txt() {
    pane.innerHTML = '<div class="hd"><div><h1>Тексты и контакты</h1><p>Все тексты сайта по блокам, сверху вниз, как на странице. Поменяли блок — нажмите «Сохранить блок», ' + (window.IVA_LAG ? 'сайт обновится через 1-2 минуты' : 'на сайте видно сразу') + '. Меню, порядок блоков и оформление по договору меняет разработчик.</p></div></div>' +
      TXT.map(function (g, gi) {
        return '<section class="tgrp gl" data-g="' + gi + '"><div class="tgh"><div><h2>' + g.t + '</h2><p>' + g.d + '</p></div>' +
          '<a class="btn lite sm" href="../#' + g.a + '" target="_blank" rel="noopener">' + I('ph:arrow-square-out', null, 16) + 'На сайте</a></div><div class="tff">' +
          g.f.map(function (f) {
            var k = f[0], tp = f[3] || 'text', v = S[k] == null ? '' : S[k];
            if (tp === 'img') {
              return '<div class="tfi wide"><span>' + f[1] + '</span><div class="phf"><img src="' + esc(src(v)) + '" alt="" data-imgk="' + k + '"><div><label class="btn lite sm">' + I('ph:camera', '#2F4A3E', 16) + 'Заменить фото<input type="file" accept="image/*" hidden data-upk="' + k + '"></label>' +
                '<p class="hint">' + f[2] + '</p></div></div><input type="hidden" data-k="' + k + '" value="' + esc(v) + '"></div>';
            }
            return '<label class="tfi' + (tp === 'area' ? ' wide' : '') + '"><span>' + f[1] + '</span>' +
              (tp === 'area' ? '<textarea class="in" rows="2" data-k="' + k + '">' + esc(v) + '</textarea>' : '<input class="in" data-k="' + k + '" value="' + esc(v) + '"' + (k === 'phone' ? ' inputmode="tel"' : '') + '>') +
              (f[2] ? '<em class="hint">' + f[2] + '</em>' : '') + '</label>';
          }).join('') + '</div><div class="tga"><button class="btn" data-tsave="' + gi + '" disabled>' + I('ph:check-bold', '#fff', 16) + 'Сохранить блок</button><span class="hint" data-tst="' + gi + '"></span></div></section>';
      }).join('');
  }
  function tsave(gi) {
    var sec = $('.tgrp[data-g="' + gi + '"]'), set = {}, n = 0;
    sec.querySelectorAll('[data-k]').forEach(function (el) {
      if (String(S[el.dataset.k] == null ? '' : S[el.dataset.k]) !== el.value) { set[el.dataset.k] = el.value; n++; }
    });
    if (!n) { say('В этом блоке ничего не поменялось'); return; }
    var b = sec.querySelector('[data-tsave]'); b.disabled = true;
    sec.querySelectorAll('.bad').forEach(function (x) { x.classList.remove('bad'); });
    fetch('api.php?do=site', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', 'X-CSRF': window.CSRF }, body: JSON.stringify({ set: set }) })
      .then(function (r) { if (r.status === 401) { location.reload(); } return r.json(); })
      .then(function (r) {
        if (!r.ok) {
          b.disabled = false; say(r.error, true);
          var el = r.field && sec.querySelector('[data-k="' + r.field + '"]'); if (el) { el.closest('.tfi').classList.add('bad'); el.focus(); }
          return;
        }
        S = r.site;
        sec.querySelectorAll('[data-k]').forEach(function (el) { if (S[el.dataset.k] != null && el.type !== 'hidden') { el.value = S[el.dataset.k]; } });
        sec.querySelector('[data-tst="' + gi + '"]').textContent = 'Сохранено в ' + r.when;
        say('Блок сохранён, ' + LAG);
      }, function () { b.disabled = false; say('Нет связи с сервером, блок не сохранился', true); });
  }

  /* ── экран «Копии» ── */
  function copies() {
    pane.innerHTML = '<div class="hd"><div><h1>Копии и откат</h1><p>Перед каждой правкой панель сохраняет прошлую версию каталога. Если что-то пошло не так, верните нужную.</p></div><div class="r"><button class="btn lite sm" data-reload>' + I('ph:arrow-counter-clockwise', null, 16) + 'Обновить список</button></div></div>' +
      (BK.length ? '<div class="rows">' + BK.map(function (b) {
        return '<div class="cp gl">' + I(b.file.indexOf('site_') === 0 ? 'ph:text-aa' : 'ph:flower-tulip', '#2F4A3E', 22) + '<div><b>' + esc(b.when) + '</b><br><span>' + esc(b.what) + (b.count ? ', ' + esc(b.count) : '') + '</span></div><button class="btn lite sm" data-restore="' + esc(b.file) + '">Вернуть эту версию</button></div>';
      }).join('') + '</div>' : '<div class="empty gl">Копий пока нет: они появятся после первой правки.</div>');
  }

  function draw() {
    navs();
    ({ today: today, buk: buk, cat: cats, txt: txt, copies: copies })[tab]();
  }

  /* ── шторка наличия ── */
  function stSheet(id) {
    var x = byId(id); if (!x) { return; }
    var k = stOf(x);
    var sh = document.createElement('div'); sh.className = 'sh';
    sh.innerHTML = '<div class="shb gl"><i class="grab"></i><div class="shh">' + (x.ph && x.ph[0] ? '<img src="' + esc(src(x.ph[0])) + '" alt="">' : '') +
      '<div><b>' + esc(x.n) + '</b><span>' + (price(x) || 'цена у менеджера') + '</span></div></div>' +
      ST.map(function (s) {
        return '<button class="opt' + (!x.off && s === k ? ' on' : '') + '" style="--c:' + SC[s] + '" data-set="' + s + '"><i class="dot"></i><div><b>' + STN[s] + '</b><span>' + STD[s] + '</span></div>' +
          (!x.off && s === k ? I('ph:check-circle-fill', SC[s], 26) : '') + '</button>';
      }).join('') +
      '<button class="opt hide' + (x.off ? ' on' : '') + '" style="--c:#7A8683" data-set="off"><i class="dot"></i><div><b>' + (x.off ? 'Вернуть на сайт' : 'Скрыть с сайта') + '</b><span>' + (x.off ? 'Сейчас букет на сайте не виден' : 'Букет пропадёт из каталога, но не удалится') + '</span></div>' + I(x.off ? 'ph:eye' : 'ph:eye-slash', '#7A8683', 22) + '</button></div>';
    sh.addEventListener('click', function (e) {
      var b = e.target.closest('[data-set]');
      if (b) {
        var v = b.dataset.set, set = v === 'off' ? { off: !x.off } : { st: v, off: false };
        sh.remove();
        quick(id, set, v === 'off' ? (x.off ? 'Букет снова на сайте' : 'Букет скрыт с сайта') : 'Теперь «' + STN[v] + '»');
      } else if (e.target === sh) { sh.remove(); }
    });
    document.body.appendChild(sh);
  }

  /* ── окно правки букета ── */
  var W = null, dirty = false, cur = 0;
  function allSv() {
    var m = {};
    D.P.forEach(function (x) { (x.sv || []).forEach(function (v) { m[v] = (m[v] || 0) + 1; }); });
    return Object.keys(m).sort(function (a, b) { return m[b] - m[a]; });
  }
  function editor(id, preset) {
    var isNew = !id;
    if (isNew) {
      W = { id: newId(), n: '', p: null, ph: [], sv: [], c: [] };
      if (preset) { W.s = preset; }
    } else { W = clone(byId(id)); if (!W) { return; } }
    W._st = stOf(W); W._new = isNew; dirty = false; cur = 0;
    var ov = document.createElement('div'); ov.className = 'ov'; ov.id = 'ov';
    document.body.appendChild(ov); document.body.style.overflow = 'hidden';
    drawEd();
    ov.addEventListener('click', edClick);
    ov.addEventListener('input', edInput);
    ov.addEventListener('change', edInput);
    ov.addEventListener('keydown', function (e) {
      if (e.target.id === 'svin' && (e.key === 'Enter' || e.key === ',')) { e.preventDefault(); addSv(e.target.value); }
      if (e.target.id === 'svin' && e.key === 'Backspace' && !e.target.value && W.sv.length) { W.sv.pop(); dirty = true; drawTags(); }
    });
    ov.addEventListener('pointerdown', dragStart);
  }
  function closeEd(force) {
    if (!force && dirty && !confirm('Изменения не сохранены. Закрыть без сохранения?')) { return; }
    var ov = $('#ov'); if (ov) { ov.remove(); }
    document.body.style.overflow = ''; W = null;
  }
  function thumbs() {
    return W.ph.map(function (p, i) {
      return '<div class="th' + (i ? '' : ' first') + (i === cur ? ' sel' : '') + '" data-i="' + i + '"><img src="' + esc(src(p)) + '" alt=""><button class="rm" data-rmph="' + i + '" aria-label="Убрать фото">' + I('ph:x-bold', '#3B3437', 12) + '</button></div>';
    }).join('') + '<label class="th add">' + I('ph:camera', '#B83E70', 24) + 'Снять<br>или выбрать<input type="file" accept="image/*" multiple hidden id="phin"></label>';
  }
  function drawTags() {
    $('#tags').innerHTML = W.sv.map(function (t, i) { return '<span class="tg">' + esc(t) + '<button data-rmsv="' + i + '" aria-label="Убрать">' + I('ph:x', '#6F6669', 12) + '</button></span>'; }).join('') +
      '<input id="svin" list="svl" placeholder="' + (W.sv.length ? 'ещё цветок' : 'роза, гортензия…') + '" autocomplete="off">';
    var hints = allSv().filter(function (v) { return W.sv.indexOf(v) < 0; }).slice(0, 6);
    $('#svh').innerHTML = (hints.length ? 'Частые: ' + hints.map(function (v) { return '<u data-addsv="' + esc(v) + '">' + esc(v) + '</u>'; }).join(' · ') + '. ' : '') + 'По составу покупатели ищут букет на сайте.';
  }
  function drawPh() {
    var m = $('#phmain');
    m.innerHTML = W.ph.length ? '<img src="' + esc(src(W.ph[Math.min(cur, W.ph.length - 1)])) + '" alt="">' : '<div class="noph">' + I('ph:images', '#6F6669', 44) + 'Добавьте фото букета.<br>Лучше 2–3 ракурса.</div>';
    $('#thumbs').innerHTML = thumbs();
  }
  function drawEd() {
    var ov = $('#ov');
    var where = [['', 'Каталог'], ['m8', 'Витрина 8 Марта'], ['kir', 'Витрина Кировградская']];
    ov.innerHTML = '<div class="mod gl">' +
      '<div class="mh"><h3>' + (W._new ? 'Новый букет' : esc(W.n)) + '</h3><button class="xb" data-close aria-label="Закрыть">' + I('ph:x', '#2F4A3E', 18) + '</button></div>' +
      '<div class="big"><div class="main" id="phmain"></div><div class="thumbs" id="thumbs"></div></div>' +
      '<div class="form">' +
      '<div class="f"><h4>Название</h4><input class="in" data-k="n" value="' + esc(W.n) + '" placeholder="Например: Букет с подсолнухами" maxlength="120"><p class="hint">Видно в каталоге, на странице букета и в корзине</p></div>' +
      '<div class="f half"><h4>Цена</h4><div class="pw"><input class="in" data-k="p" inputmode="numeric" value="' + (W.p || '') + '" placeholder="пусто = назовёт менеджер"><span>₽</span></div>' +
      '<label class="ck"><input type="checkbox" data-k="u"' + (W.u ? ' checked' : '') + '> цена за штуку</label></div>' +
      '<div class="f half"><h4>Сколько штук в наличии</h4><input class="in" data-k="st" inputmode="numeric" value="' + (W.st || '') + '" placeholder="необязательно"><p class="hint">Для штучных цветов: сайт не даст заказать больше</p></div>' +
      '<div class="f"><h4>Где букет</h4><div class="seg three">' + where.map(function (w) { return '<button class="sg' + ((W.s || '') === w[0] ? ' on' : '') + '" data-where="' + w[0] + '">' + w[1] + '</button>'; }).join('') + '</div>' +
      '<p class="hint">Витрина: букет уже собран и стоит в салоне, после продажи его выключают. Каталог: собираем на заказ.</p></div>' +
      '<div class="f"><h4>Наличие</h4><div class="seg">' + ST.map(function (s) { return '<button class="sg' + (W._st === s ? ' on' : '') + '" style="--c:' + SC[s] + '" data-stv="' + s + '">' + STS[s] + '</button>'; }).join('') + '</div><p class="hint" id="sth">' + STD[W._st] + '</p></div>' +
      '<div class="f"><h4>Состав</h4><div class="tags" id="tags"></div><datalist id="svl">' + allSv().map(function (v) { return '<option value="' + esc(v) + '">'; }).join('') + '</datalist><p class="hint" id="svh"></p></div>' +
      '<div class="f"><h4>Разделы каталога</h4><div class="cats">' + D.CAT.map(function (c) { return '<button class="sg' + ((W.c || []).indexOf(c.k) >= 0 ? ' on' : '') + '" data-cat="' + c.k + '">' + esc(c.n) + '</button>'; }).join('') + '</div>' +
      '<p class="hint">Разделы по цене (до 3000, 3000–5000, от 5000) сайт ставит сам по цене. Отмечайте их, только если цены нет.</p></div>' +
      '<div class="f"><h4>Описание</h4><textarea class="in" data-k="ds" rows="3" maxlength="600" placeholder="Необязательно: размер, упаковка, к какому поводу">' + esc(W.ds || '') + '</textarea></div>' +
      '<div class="f"><label class="ck"><input type="checkbox" data-k="off"' + (W.off ? ' checked' : '') + '> Скрыть с сайта (букет останется в панели)</label><br>' +
      '<label class="ck"><input type="checkbox" data-k="dop"' + (W.dop ? ' checked' : '') + '> Это подарок к букету: ваза, открытка, игрушка</label></div>' +
      '</div>' +
      '<div class="acts"><button class="btn" data-save>' + I('ph:check-bold', '#fff', 18) + 'Сохранить</button>' +
      (W._new ? '' : '<button class="btn lite" data-dup>' + I('ph:copy', '#2F4A3E', 18) + 'Дублировать</button><button class="btn lite del" data-del aria-label="Удалить">' + I('ph:trash', '#B83E70', 20) + '</button>') + '</div></div>';
    drawPh(); drawTags();
  }
  function addSv(v) {
    String(v || '').split(',').forEach(function (t) {
      t = t.trim().toLowerCase();
      if (t && W.sv.indexOf(t) < 0) { W.sv.push(t); dirty = true; }
    });
    drawTags(); var i = $('#svin'); if (i) { i.focus(); }
  }
  function edInput(e) {
    var t = e.target, k = t.dataset.k;
    if (t.id === 'phin' && e.type === 'change') { upload(t.files); t.value = ''; return; }
    if (t.id === 'svin') {
      if (e.type === 'change' && t.value) { addSv(t.value); }   // выбор из подсказки
      return;
    }
    if (!k) { return; }
    dirty = true;
    if (k === 'n') { W.n = t.value; }
    else if (k === 'p') { t.value = t.value.replace(/\D/g, ''); W.p = t.value ? +t.value : null; }
    else if (k === 'st') { t.value = t.value.replace(/\D/g, ''); W.st = t.value ? +t.value : 0; }
    else if (k === 'ds') { W.ds = t.value; }
    else if (k === 'u') { if (t.checked) { W.u = 'шт'; } else { delete W.u; } }
    else if (k === 'off' || k === 'dop') { if (t.checked) { W[k] = 1; } else { delete W[k]; } }
  }
  function edClick(e) {
    var t = e.target, b;
    if (t.id === 'ov') { closeEd(); return; }
    if (t.closest('[data-close]')) { closeEd(); return; }
    if ((b = t.closest('[data-rmph]'))) { W.ph.splice(+b.dataset.rmph, 1); cur = 0; dirty = true; drawPh(); return; }
    if ((b = t.closest('.th[data-i]'))) { cur = +b.dataset.i; drawPh(); return; }
    if ((b = t.closest('[data-where]'))) { if (b.dataset.where) { W.s = b.dataset.where; } else { delete W.s; } dirty = true; b.parentNode.querySelectorAll('.sg').forEach(function (x) { x.classList.toggle('on', x === b); }); return; }
    if ((b = t.closest('[data-stv]'))) { W._st = b.dataset.stv; dirty = true; b.parentNode.querySelectorAll('.sg').forEach(function (x) { x.classList.toggle('on', x === b); }); $('#sth').textContent = STD[W._st]; return; }
    if ((b = t.closest('[data-cat]'))) { W.c = W.c || []; var i = W.c.indexOf(b.dataset.cat); if (i >= 0) { W.c.splice(i, 1); } else { W.c.push(b.dataset.cat); } b.classList.toggle('on', i < 0); dirty = true; return; }
    if ((b = t.closest('[data-rmsv]'))) { W.sv.splice(+b.dataset.rmsv, 1); dirty = true; drawTags(); return; }
    if ((b = t.closest('[data-addsv]'))) { addSv(b.dataset.addsv); return; }
    if (t.closest('#tags') && !t.closest('button')) { var si = $('#svin'); if (si) { si.focus(); } return; }
    if (t.closest('[data-save]')) { save(); return; }
    if (t.closest('[data-dup]')) {
      if (dirty && !confirm('Сначала сохранить правки этого букета? «Отмена» — дублировать без них.')) { /* дублируем как есть */ } else if (dirty) { save(true); return; }
      var c = clone(W); c.id = newId(); c.n = W.n + ' (копия)'; c._new = true; W = c; dirty = true; cur = 0; drawEd(); say('Это копия. Поменяйте фото и цену и сохраните');
      return;
    }
    if (t.closest('[data-del]')) {
      if (!confirm('Удалить «' + W.n + '» из каталога? Вернуть можно на вкладке «Копии».')) { return; }
      api('del', { id: W.id }).then(function () { closeEd(true); draw(); say('Букет удалён'); }, function () {});
    }
  }
  function save(thenDup) {
    var si = $('#svin'); if (si && si.value.trim()) { addSv(si.value); }
    if (!W.n.trim()) { say('Напишите название букета', true); $('[data-k="n"]').focus(); return; }
    var btn = $('[data-save]'); btn.disabled = true;
    var item = clone(W); var isNew = item._new; delete item._new;
    api('item', { item: item, new: isNew ? 1 : 0 }).then(function () {
      btn.disabled = false; dirty = false; W._new = false;
      draw(); say(isNew ? 'Букет добавлен, ' + LAG : 'Сохранено, ' + LAG);
      if (thenDup) { $('[data-dup]') ? $('[data-dup]').click() : drawEd(); } else { closeEd(true); }
    }, function () { btn.disabled = false; });
  }

  /* фото: ужимаем в браузере до 1600 px, иначе снимок с телефона весит 5 МБ и упирается в лимиты хостинга */
  function shrink(file, max) {
    max = max || 1600;
    return new Promise(function (ok) {
      var u = URL.createObjectURL(file), im = new Image();
      im.onload = function () {
        var k = Math.min(1, max / Math.max(im.width, im.height));
        var c = document.createElement('canvas'); c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
        URL.revokeObjectURL(u);
        c.toBlob(function (b) { ok(b || file); }, 'image/jpeg', 0.86);
      };
      im.onerror = function () { URL.revokeObjectURL(u); ok(file); };
      im.src = u;
    });
  }
  function upload(files) {
    var list = Array.prototype.slice.call(files || []);
    if (!list.length) { return; }
    var th = $('#thumbs'); th.insertAdjacentHTML('afterbegin', '<div class="th up" id="upl">Загрузка…</div>');
    var chain = Promise.resolve(), added = 0, bad = '';
    list.forEach(function (f) {
      chain = chain.then(function () { return shrink(f); }).then(function (blob) {
        var fd = new FormData(); fd.append('photo', blob, 'photo.jpg');
        return fetch('api.php?do=upload', { method: 'POST', body: fd, credentials: 'same-origin', headers: { 'X-CSRF': window.CSRF } }).then(function (r) { return r.json(); });
      }).then(function (r) {
        if (!r.ok) { bad = r.error; return; }
        W.ph.push(r.src); dirty = true; added++;
      }, function () { bad = 'Фото не загрузилось, проверьте интернет'; });
    });
    /* ошибку не перекрываем «Фото добавлено»: 26.10 Ирина видела «добавлено», а фото не загрузилось */
    chain.then(function () {
      if (!W) { return; }
      drawPh();
      if (bad) { say((added ? 'Добавлено фото: ' + added + '. Остальные не загрузились: ' : '') + bad, true); }
      else { say('Фото добавлено, не забудьте «Сохранить»'); }
    });
  }

  /* порядок фото перетаскиванием: тянем миниатюру, первая становится обложкой */
  var dg = null;
  function dragStart(e) {
    var th = e.target.closest('.th[data-i]');
    if (!th || e.target.closest('.rm')) { return; }
    dg = { i: +th.dataset.i, el: th, x: e.clientX, y: e.clientY, moved: false };
    document.addEventListener('pointermove', dragMove);
    document.addEventListener('pointerup', dragEnd, { once: true });
  }
  function dragMove(e) {
    if (!dg) { return; }
    if (!dg.moved && Math.abs(e.clientX - dg.x) + Math.abs(e.clientY - dg.y) < 8) { return; }
    dg.moved = true; dg.el.classList.add('drag');
    var over = document.elementFromPoint(e.clientX, e.clientY);
    over = over && over.closest('.th[data-i]');
    if (over && over !== dg.el) {
      var to = +over.dataset.i, p = W.ph.splice(dg.i, 1)[0];
      W.ph.splice(to, 0, p); dg.i = to; cur = to; dirty = true;
      $('#thumbs').innerHTML = thumbs();
      dg.el = $('.th[data-i="' + to + '"]'); dg.el.classList.add('drag');
    }
  }
  function dragEnd() {
    document.removeEventListener('pointermove', dragMove);
    if (dg && dg.moved) { drawPh(); }
    dg = null;
  }

  /* ── общие клики ── */
  document.addEventListener('click', function (e) {
    if ($('#ov') && $('#ov').contains(e.target)) { return; }
    var b;
    if ((b = e.target.closest('[data-go]'))) { location.hash = b.dataset.go; return; }
    if ((b = e.target.closest('[data-st]'))) { stSheet(b.dataset.st); return; }
    if ((b = e.target.closest('[data-ed]'))) { editor(b.dataset.ed); return; }
    if ((b = e.target.closest('[data-new]'))) { editor(null, b.dataset.new || ''); return; }
    if ((b = e.target.closest('[data-sal]'))) { vsal = b.dataset.sal; draw(); return; }
    if ((b = e.target.closest('[data-vit]'))) {
      var x = byId(b.dataset.vit);
      b.classList.toggle('on');
      quick(x.id, { off: !x.off }, x.off ? 'Букет снова на витрине и на сайте' : 'Отмечен проданным, с сайта убран');
      return;
    }
    if ((b = e.target.closest('[data-flt]'))) { flt = b.dataset.flt; if (tab !== 'buk') { location.hash = 'buk'; } else { draw(); } return; }
    if ((b = e.target.closest('[data-savecat]'))) {
      var row = b.closest('.trow');
      api('cat', { k: b.dataset.savecat, n: row.querySelector('[data-n]').value, t: row.querySelector('[data-t]').value })
        .then(function () { hotRead(); draw(); say('Раздел сохранён, ' + LAG); }, function () {});
      return;
    }
    /* «Часто ищут» */
    if ((b = e.target.closest('[data-hpick]'))) {
      var hi = +b.dataset.hpick; hotRead();
      pickPhoto('Фото для подсказки «' + (HOTW[hi].l || 'новая') + '»', function (p) { HOTW[hi].img = p; draw(); say('Фото выбрано, нажмите «Сохранить подсказки»'); });
      return;
    }
    if ((b = e.target.closest('[data-hup],[data-hdn]'))) {
      hotRead(); var i0 = +(b.dataset.hup || b.dataset.hdn), i1 = b.dataset.hup != null ? i0 - 1 : i0 + 1;
      var tmp = HOTW[i0]; HOTW[i0] = HOTW[i1]; HOTW[i1] = tmp; draw(); return;
    }
    if ((b = e.target.closest('[data-hdel]'))) { hotRead(); HOTW.splice(+b.dataset.hdel, 1); draw(); return; }
    if (e.target.closest('[data-hadd]')) { hotRead(); HOTW.push({ l: '', q: '', img: '' }); draw(); var li = pane.querySelectorAll('[data-hl]'); li[li.length - 1].focus(); return; }
    if (e.target.closest('[data-hsave]')) {
      hotRead();
      api('hot', { list: HOTW }).then(function () { HOTW = clone(D.HOT || []); draw(); say('Подсказки сохранены, ' + LAG); }, function () {});
      return;
    }
    if ((b = e.target.closest('[data-tsave]'))) { tsave(+b.dataset.tsave); return; }
    if ((b = e.target.closest('[data-restore]'))) {
      if (!confirm('Вернуть каталог к версии ' + b.closest('.cp').querySelector('b').textContent + '? Текущая версия тоже сохранится в копиях.')) { return; }
      api('restore', { file: b.dataset.restore }).then(function () { return load(); }).then(function () { HOTW = null; draw(); say('Версия возвращена, ' + LAG); }, function () {});
      return;
    }
    if (e.target.closest('[data-reload]')) { load().then(draw); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') { return; }
    var sh = $('.sh'); if (sh) { sh.remove(); return; }
    if ($('#ov')) { closeEd(); }
  });
  /* тексты: правка в блоке включает его кнопку «Сохранить блок»; фото блока грузится и подставляется сразу */
  pane.addEventListener('input', function (e) {
    var sec = e.target.closest('.tgrp');
    if (sec && e.target.dataset.k) { sec.querySelector('[data-tsave]').disabled = false; e.target.closest('.tfi').classList.remove('bad'); }
  });
  pane.addEventListener('change', function (e) {
    var t = e.target; if (!t.dataset.upk || !t.files[0]) { return; }
    var k = t.dataset.upk, sec = t.closest('.tgrp');
    say('Загружаю фото…');
    shrink(t.files[0], k === 'hero_img' ? 2400 : 1600).then(function (blob) {
      var fd = new FormData(); fd.append('photo', blob, 'photo.jpg'); fd.append('max', k === 'hero_img' ? 2400 : 1600);
      return fetch('api.php?do=upload', { method: 'POST', body: fd, credentials: 'same-origin', headers: { 'X-CSRF': window.CSRF } }).then(function (r) { return r.json(); });
    }).then(function (r) {
      t.value = '';
      if (!r.ok) { say(r.error, true); return; }
      sec.querySelector('input[data-k="' + k + '"]').value = r.src;
      sec.querySelector('img[data-imgk="' + k + '"]').src = src(r.src);
      sec.querySelector('[data-tsave]').disabled = false;
      say('Фото загружено, нажмите «Сохранить блок»');
    }, function () { say('Фото не загрузилось, проверьте интернет', true); });
  });
  $('#q').addEventListener('input', function () { q = this.value.trim(); if (tab !== 'buk') { flt = 'all'; location.hash = 'buk'; } else { draw(); } });
  window.addEventListener('hashchange', function () {
    var h = location.hash.slice(1);
    tab = TABK.indexOf(h) >= 0 ? h : 'today';
    if (tab !== 'cat') { HOTW = null; }
    if (tab === 'copies') { load().then(draw); } else { draw(); }
    scrollTo(0, 0);
  });
  window.addEventListener('beforeunload', function (e) { if (W && dirty) { e.preventDefault(); e.returnValue = ''; } });

  load().then(function () {
    var h = location.hash.slice(1);
    tab = TABK.indexOf(h) >= 0 ? h : 'today';
    draw();
  }, function () { pane.innerHTML = '<div class="empty gl">Не получилось загрузить каталог. Обновите страницу.</div>'; });
})();
