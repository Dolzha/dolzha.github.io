/* Панель Ивы на github.io. Вид и app.js те же, что у PHP-панели в admin/, отличие одно:
   github.io статичный, поэтому запросы app.js к api.php перехватываются здесь и уходят
   коммитом в репозиторий сайта через GitHub API. Проверки полей перенесены из admin/lib.php
   один в один: в каталог не попадёт ничего, чего не пропустила бы PHP-панель.

   Вход: в key.js лежит ключ GitHub, зашифрованный паролем (AES-GCM, ключ из пароля через PBKDF2).
   Без пароля ключ не прочитать. Расшифрованный ключ живёт в памяти телефона месяц, «Выйти» стирает.

   Правка = один коммит: берём свежий файл с GitHub, меняем в нём одно, пишем поверх свежей версии.
   Если между чтением и записью сохранил второй телефон, GitHub откажет, и правка повторится
   на новой версии: так два салона не затирают друг друга (как блокировка файла в lib.php). */
(function () {
  'use strict';

  var LOCAL = /^(127\.0\.0\.1|localhost)$/.test(location.hostname);
  var OWNER = 'Dolzha', REPO = 'dolzha.github.io', BRANCH = 'main', BASE = 'iva/';
  /* локальная проверка (node _iva_gh_mock.js) подменяет GitHub своим сервером */
  var API = LOCAL ? location.origin + '/gh/repos/' + OWNER + '/' + REPO : 'https://api.github.com/repos/' + OWNER + '/' + REPO;
  var RAW = 'https://raw.githubusercontent.com/' + OWNER + '/' + REPO + '/' + BRANCH + '/' + BASE;
  var STORE = 'iva_gh_key', MONTH = 30 * 24 * 3600 * 1000;
  var nf = window.fetch.bind(window);
  var TOKEN = '';
  var PEND = {};   // фото, загруженные, но ещё не вошедшие в коммит: путь → sha на GitHub
  var PIC = {};    // те же фото в памяти браузера, чтобы видеть их до пересборки сайта

  var SALONS = { m8: '8 Марта, 101', kir: 'Кировградская, 4/2' };
  var EXTRA_PAGES = ['privacy.html', 'spasibo.html', '404.html'];
  var DATA_HEAD = '/* Каталог Ивы. Этот файл пишет панель управления (admin/), руками не править.\n' +
    '   Поля букета: id, n название, p цена (null = цену назовёт менеджер), u "шт" = цена за штуку,\n' +
    '   ph фото, sv состав, c разделы, s витрина салона (m8 / kir), st сколько штук на витрине,\n' +
    '   zak под заказ, nk соберём нужное количество, na уточнить у менеджера, dop подарок к букету,\n' +
    '   ds описание, o оформление, off скрыт с сайта */\n';
  var SITE_HEAD = '/* Тексты, контакты и фото сайта Ивы. Этот файл пишет панель управления (admin/), руками не править.\n' +
    '   Панель заодно вписывает значения прямо в index.html (места с data-s), чтобы поисковики видели свежие часы и телефон. */\n';
  var SITE_SPEC = {
    phone: ['phone', 20], h_m8: ['text', 40], h_kir: ['text', 40],
    srv_m8: ['text', 40], srv_kir: ['text', 40], area_m8: ['text', 30], area_kir: ['text', 30],
    tel_note: ['text', 60], chan: ['url', 120], chan_note: ['text', 60], vk: ['url', 120],
    kont_p: ['text', 120], kont_img: ['img', 200], search_ph: ['text', 60],
    hero_a: ['text', 40], hero_b: ['text', 40], hero_lead: ['area', 220], hero_img: ['img', 200],
    vit_a: ['text', 30], vit_b: ['text', 30], vit_p: ['area', 160],
    vit_m8_t: ['text', 40], vit_m8_s: ['area', 160], vit_kir_t: ['text', 40], vit_kir_s: ['area', 160], vit_btn: ['text', 40],
    kat_a: ['text', 30], kat_b: ['text', 30], kat_p: ['area', 160],
    dost_a: ['text', 30], dost_b: ['text', 30], dost_p: ['text', 100],
    d1_h: ['text', 40], d1_p: ['area', 220], d2_p: ['area', 160], d3_p: ['area', 160],
    dn_t: ['text', 50], dn_s: ['area', 160], dn_btn: ['text', 30], deliv_line: ['text', 80],
    b_zak: ['area', 240], b_nk: ['area', 240], b_na: ['area', 240], b_o: ['area', 240], b_order: ['area', 200],
    cart_note: ['area', 160], foot_tag: ['text', 60], req: ['text', 140]
  };
  var IMG_RE = /^img\/[A-Za-z0-9_.\/-]+\.(jpe?g|png|webp)$/;

  /* ── строки как в PHP: длина в буквах, а не в байтах ── */
  function cut(s, n) { return Array.from(s).slice(0, n).join(''); }
  function len(s) { return Array.from(s).length; }
  function str(v) { return v == null ? '' : typeof v === 'boolean' ? (v ? '1' : '') : String(v); }
  function empty(v) { return v == null || v === false || v === 0 || v === '' || v === '0' || (Array.isArray(v) && !v.length); }
  function int(v) { var n = typeof v === 'number' ? v : parseInt(str(v), 10); return isFinite(n) ? Math.trunc(n) : 0; }
  function arr(v) { return v == null ? [] : Array.isArray(v) ? v : typeof v === 'object' ? Object.keys(v).map(function (k) { return v[k]; }) : [v]; }
  function e(s) { return str(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c]; }); }
  function okImg(p) { return IMG_RE.test(p) && p.indexOf('..') < 0; }
  function when(d) {
    return (d || new Date()).toLocaleTimeString('ru-RU', { timeZone: 'Asia/Yekaterinburg', hour: '2-digit', minute: '2-digit' });
  }
  function day(iso) {
    var d = new Date(iso);
    return d.toLocaleDateString('ru-RU', { timeZone: 'Asia/Yekaterinburg', day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' + when(d);
  }
  function b64(bytes) { var s = ''; for (var i = 0; i < bytes.length; i += 0x8000) { s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000)); } return btoa(s); }
  function unb64(s) { var b = atob(s), u = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) { u[i] = b.charCodeAt(i); } return u; }

  /* ── каталог и тексты: разбор и запись, как parse_js / data_js / site_js в lib.php ── */
  function parseJs(raw) {
    var a = raw.indexOf('window.IVA=');
    if (a < 0) { return null; }
    try { var d = JSON.parse(raw.slice(a + 11).trim().replace(/;$/, '')); } catch (x) { return null; }
    return d && d.P && d.CAT ? d : null;
  }
  function dataJs(d) {
    var j = function (x) { return JSON.stringify(x); };
    return DATA_HEAD + 'window.IVA={"P":[\n' + d.P.map(j).join(',\n') + '\n],"CAT":[\n' + d.CAT.map(j).join(',\n') +
      '\n],"HOT":[\n' + (d.HOT || []).map(j).join(',\n') + '\n]};\n';
  }
  function siteParse(raw) {
    var a = raw.indexOf('window.IVA_S=');
    if (a < 0) { return null; }
    try { var d = JSON.parse(raw.slice(a + 13).trim().replace(/;$/, '')); } catch (x) { return null; }
    return d && typeof d === 'object' && !Array.isArray(d) ? d : null;
  }
  function siteJs(s) {
    return SITE_HEAD + 'window.IVA_S={\n' + Object.keys(s).map(function (k) { return JSON.stringify(k) + ':' + JSON.stringify(s[k]); }).join(',\n') + '\n};\n';
  }
  function phoneDigits(t) {
    var d = str(t).replace(/\D/g, '');
    return d.length === 11 && d[0] === '8' ? '7' + d.slice(1) : d;
  }
  /* значения в разметку страницы, как site_html() в lib.php */
  function siteHtml(html, s) {
    html = html.replace(/(<([a-z0-9]+)\b[^>]*\sdata-s="([a-z0-9_]+)"[^>]*>)([\s\S]*?)(<\/\2>)/g, function (m, open, tag, k, inner, close) {
      if (s[k] == null) { return m; }
      var v = str(s[k]);
      if (k === 'chan' || k === 'vk') { v = v.replace(/^https?:\/\//, ''); }
      return open + e(v) + close;
    });
    html = html.replace(/<[a-z]+\b[^>]*\sdata-sh="([a-z0-9_]+)"[^>]*>/g, function (m, k) {
      var d = phoneDigits(s.phone);
      var v = k === 'tel' ? 'tel:+' + d : k === 'tgp' ? 'https://t.me/+' + d : str(s[k]);
      if (v === '' || v === 'tel:+' || v === 'https://t.me/+') { return m; }
      return m.replace(/\shref="[^"]*"/, function () { return ' href="' + e(v) + '"'; });
    });
    html = html.replace(/<[a-z]+\b[^>]*\sdata-sbg="([a-z0-9_]+)"[^>]*>/g, function (m, k) {
      var v = str(s[k]);
      if (v === '') { return m; }
      return m.replace(/\sstyle="[^"]*"/g, '').replace(/\sdata-sbg="/, function () { return ' style="background-image:url(\'' + e(v) + '\')" data-sbg="'; });
    });
    html = html.replace(/<[a-z]+\b[^>]*\sdata-sp="([a-z0-9_]+)"[^>]*>/g, function (m, k) {
      var v = str(s[k]);
      if (v === '') { return m; }
      return m.replace(/\splaceholder="[^"]*"/, function () { return ' placeholder="' + e(v) + '"'; });
    });
    return html;
  }

  /* ── проверки полей: clean_item и site_clean из lib.php ── */
  function cleanItem(x, catKeys) {
    var s = function (v, max) { return cut(str(v).replace(/\s+/g, ' ').trim(), max); };
    var id = str(x.id);
    if (!/^[a-z0-9]{1,16}$/.test(id)) { return { error: 'Неверный номер букета' }; }
    var n = s(x.n, 120);
    if (n === '') { return { error: 'Напишите название букета' }; }
    var o = { id: id, n: n };
    var p = x.p;
    o.p = (p == null || p === '') ? null : Math.max(0, Math.min(1000000, int(p)));
    if (x.u === 'шт') { o.u = 'шт'; }
    o.ph = [];
    arr(x.ph).forEach(function (ph) { ph = str(ph); if (okImg(ph) && o.ph.indexOf(ph) < 0) { o.ph.push(ph); } });
    o.ph = o.ph.slice(0, 12);
    o.sv = [];
    arr(x.sv).forEach(function (v) { v = s(v, 40).toLowerCase(); if (v !== '' && o.sv.indexOf(v) < 0) { o.sv.push(v); } });
    o.sv = o.sv.slice(0, 20);
    var c = arr(x.c).filter(function (k) { return catKeys.indexOf(k) >= 0; });
    if (c.length) { o.c = c; }
    if (x.s != null && SALONS.hasOwnProperty(x.s)) { o.s = x.s; }
    if (!empty(x.st)) { o.st = Math.max(1, Math.min(9999, int(x.st))); }
    var st = str(x._st);   // наличие одной меткой, в файле оно хранится флагом
    if (st === '') { st = !empty(x.zak) ? 'zak' : !empty(x.nk) ? 'nk' : !empty(x.na) ? 'na' : 'in'; }
    if (['zak', 'nk', 'na'].indexOf(st) >= 0) { o[st] = 1; }
    ['dop', 'o', 'off'].forEach(function (f) { if (!empty(x[f])) { o[f] = 1; } });
    var ds = s(x.ds, 600);
    if (ds !== '') { o.ds = ds; }
    return { item: o };
  }
  function siteClean(k, v) {
    if (!SITE_SPEC.hasOwnProperty(k)) { return { error: 'Неизвестное поле' }; }
    var type = SITE_SPEC[k][0], max = SITE_SPEC[k][1];
    v = str(v).replace(/[\r\n]/g, ' ').replace(/[ \t]+/g, ' ').trim();
    if (len(v) > max) { return { error: 'Слишком длинно: не больше ' + max + ' знаков' }; }
    if (v === '' && type !== 'url') { return { error: 'Поле не может быть пустым' }; }
    if (type === 'phone') {
      var d = phoneDigits(v);
      if (d.length !== 11 || d[0] !== '7') { return { error: 'Телефон нужен в виде +7 900 000-00-00' }; }
      v = '+7 ' + d.slice(1, 4) + ' ' + d.slice(4, 7) + '-' + d.slice(7, 9) + '-' + d.slice(9, 11);
    }
    if (type === 'url' && v !== '' && !/^https:\/\/[a-z0-9.-]+\.[a-z]{2,}(\/[^\s"<>]*)?$/i.test(v)) {
      return { error: 'Ссылка должна начинаться с https://' };
    }
    if (type === 'img' && (!/^(img\/[A-Za-z0-9_.\/-]+|hero)\.(jpe?g|png|webp)$/.test(v) || v.indexOf('..') >= 0)) {
      return { error: 'Неверный путь к фото' };
    }
    return { v: v };
  }

  /* ── GitHub ── */
  function Fail(status, msg) { this.status = status; this.message = msg; }
  function gh(method, path, body, raw) {
    var h = { Authorization: 'Bearer ' + TOKEN, Accept: raw ? 'application/vnd.github.raw' : 'application/vnd.github+json' };
    if (body) { h['Content-Type'] = 'application/json'; }
    return nf(API + path, { method: method, headers: h, cache: 'no-store', body: body ? JSON.stringify(body) : undefined }).then(function (r) {
      if (r.ok) { return raw ? r.text() : r.json(); }
      return r.text().then(function (t) { throw new Fail(r.status, t.slice(0, 200)); });
    });
  }
  function file(p, ref) {
    return gh('GET', '/contents/' + BASE + p + '?ref=' + encodeURIComponent(ref), null, true)
      .catch(function (x) { if (x.status === 404) { return ''; } throw x; });
  }

  /* все записи по очереди: два своих сохранения подряд не спорят друг с другом */
  var line = Promise.resolve();
  function queue(fn) { var r = line.then(fn, fn); line = r.catch(function () {}); return r; }

  /* Правка одним коммитом. msg — подпись коммита (строка или функция, её зовём после fn). fn получает свежие файлы {путь: текст} и возвращает
     {files: {путь: новый текст}, ...ответ} или {error}. Чужой коммит между чтением
     и записью → GitHub отвечает 422, повторяем всё на новой версии. */
  function write(paths, fn, msg) {
    return queue(function () {
      var tries = 0;
      function go() {
        return gh('GET', '/git/ref/heads/' + BRANCH).then(function (ref) {
          var head = ref.object.sha;
          return Promise.all([gh('GET', '/git/commits/' + head)].concat(paths.map(function (p) { return file(p, head); }))).then(function (got) {
            var map = {};
            paths.forEach(function (p, i) { map[p] = got[i + 1]; });
            var res = fn(map);
            if (res.error) { return { ok: false, error: res.error }; }
            var pend = Object.keys(PEND);
            var tree = Object.keys(res.files).map(function (p) { return { path: BASE + p, mode: '100644', type: 'blob', content: res.files[p] }; })
              .concat(pend.map(function (p) { return { path: BASE + p, mode: '100644', type: 'blob', sha: PEND[p] }; }));
            return gh('POST', '/git/trees', { base_tree: got[0].tree.sha, tree: tree })
              .then(function (t) { return gh('POST', '/git/commits', { message: 'Панель Ивы: ' + (typeof msg === 'function' ? msg() : msg), tree: t.sha, parents: [head] }); })
              .then(function (c) { return gh('PATCH', '/git/refs/heads/' + BRANCH, { sha: c.sha, force: false }); })
              .then(function () {
                pend.forEach(function (p) { delete PEND[p]; });
                delete res.files;
                res.ok = true; res.when = when();
                return res;
              }, function (x) {
                if ((x.status === 422 || x.status === 409) && ++tries < 5) { return go(); }
                throw x;
              });
          });
        });
      }
      return go();
    });
  }

  function dataEdit(fn, msg) {
    return write(['data/catalog.js'], function (f) {
      var d = parseJs(f['data/catalog.js']);
      if (!d) { return { error: 'Файл каталога повреждён, ничего не записал' }; }
      var r = fn(d);
      if (r.error) { return r; }
      return { files: { 'data/catalog.js': dataJs(r.d || d) }, data: r.d || d };
    }, msg);
  }
  function siteEdit(fn, msg) {
    return write(['data/site.js', 'index.html'].concat(EXTRA_PAGES), function (f) {
      var s = siteParse(f['data/site.js']);
      if (!s) { return { error: 'Файл текстов повреждён, ничего не записал' }; }
      var r = fn(s);
      if (r.error) { return r; }
      s = r.s || s;
      var html = f['index.html'];
      if (!html || html.indexOf('data-s="phone"') < 0) { return { error: 'Не нашёл страницу сайта для записи' }; }
      var files = { 'data/site.js': siteJs(s), 'index.html': siteHtml(html, s) };
      EXTRA_PAGES.forEach(function (pg) { if (f[pg] && f[pg].indexOf('data-s') >= 0) { files[pg] = siteHtml(f[pg], s); } });
      return { files: files, site: s };
    }, msg);
  }

  /* в копии подпись берём от СЛЕДУЮЩЕЙ правки: «вернуть» откатывает состояние ДО неё */
  function backups() {
    return Promise.all([
      gh('GET', '/commits?sha=' + BRANCH + '&per_page=31&path=' + encodeURIComponent(BASE + 'data/catalog.js')),
      gh('GET', '/commits?sha=' + BRANCH + '&per_page=31&path=' + encodeURIComponent(BASE + 'data/site.js'))
    ]).then(function (two) {
      var out = [];
      [['catalog_', 'Букеты и разделы'], ['site_', 'Тексты, контакты и фото']].forEach(function (k, i) {
        var list = two[i];
        for (var j = 1; j < list.length; j++) {
          var next = list[j - 1].commit.message.split('\n')[0];
          out.push({ file: k[0] + list[j].sha, t: list[j].commit.committer.date, when: day(list[j].commit.committer.date), what: k[1],
                     count: next.indexOf('Панель Ивы: ') === 0 ? 'до правки: ' + next.slice(12) : 'до выкладки разработчика' });
        }
      });
      out.sort(function (a, b) { return a.t < b.t ? 1 : a.t > b.t ? -1 : 0; });
      return out;
    });
  }

  function itemName(d, id) { for (var i = 0; i < d.P.length; i++) { if (d.P[i].id === id) { return d.P[i].n; } } return id; }
  var NOT_FOUND = 'Букет не найден: его могли удалить с другого устройства';

  /* ── действия api.php ── */
  var ACT = {
    load: function () {
      return Promise.all([file('data/catalog.js', BRANCH), file('data/site.js', BRANCH), nf('../index.html', { cache: 'no-store' }).then(function (r) { return r.text(); }), backups()])
        .then(function (r) {
          var icons = {}, m, re = /\.kc\[data-f="([a-z0-9]+)"\] \.kb span\{--m:(url\("[^"]+"\))/g;
          while ((m = re.exec(r[2]))) { icons[m[1]] = m[2]; }
          return { ok: true, data: parseJs(r[0]) || { P: [], CAT: [] }, site: siteParse(r[1]) || {}, icons: icons, backups: r[3], salons: SALONS };
        });
    },
    item: function (in_) {
      var x = in_.item && typeof in_.item === 'object' ? in_.item : {};
      return dataEdit(function (d) {
        var r = cleanItem(x, d.CAT.map(function (c) { return c.k; }));
        if (r.error) { return r; }
        for (var i = 0; i < d.P.length; i++) { if (d.P[i].id === r.item.id) { d.P[i] = r.item; return {}; } }
        if (empty(in_['new'])) { return { error: NOT_FOUND }; }
        d.P.unshift(r.item);
        return {};
      }, (empty(in_['new']) ? 'букет «' : 'новый букет «') + str(x.n).slice(0, 60) + '»');
    },
    quick: function (in_) {
      var id = str(in_.id), set = in_.set && typeof in_.set === 'object' ? in_.set : {}, name = id;
      var what = set.st != null ? 'наличие' : 'off' in set ? (set.off ? 'скрыт' : 'показан') : 'витрина';
      return dataEdit(function (d) {
        for (var i = 0; i < d.P.length; i++) {
          var x = d.P[i];
          if (x.id !== id) { continue; }
          name = x.n;
          if (set.st != null) { delete x.zak; delete x.nk; delete x.na; x._st = str(set.st); }
          if ('s' in set) { delete x.s; if (!empty(set.s)) { x.s = str(set.s); } }
          if ('off' in set) { delete x.off; if (!empty(set.off)) { x.off = 1; } }
          var r = cleanItem(x, d.CAT.map(function (c) { return c.k; }));
          if (r.error) { return r; }
          d.P[i] = r.item;
          return {};
        }
        return { error: NOT_FOUND };
      }, function () { return what + ' «' + name + '»'; });
    },
    del: function (in_) {
      var id = str(in_.id), name = id;
      return dataEdit(function (d) {
        name = itemName(d, id);
        var n = d.P.length;
        d.P = d.P.filter(function (x) { return x.id !== id; });
        return d.P.length === n ? { error: 'Букет уже удалён' } : {};
      }, function () { return 'удалён букет «' + name + '»'; });
    },
    cat: function (in_) {
      var k = str(in_.k);
      return dataEdit(function (d) {
        for (var i = 0; i < d.CAT.length; i++) {
          var c = d.CAT[i];
          if (c.k !== k) { continue; }
          var n = cut(str(in_.n).trim(), 80);
          if (n === '') { return { error: 'Название раздела не может быть пустым' }; }
          c.n = n;
          var t = cut(str(in_.t).trim(), 160);
          if (t !== '') { c.t = t; } else { delete c.t; }
          var img = str(in_.img);
          if (img !== '' && okImg(img)) { c.img = img; }
          return {};
        }
        return { error: 'Раздел не найден' };
      }, 'раздел «' + k + '»');
    },
    site: function (in_) {
      var set = in_.set && typeof in_.set === 'object' ? in_.set : {}, clean = {}, keys = Object.keys(set);
      if (!keys.length) { return Promise.resolve({ ok: false, error: 'Нечего сохранять' }); }
      for (var i = 0; i < keys.length; i++) {
        var r = siteClean(keys[i], set[keys[i]]);
        if (r.error) { return Promise.resolve({ ok: false, error: r.error, field: keys[i] }); }
        clean[keys[i]] = r.v;
      }
      return siteEdit(function (s) { keys.forEach(function (k) { s[k] = clean[k]; }); return {}; }, 'тексты (' + keys.join(', ') + ')');
    },
    hot: function (in_) {
      var out = [], list = arr(in_.list).slice(0, 12);
      for (var i = 0; i < list.length; i++) {
        var h = list[i] || {};
        var l = cut(str(h.l).trim(), 30), q = cut(str(h.q).trim(), 40).toLowerCase(), img = str(h.img);
        if (l === '' || q === '') { return Promise.resolve({ ok: false, error: 'У каждой подсказки нужны подпись и что искать' }); }
        if (!okImg(img)) { return Promise.resolve({ ok: false, error: 'Выберите фото для «' + l + '»' }); }
        out.push({ l: l, q: q, img: img });
      }
      return dataEdit(function (d) { d.HOT = out; return {}; }, '«Часто ищут»');
    },
    restore: function (in_) {
      var f = str(in_.file), m = /^(catalog|site)_([0-9a-f]{40})$/.exec(f);
      if (!m) { return Promise.resolve({ ok: false, error: 'Неверное имя копии' }); }
      if (m[1] === 'site') {
        return file('data/site.js', m[2]).then(function (raw) {
          var old = siteParse(raw);
          if (!old) { return { ok: false, error: 'Копия не найдена или повреждена' }; }
          return siteEdit(function () { return { s: old }; }, 'возврат текстов к версии ' + m[2].slice(0, 7));
        });
      }
      return file('data/catalog.js', m[2]).then(function (raw) {
        var old = parseJs(raw);
        if (!old) { return { ok: false, error: 'Копия не найдена или повреждена' }; }
        return dataEdit(function () { return { d: old }; }, 'возврат каталога к версии ' + m[2].slice(0, 7));
      });
    },
    /* фото: браузер уже ужал его (shrink в app.js). Проверяем, что это картинка, и кладём на GitHub
       отдельным файлом; в сайт оно попадёт вместе со следующим сохранением букета или блока */
    upload: function (fd) {
      var f = fd && fd.get ? fd.get('photo') : null;
      if (!f || !f.size) { return Promise.resolve({ ok: false, error: 'Фото не долетело, попробуйте ещё раз' }); }
      if (f.size > 15 * 1024 * 1024) { return Promise.resolve({ ok: false, error: 'Слишком большой файл, максимум 15 МБ' }); }
      return f.arrayBuffer().then(function (buf) {
        var u = new Uint8Array(buf), ext = '';
        if (u[0] === 0xFF && u[1] === 0xD8 && u[2] === 0xFF) { ext = 'jpg'; }
        else if (u[0] === 0x89 && u[1] === 0x50 && u[2] === 0x4E && u[3] === 0x47) { ext = 'png'; }
        else if (String.fromCharCode.apply(null, u.subarray(0, 4)) === 'RIFF' && String.fromCharCode.apply(null, u.subarray(8, 12)) === 'WEBP') { ext = 'webp'; }
        if (!ext) { return { ok: false, error: 'Нужен JPG, PNG или WEBP' }; }
        var t = new Date(), z = function (n) { return (n < 10 ? '0' : '') + n; };
        var rnd = Array.from(crypto.getRandomValues(new Uint8Array(3))).map(function (b) { return (b < 16 ? '0' : '') + b.toString(16); }).join('');
        var name = 'img/u/up-' + t.getFullYear() + z(t.getMonth() + 1) + z(t.getDate()) + '-' + z(t.getHours()) + z(t.getMinutes()) + z(t.getSeconds()) + '-' + rnd + '.' + ext;
        return gh('POST', '/git/blobs', { content: b64(u), encoding: 'base64' }).then(function (bl) {
          PEND[name] = bl.sha;
          PIC[name] = URL.createObjectURL(new Blob([buf], { type: ext === 'jpg' ? 'image/jpeg' : 'image/' + ext }));
          return { ok: true, src: name };
        });
      });
    }
  };

  function reply(o, status) {
    return new Response(JSON.stringify(o), { status: status || 200, headers: { 'Content-Type': 'application/json; charset=utf-8' } });
  }
  function route(url, opt) {
    var action = new URLSearchParams(url.split('?')[1] || '').get('do') || '';
    if (!ACT[action]) { return Promise.resolve(reply({ ok: false, error: 'Неизвестное действие' }, 400)); }
    var body = opt.body, in_ = {};
    if (typeof body === 'string') { try { in_ = JSON.parse(body) || {}; } catch (x) { in_ = {}; } }
    return ACT[action](action === 'upload' ? body : in_).then(function (r) { return reply(r); }, function (x) {
      if (x instanceof Fail) {
        if (x.status === 401) { forget(); return reply({ ok: false, error: 'Нужно войти заново' }, 401); }
        if (x.status === 403 || x.status === 404) { return reply({ ok: false, error: 'GitHub не дал записать: у ключа нет доступа или он истёк. Напишите разработчику' }); }
        if (x.status === 422 || x.status === 409) { return reply({ ok: false, error: 'Сайт как раз сохраняли с другого устройства, повторите через минуту' }); }
        return reply({ ok: false, error: 'GitHub ответил ошибкой ' + x.status + ', правка не сохранилась. Повторите через минуту' });
      }
      throw x;   // нет сети: app.js сам скажет «Нет связи с сервером»
    });
  }

  /* ── вход ── */
  function remember(t) { try { localStorage.setItem(STORE, JSON.stringify({ t: t, exp: Date.now() + MONTH })); } catch (x) {} }
  function forget() { try { localStorage.removeItem(STORE); } catch (x) {} }
  function saved() {
    try { var o = JSON.parse(localStorage.getItem(STORE) || 'null'); return o && o.t && o.exp > Date.now() ? o.t : ''; } catch (x) { return ''; }
  }
  /* key.js: [{s соль, i вектор, c шифр, n итераций}] — по одному на каждый пароль (Ирина, запасной разработчика) */
  function unlock(pass) {
    var env = window.IVA_KEY || [], enc = new TextEncoder();
    return crypto.subtle.importKey('raw', enc.encode(pass), 'PBKDF2', false, ['deriveKey']).then(function (base) {
      var i = 0;
      function next() {
        if (i >= env.length) { return ''; }
        var k = env[i++];
        return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: unb64(k.s), iterations: k.n, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['decrypt'])
          .then(function (key) { return crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(k.i) }, key, unb64(k.c)); })
          .then(function (plain) { return new TextDecoder().decode(plain); }, next);
      }
      return next();
    });
  }

  function boot() {
    document.body.className = 'app';
    window.CSRF = '-';
    window.IVA_LAG = !LOCAL;
    window.IVA_SRC = function (p) {
      if (PIC[p]) { return PIC[p]; }
      /* загруженное из панели берём прямо из репозитория: сайт мог ещё не пересобраться */
      return !LOCAL && p.indexOf('img/u/') === 0 ? RAW + p : '../' + p;
    };
    window.fetch = function (u, o) {
      if (typeof u === 'string' && u.indexOf('api.php?') === 0) { return route(u, o || {}); }
      return nf(u, o);
    };
    ['icons.js', 'app.js'].reduce(function (p, f) {
      return p.then(function () {
        return new Promise(function (ok, bad) { var s = document.createElement('script'); s.src = f + '?v=' + (window.IVA_V || 1); s.onload = ok; s.onerror = bad; document.body.appendChild(s); });
      });
    }, Promise.resolve());
  }

  if (/[?&]out=1/.test(location.search)) { forget(); location.replace('./'); return; }
  TOKEN = saved();
  if (TOKEN) { boot(); return; }

  var form = document.querySelector('.lform'), err = form.querySelector('.err'), btn = form.querySelector('button');
  document.body.className = 'login';
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var pass = form.querySelector('#p').value;
    err.hidden = true; btn.disabled = true; btn.textContent = 'Проверяю…';
    var fail = function (t) { err.textContent = t; err.hidden = false; btn.disabled = false; btn.textContent = 'Войти'; };
    Promise.resolve().then(function () { return unlock(pass); }).then(function (t) {
      if (!t) { return setTimeout(function () { fail('Пароль не подошёл'); }, 400); }
      TOKEN = t;
      /* ключ проверяем сразу: истёк или отозван — говорим об этом здесь, а не при первом сохранении */
      return gh('GET', '/git/ref/heads/' + BRANCH).then(function () { remember(t); boot(); }, function (x) {
        TOKEN = '';
        fail(x instanceof Fail && (x.status === 401 || x.status === 403) ? 'Пароль верный, но ключ доступа к сайту истёк. Напишите разработчику' : 'Нет связи с GitHub, проверьте интернет');
      });
    }, function () { fail('Этот браузер не умеет нужное шифрование, откройте панель в Chrome или Safari'); });
  });
})();
