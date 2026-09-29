/* Весь JS сайта. Правило проекта: ни одного слушателя scroll —
   всё, что связано с прокруткой, живёт в CSS (animation-timeline).
   Здесь только то, что прокруткой не является. */

/* ── появление блоков, вариант 09 «ступенькой» ────────────────
   Заголовок, подзаголовок и дальше содержимое поднимаются по очереди.
   Начальное состояние задано в CSS, чтобы не мигало до запуска скрипта.
   Слушателя scroll по-прежнему нет: за появлением следит наблюдатель
   пересечений — он сам сообщает, что блок вышел на экран. */
clearTimeout(window.__rv);

/* ── V10 · экран загрузки: снимаем, когда страница готова ─────
   Проявка идёт 1,7 с, зерно уходит к 1,7 с, дальше знак стоит
   чётким ещё 1,2 с — и только потом экран гаснет.
   Если этот скрипт не отработает, экран снимет таймер из <head>. */
const pre = document.getElementById('pre');
if (pre) {
  const hide = () => {
    clearTimeout(window.__preT);
    pre.classList.add('off');
    setTimeout(() => pre.remove(), 800);
  };
  const wait = () => Math.max(0, 2900 - (Date.now() - (window.__preStart || Date.now())));
  if (document.readyState === 'complete') setTimeout(hide, wait());
  else addEventListener('load', () => setTimeout(hide, wait()), { once: true });
}

/* ── H18 · плавающая кнопка прячется, когда виден блок заявки ── */
const fab = document.getElementById('fab');
const ask = document.getElementById('zayavka');
if (fab && ask && 'IntersectionObserver' in window) {
  new IntersectionObserver(es => {
    fab.classList.toggle('hide', es[0].isIntersecting);
  }, { threshold: 0.12 }).observe(ask);
}

/* Кнопка стоит над полосой плиток первого экрана. Высоту полосы
   не угадываем: наблюдатель размера кладёт её в переменную, из
   которой считается отступ снизу. Слушателя resize нет.
   В CSS прописан запасной отступ на случай, если скрипт не дошёл. */
const hstats = document.querySelector('.hstats');
if (hstats && 'ResizeObserver' in window) {
  new ResizeObserver(es => {
    const h = Math.round(es[0].target.getBoundingClientRect().height);
    if (h) document.documentElement.style.setProperty('--hstats-h', h + 'px');
  }).observe(hstats);
}

/* ── V13 · шапка сжимается ────────────────────────────────────
   Слушателя scroll нет: за верхом страницы следит наблюдатель
   пересечений по невидимой метке высотой 90 px. */
const topbar = document.querySelector('.top');
const sent = document.getElementById('tsent');
if (topbar && sent && 'IntersectionObserver' in window) {
  new IntersectionObserver(es => {
    topbar.classList.toggle('small', !es[0].isIntersecting);
  }, { threshold: 0 }).observe(sent);
}

/* ── V15 · параллакс в кадрах работ ───────────────────────────
   Где есть таймлайн прокрутки — всё делает CSS. Где нет —
   считаем сдвиг в кадре анимации, и только пока кадры на экране. */
const vt = window.CSS && CSS.supports && CSS.supports('animation-timeline', 'view()');
if (!vt) {
  document.documentElement.classList.add('no-vt');
  const shots = [...document.querySelectorAll('.wcell img')];
  if (shots.length && 'IntersectionObserver' in window) {
    const live = new Set();
    let raf = 0;
    const step = () => {
      if (!live.size) { raf = 0; return; }
      const vh = innerHeight;
      live.forEach(img => {
        const r = img.getBoundingClientRect();
        const p = 1 - (r.top + r.height) / (vh + r.height);
        img.style.translate = '0 ' + ((Math.min(1, Math.max(0, p)) - .5) * 8).toFixed(2) + '%';
      });
      raf = requestAnimationFrame(step);
    };
    const io = new IntersectionObserver(es => {
      es.forEach(e => e.isIntersecting ? live.add(e.target) : live.delete(e.target));
      if (live.size && !raf) raf = requestAnimationFrame(step);
    }, { threshold: 0 });
    shots.forEach(i => io.observe(i));
  }
}

const RV = ['.sect-h', '.sect-s', '.edge .big span', '.edge .aside p', '.edge .aside a',
            '.wcell', '.mcell', '.crc', '.rcell', '.rows > details', '.qs > details',
            '.step', '.chips', '.own', '.slots', '.form', '.ticket',
            '.ptel', '.dline .it', '.fgrid > *', '.frow', '.demo'].join(',');

const secs = document.querySelectorAll('main > section:not(.open):not(.marq), footer');
secs.forEach(sec => {
  sec.querySelectorAll(RV).forEach((el, i) => {
    el.style.setProperty('--i', Math.min(i, 7));
  });
});
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('seen');
      io.unobserve(e.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
  secs.forEach(s => io.observe(s));
} else {
  document.documentElement.classList.add('rv-off');
}

/* ── свой курсор: единственная работа с мышью ── */
const cur = document.querySelector('.cur');
if (cur && matchMedia('(pointer:fine)').matches) {
  addEventListener('pointermove', e => {
    cur.style.setProperty('--x', e.clientX + 'px');
    cur.style.setProperty('--y', e.clientY + 'px');
  }, { passive: true });
  addEventListener('pointerdown', () => cur.style.opacity = '.45');
  addEventListener('pointerup', () => cur.style.opacity = '1');
}

/* ── заявка: бланк наряд-заказа собирается прямо при заполнении ── */
const frm = document.getElementById('frm');
if (frm) {
  const put = (id, v, dash) => {
    const el = document.getElementById(id);
    if (el) el.textContent = (v && v.trim()) ? v.trim() : dash;
  };
  const d0 = new Date();
  const no = 1000 + d0.getDate() * 7 + (d0.getMonth() + 1) * 3;
  ['v-num', 'v-num2'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = no;
  });
  const sync = () => {
    const serv = frm.querySelector('input[name="serv"]:checked');
    const own = frm.elements['own'] ? frm.elements['own'].value.trim() : '';
    let s = serv ? serv.value : '';
    if (own) s = s && s !== 'Пока не знаю' ? s + ' · ' + own : own;
    put('v-serv', s, 'не выбрана');
    put('v-name', frm.elements['name'].value, '—');
    put('v-tel', frm.elements['tel'].value, '—');
    put('v-car', frm.elements['car'].value, '—');
    const t = frm.elements['time'].value;
    const when = frm.dataset.when || (t ? `время ${t}` : 'по договорённости');
    put('v-when', when, 'по договорённости');
  };
  frm.addEventListener('input', sync);
  frm.addEventListener('change', sync);
  sync();

  const paper = document.getElementById('tpaper');
  const stamp = document.getElementById('tstamp');
  const okBox = document.getElementById('ok');
  const btn = frm.querySelector('.send');

  frm.addEventListener('submit', e => {
    e.preventDefault();
    if (frm.dataset.sent) return;
    let bad = false;
    ['name', 'tel', 'car'].forEach(n => {
      const el = frm.elements[n];
      if (!el.value.trim()) { el.classList.add('bad'); bad = true; }
      else el.classList.remove('bad');
    });
    const pd = frm.elements['pd'];
    pd.closest('.agree').classList.toggle('bad', !pd.checked);
    if (!pd.checked) bad = true;
    if (bad) return;

    frm.dataset.sent = '1';
    paper.classList.add('done');
    stamp.classList.add('on');
    const st = document.getElementById('v-st');
    if (st) st.textContent = 'принято в работу';
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Заявка принята';
    okBox.innerHTML = 'Бланк ушёл в цех. Это демонстрационный сайт — данные никуда не уходят. '
      + '<button type="button" class="again">оформить ещё одну</button>';
    okBox.style.display = 'block';
    okBox.querySelector('.again').addEventListener('click', () => {
      delete frm.dataset.sent;
      frm.reset();
      delete frm.dataset.when;
      paper.classList.remove('done');
      stamp.classList.remove('on');
      if (st) st.textContent = 'заполняется';
      btn.disabled = false;
      btn.querySelector('span').textContent = 'Записаться на осмотр';
      okBox.style.display = 'none';
      document.dispatchEvent(new CustomEvent('slots:reset'));
      sync();
    });
  });
}

/* ── запись на слот ─────────────────────────────────
   Неделя вперёд от сегодняшнего дня: человек выбирает день и время
   сам, вместо «мы вам перезвоним». Занятость считаем от самой даты,
   а не случайно — иначе слоты прыгают при каждой перерисовке. */
const daysBox = document.getElementById('days');
if (daysBox && frm) {
  const DN    = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
  const DFULL = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
  const MON   = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
                 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const HOURS = ['10:00', '12:00', '14:00', '16:00', '18:00'];

  const timesBox = document.getElementById('times');
  const pickBox  = document.getElementById('pick');
  const fDate = frm.elements['date'], fTime = frm.elements['time'];

  const plural = (n, forms) => forms[
    n % 10 === 1 && n % 100 !== 11 ? 0
    : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];

  const closed = d => d.getDay() === 0;                       // воскресенье цех не работает
  const seed = d => (d.getDate() * 37 + d.getMonth() * 11) % 31;
  const busy = (d, h) => ((seed(d) >> h) & 1) === 1;
  const free   = d => HOURS.filter((_, h) => !busy(d, h)).length;
  const iso    = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today); d.setDate(today.getDate() + i + 1); return d;
  });

  let day = null, time = null;

  const say = () => {
    if (!day) { pickBox.textContent = 'День пока не выбран'; pickBox.classList.remove('on'); return; }
    const words = `${DFULL[day.getDay()]}, ${day.getDate()} ${MON[day.getMonth()]}`;
    pickBox.innerHTML = time
      ? `Выбрано: <b>${words}, ${time}</b>`
      : `Выбрано: <b>${words}</b> · осталось выбрать время`;
    pickBox.classList.add('on');
    fDate.value = iso(day);
    fTime.value = time || '';
    if (time) frm.dataset.when = `${words}, ${time}`;
    else delete frm.dataset.when;
    frm.dispatchEvent(new Event('input', { bubbles: true }));
  };

  const drawTimes = () => {
    timesBox.innerHTML = '';
    if (!day) return;
    HOURS.forEach((h, i) => {
      const taken = busy(day, i);
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'tm' + (taken ? ' off' : '');
      b.disabled = taken;
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', String(!taken && time === h));
      b.textContent = h;
      b.setAttribute('aria-label', taken ? h + ' — занято' : h + ' — свободно');
      if (!taken && time === h) b.classList.add('on');
      b.addEventListener('click', () => { time = h; drawTimes(); say(); });
      timesBox.appendChild(b);
    });
    timesBox.classList.add('on');
  };

  const drawDays = () => {
    daysBox.innerHTML = '';
    week.forEach(d => {
      const off = closed(d);
      const n = free(d);
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'day' + (off ? ' off' : '') + (day && +day === +d ? ' on' : '');
      b.disabled = off;
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', String(!!day && +day === +d));
      b.innerHTML = `<span class="dn">${DN[d.getDay()]}</span><b>${d.getDate()}</b>` +
        `<span class="df">${off ? 'выходной' : n + ' ' + plural(n, ['окно', 'окна', 'окон'])}</span>`;
      b.addEventListener('click', () => { day = d; time = null; drawDays(); drawTimes(); say(); });
      daysBox.appendChild(b);
    });
  };

  document.addEventListener('slots:reset', () => {
    day = null; time = null; timesBox.innerHTML = ''; timesBox.classList.remove('on');
    drawDays(); say();
  });

  drawDays();
  say();
}

/* ── материалы: карточка открывает окно с серией кадров ──── */
const mmod = document.getElementById('mmod');
const mraw = document.getElementById('mdata');
if (mmod && mraw) {
  const M = JSON.parse(mraw.textContent);
  const img = document.getElementById('mm-img');
  const cnt = document.getElementById('mm-count');
  const thumbs = document.getElementById('mm-thumbs');
  let back = null, cur = 0, shots = [];

  const show = i => {
    cur = (i + shots.length) % shots.length;
    img.src = shots[cur] + '.jpg';
    cnt.textContent = `${cur + 1} / ${shots.length}`;
    thumbs.querySelectorAll('img').forEach((t, k) => t.classList.toggle('on', k === cur));
  };
  const open = i => {
    const d = M[i];
    if (!d) return;
    shots = d.shots;
    document.getElementById('mm-name').textContent = d.name;
    document.getElementById('mm-for').textContent = d.forw;
    document.getElementById('mm-why').textContent = d.why;
    img.alt = d.name;
    thumbs.innerHTML = shots.map((s, k) =>
      `<img src="${s}_s.jpg" alt="" loading="lazy" decoding="async" data-k="${k}">`).join('');
    thumbs.querySelectorAll('img').forEach(t =>
      t.addEventListener('click', () => show(+t.dataset.k)));
    show(0);
    mmod.hidden = false;
    document.body.style.overflow = 'hidden';
    mmod.querySelector('.wclose').focus();
  };
  const close = () => {
    mmod.hidden = true;
    document.body.style.overflow = '';
    if (back) { back.focus(); back = null; }
  };

  document.querySelectorAll('.mcell').forEach(cell => {
    const go = () => { back = cell; open(+cell.dataset.i); };
    cell.addEventListener('click', go);
    cell.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
    });
  });
  mmod.querySelector('.warr.p').addEventListener('click', () => show(cur - 1));
  mmod.querySelector('.warr.n').addEventListener('click', () => show(cur + 1));
  mmod.querySelector('.wclose').addEventListener('click', close);
  mmod.addEventListener('click', e => { if (e.target === mmod) close(); });
  addEventListener('keydown', e => {
    if (mmod.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(cur - 1);
    if (e.key === 'ArrowRight') show(cur + 1);
  });
}

/* ── окно проекта: крупный кадр, стрелки, лента миниатюр ── */
const wmod = document.getElementById('wmod');
const wraw = document.getElementById('wdata');
if (wmod && wraw) {
  const W = JSON.parse(wraw.textContent);
  const put = (id, v) => { document.getElementById(id).textContent = v; };
  const img = document.getElementById('wm-img');
  const cnt = document.getElementById('wm-count');
  const thumbs = document.getElementById('wm-thumbs');
  let back = null, cur = 0, shots = [];

  const show = i => {
    cur = (i + shots.length) % shots.length;
    img.src = shots[cur] + '.jpg';
    cnt.textContent = `${cur + 1} / ${shots.length}`;
    thumbs.querySelectorAll('img').forEach((t, k) => t.classList.toggle('on', k === cur));
  };

  const open = i => {
    const d = W[i];
    if (!d) return;
    shots = d.shots;
    put('wm-work', d.work);
    put('wm-car', d.car);
    put('wm-lead', d.lead);
    img.alt = d.work + ' — ' + d.car;
    thumbs.innerHTML = shots.map((s, k) =>
      `<img src="${s}_s.jpg" alt="" loading="lazy" decoding="async" data-k="${k}">`).join('');
    thumbs.querySelectorAll('img').forEach(t =>
      t.addEventListener('click', () => show(+t.dataset.k)));
    document.getElementById('wm-spec').innerHTML = d.spec
      .map(s => `<div><dt>${s[0]}</dt><dd>${s[1]}</dd></div>`).join('');
    put('wm-text', d.text);
    document.getElementById('wm-steps').innerHTML = (d.steps || [])
      .map((s, k) => `<span><i>${k + 1}</i>${s}</span>`).join('');
    show(0);
    wmod.hidden = false;
    document.body.style.overflow = 'hidden';
    wmod.querySelector('.wclose').focus();
  };
  const close = () => {
    wmod.hidden = true;
    document.body.style.overflow = '';
    if (back) { back.focus(); back = null; }
  };

  document.querySelectorAll('.wcell').forEach(cell => {
    const go = () => { back = cell; open(+cell.dataset.i); };
    cell.addEventListener('click', go);
    cell.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
    });
  });
  // кадр в строке прайса тоже открывает проект
  document.querySelectorAll('.sphoto[data-open]').forEach(a => {
    a.addEventListener('click', e => { e.preventDefault(); back = a; open(+a.dataset.open); });
  });

  wmod.querySelector('.warr.p').addEventListener('click', () => show(cur - 1));
  wmod.querySelector('.warr.n').addEventListener('click', () => show(cur + 1));
  wmod.querySelector('.wclose').addEventListener('click', close);
  wmod.addEventListener('click', e => { if (e.target === wmod) close(); });
  addEventListener('keydown', e => {
    if (wmod.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(cur - 1);
    if (e.key === 'ArrowRight') show(cur + 1);
  });
}
