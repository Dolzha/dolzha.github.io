/* Показательная панель LolliPolli на github.io (11.11): тот же app.js, но вместо сервера ответы
   из памяти браузера. Всё нажимается, на сайт ничего не уходит, после обновления страницы всё как было. */
(function () {
  var D = JSON.parse(JSON.stringify(window.LP)), BK = [], n = 0;
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function now() { var d = new Date(); return ('0' + d.getDate()).slice(-2) + '.' + ('0' + (d.getMonth() + 1)).slice(-2) + '.' + d.getFullYear() + ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
  function snap() { BK.unshift({ file: 'lp_' + (++n) + '.js', when: now(), count: D.A.filter(function (x) { return !x.off; }).length + ' афиш на сайте', d: clone(D) }); }
  function ok(extra) { return Object.assign({ ok: true, data: clone(D), when: '' }, extra || {}); }
  function err(t) { return { ok: false, error: t }; }
  function shelfFix(it) {
    D.SH.forEach(function (s) {
      var o = (s.o || []).filter(function (id) { return id !== it.id || it.sh.indexOf(s.k) >= 0; });
      if (it.sh.indexOf(s.k) >= 0 && o.indexOf(it.id) < 0) { o.push(it.id); }
      s.o = o;
    });
  }
  var H = {
    afisha: function (b) {
      var it = b.item; if (!it.n) { return err('Напишите название программы'); }
      snap();
      var i = D.A.findIndex(function (x) { return x.id === it.id; });
      if (!it.off) { delete it.off; }
      if (i >= 0) { D.A[i] = it; } else { D.A.push(it); }
      shelfFix(it); return ok();
    },
    off: function (b) { snap(); D.A.forEach(function (x) { if (x.id === b.id) { if (b.off) { x.off = 1; } else { delete x.off; } } }); return ok(); },
    del: function (b) { snap(); D.A = D.A.filter(function (x) { return x.id !== b.id; }); D.SH.forEach(function (s) { s.o = (s.o || []).filter(function (v) { return v !== b.id; }); }); return ok(); },
    order: function (b) { snap(); D.SH.forEach(function (s) { if (s.k === b.k) { s.o = b.ids; } }); return ok(); },
    shelf: function (b) { snap(); D.SH.forEach(function (s) { if (s.k === b.k) { if (b.off) { s.off = 1; } else { delete s.off; } } }); return ok(); },
    photos: function (b) { snap(); D.F = b.list; return ok(); },
    reviews: function (b) { snap(); D.R = b.list; return ok(); },
    texts: function (b) { snap(); Object.keys(b.set).forEach(function (k) { D.S[k] = b.set[k].trim(); }); return ok(); },
    restore: function (b) { var c = BK.filter(function (x) { return x.file === b.file; })[0]; if (!c) { return err('Копия не найдена'); } snap(); D = clone(c.d); return ok(); }
  };
  var real = window.fetch.bind(window);
  window.fetch = function (url, opt) {
    var m = /api\.php\?do=([a-z]+)/.exec(String(url));
    if (!m) { return real(url, opt); }
    var r;
    if (m[1] === 'load') { r = { ok: true, data: clone(D), backups: BK.map(function (x) { return { file: x.file, when: x.when, count: x.count }; }) }; }
    else if (m[1] === 'upload') {
      var f = opt.body.get('photo'); r = { ok: true, src: URL.createObjectURL(f) };
    } else { r = H[m[1]] ? H[m[1]](JSON.parse(opt.body || '{}')) : err('Неизвестное действие'); }
    return new Promise(function (ok2) { setTimeout(function () { ok2(new Response(JSON.stringify(r), { status: 200, headers: { 'Content-Type': 'application/json' } })); }, 250); });
  };
  window.CSRF = 'demo';
  window.LP_BASE = '../lollipolli/';
  window.LP_LAG = 'это пример, на сайт не уходит';
})();
