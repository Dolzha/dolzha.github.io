/* Сборка по выбору Роберта (03.10, вторая правка). Общая для index / stil / fishki: страница собирается здесь,
   дополнительные слои (стили, фишки) подключаются своими скриптами через window.SB */
(function () {
  const D = window.D, B = window.BLOCKS, card = window.BLOCK_CARD;
  const stage = document.getElementById('stage');
  const qs = new URLSearchParams(location.search);
  const frame = qs.has('frame');
  if (frame) document.body.classList.add('frame');

  const ic = {
    arrow: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>',
    right: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>',
    check: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    prev: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
    next: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
  };
  const mark = '<svg class="mark" viewBox="0 0 32 32" aria-hidden="true"><rect x="5" y="7" width="22" height="16" rx="1.5"/><rect x="5" y="23.5" width="22" height="2.6" rx=".4"/><g class="eyes"><circle cx="12.5" cy="13" r="1.3"/><circle cx="19.5" cy="13" r="1.3"/></g><path d="M12.5 16.6c1 1.6 2.2 2.3 3.5 2.3s2.5-.7 3.5-2.3"/></svg>';
  const vbtn = (txt, href, cls = '', ext) => `<a class="vbtn ${cls}" href="${href}"${ext ? ' target="_blank" rel="noopener"' : ''}><span>${txt}</span>${ic.arrow}</a>`;
  const links = (arr) => arr.map(([h, t]) => `<a href="${h}">${t}</a>`).join('');

  // шапка: логотип по центру, фон варианта 2, ссылки и кнопка как в варианте 1
  const header = () => `
  <header class="hd hdc">
    <div class="wrap hdc-in">
      <nav class="hdc-l" aria-label="Разделы">${links(D.nav.slice(0, 3))}</nav>
      <a class="logo hdc-logo" href="#top" aria-label="Dolzha, на главную">${mark}<span class="wm">DOLZHA</span></a>
      <div class="hdc-r"><nav aria-label="Разделы">${links(D.nav.slice(3))}</nav>${vbtn('Обсудить проект', '#svyaz', 'hdc-cta')}</div>
      <button class="hd-burger" type="button" aria-label="Открыть меню" aria-expanded="false"><span></span><span></span></button>
    </div>
    <div class="hd-menu"><nav class="hd-mnav">${links(D.nav)}</nav>${vbtn('Обсудить проект', '#svyaz', 'hdc-cta')}</div>
  </header>`;

  // главная: вариант 1, карточки VEHA (сзади, выше) и NORDEN, крупнее, без подписей
  const heroCard = (k, cls) => { const w = D.works[k]; return `<a class="hc ${cls}" href="${w.url}" target="_blank" rel="noopener" aria-label="${w.name}, ${w.biz}"><span class="hc-shot"><img src="img/w/${k}.jpg" alt="Главная страница сайта ${w.name}" width="1600" height="1000"></span></a>`; };
  const hero = () => `
  <section class="hero" id="top">
    <div class="hero-bg" aria-hidden="true"><i></i><i></i><i></i></div>
    <div class="wrap hero-in">
      <div class="hero-copy">
        <p class="eyebrow">${D.hero.place}</p>
        <h1 class="h1">${D.hero.h1.map((l, i) => `<span class="l l${i + 1}">${l}</span>`).join(' ')}</h1>
        <p class="lead">${D.hero.lead}</p>
        <div class="actions"><a class="btn" href="${D.tg}" target="_blank" rel="noopener"><span>${D.hero.cta}</span>${ic.arrow}</a><a class="btn-2" href="#raboty"><span>${D.hero.cta2}</span>${ic.right}</a></div>
        <p class="note">${ic.check}<span>${D.hero.free}</span></p>
      </div>
      <div class="hero-vis">${heroCard('veha', 'hc-back')}${heroCard('norden', 'hc-front')}</div>
    </div>
  </section>`;

  // работы: Guru Motors крупно, справа VEHA сверху и NORDEN снизу, дальше по списку Роберта
  const works = () => `
  <section class="sec works" id="raboty">
    <div class="sec-bg" aria-hidden="true"></div>
    <div class="wrap">
      <div class="sec-head"><h2 class="h2">${D.worksHead}</h2><p class="sec-lead">${D.worksLead}</p></div>
      <div class="wk-feat">${card('gurumotors', 'big')}${card('veha', 'feat')}${card('norden', 'feat')}</div>
      <h3 class="wk-more-h">Ещё работы</h3>
      <div class="wk-more">${['bambini', 'garage', 'private', 'once', 'mentors', 'zest', 'porfume'].map(k => card(k, 'more')).join('')}</div>
    </div>
  </section>`;

  // услуги: вариант 2 (компактный список), крупнее и жирнее, как в варианте 3
  const rub = (s) => `${s.from ? '<small>от</small> ' : ''}${s.price}&nbsp;₽`;
  const services = () => `
  <section class="sec sv2 svc-v2 svc-big" id="uslugi">
    <div class="wrap sv2-wrap">
      <div class="sv2-head"><h2 class="h2">${D.svcHead}</h2><p class="sec-lead">${D.svcLead}</p></div>
      <div class="sv2-list">
        ${D.svc.map((s, i) => `
        <details class="sv2-it">
          <summary>
            <span class="sv2-n">${String(i + 1).padStart(2, '0')}</span>
            <span class="sv2-main"><span class="sv2-name">${s.name}</span><span class="sv2-line">${s.line}</span></span>
            <span class="sv2-days">${s.days}</span>
            <span class="sv2-price">${rub(s)}</span>
            <span class="sv2-ic" aria-hidden="true">${ic.arrow}</span>
          </summary>
          <div class="sv2-more">
            <p class="sv2-desc">${s.desc}</p>
            <div><p class="sv2-lbl">Что входит</p><ul class="ck">${s.inc.map(x => `<li>${ic.check}<span>${x}</span></li>`).join('')}</ul></div>
            ${vbtn('Обсудить проект', '#svyaz', 'sv2-go')}
          </div>
        </details>`).join('')}
      </div>
      <div class="sv2-extra">
        <span class="sv2-extra-h">Дополнительно</span>
        <ul>${D.extras.map(([t, p]) => `<li><span>${t}</span><b>${p}&nbsp;₽</b></li>`).join('')}</ul>
        ${vbtn('Открыть прайс-лист', D.price, 'sv2-pdf', true)}
      </div>
    </div>
  </section>`;

  // обо мне: вариант 2 (фото веером), стек без Vercel, нижняя строка закрыта чертой
  const car = (cls = '') => `
    <div class="car ${cls}" data-car>
      <div class="car-track">${D.photos.map(([src, alt], i) => `<img src="${src}" alt="${alt}" loading="lazy" class="${i === 0 ? 'on' : ''}">`).join('')}</div>
      <button class="car-b car-prev" type="button" aria-label="Предыдущее фото">${ic.prev}</button>
      <button class="car-b car-next" type="button" aria-label="Следующее фото">${ic.next}</button>
      <div class="car-dots">${D.photos.map((_, i) => `<button type="button" aria-label="Фото ${i + 1}"${i === 0 ? ' aria-current="true"' : ''}></button>`).join('')}</div>
    </div>`;
  const about = () => {
    const A = D.about;
    return `
  <section class="sec ab2 ab-v2" id="obo-mne">
    <div class="wrap ab2-grid">
      ${car('car-stack')}
      <div class="ab2-txt">
        <h2 class="h2">${A.h}</h2><p class="ab-p">${A.p}</p><p class="ab-p2">${A.p2}</p>
        <dl class="ab-facts">${A.facts.map(([n, l]) => `<div><dt>${n}</dt><dd>${l}</dd></div>`).join('')}</dl>
        <p class="ab2-lbl">${D.stackLabel}</p><dl class="ab2-list">${D.stack.map(([t, d]) => `<div><dt>${t}</dt><dd>${d}</dd></div>`).join('')}</dl>
        <div class="actions">${vbtn(D.hero.cta, D.tg, '', true)}</div>
      </div>
    </div>
  </section>`;
  };

  function render() {
    stage.innerHTML = `
      ${header()}
      <div class="mix t1 m-hero" data-blk="hero">${hero()}</div>
      <div class="mix t2 m-works" data-blk="works">${works()}</div>
      <div class="mix m-svc" data-blk="svc">${services()}</div>
      <div class="mix t3 m-ap" data-blk="ap">${B.approach(3)}</div>
      <div class="mix m-ab" data-blk="ab">${about()}</div>
      <div class="mix t2 m-faq" data-blk="faq">${B.faq(2)}</div>
      <div class="mix t2 m-ct" data-blk="ct">${B.contact(2)}</div>
      <div class="mix t4 m-ft" data-blk="ft">${B.footer(4)}</div>`;
    // кнопки варианта 1: обратная связь и «Вопросы»
    stage.querySelectorAll('.m-ct .btn, .m-faq .btn-2').forEach(b => { b.classList.remove('btn', 'btn-2'); b.classList.add('vbtn'); });
    wire();
  }

  function wire() {
    const hd = stage.querySelector('.hdc');
    const b = hd.querySelector('.hd-burger');
    b.addEventListener('click', () => {
      const open = hd.classList.toggle('open');
      b.setAttribute('aria-expanded', open);
      b.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    });
    if (frame && qs.has('open')) hd.classList.add('open');
    stage.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const el = id === 'top' ? null : document.getElementById(id);
      e.preventDefault();
      hd.classList.remove('open');
      window.scrollTo({ top: el ? el.getBoundingClientRect().top + scrollY - 76 : 0, behavior: 'smooth' });
    }));
    stage.querySelectorAll('[data-form]').forEach(f => f.addEventListener('submit', e => {
      e.preventDefault();
      if (f.reportValidity()) f.querySelector('.ct-done').hidden = false;
    }));
    stage.querySelectorAll('[data-car]').forEach(carousel);
  }

  function carousel(c) {
    const imgs = [...c.querySelectorAll('.car-track img')];
    const dots = [...c.querySelectorAll('.car-dots button')];
    let i = 0, timer;
    const show = (k) => {
      i = (k + imgs.length) % imgs.length;
      imgs.forEach((im, j) => { im.classList.toggle('on', j === i); im.style.setProperty('--k', (j - i + imgs.length) % imgs.length); });
      dots.forEach((d, j) => d.toggleAttribute('aria-current', j === i));
    };
    c.querySelector('.car-prev').addEventListener('click', () => show(i - 1));
    c.querySelector('.car-next').addEventListener('click', () => show(i + 1));
    dots.forEach((d, j) => d.addEventListener('click', () => show(j)));
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const play = () => { if (!reduce) timer = setInterval(() => show(i + 1), 5000); };
    c.addEventListener('mouseenter', () => clearInterval(timer));
    c.addEventListener('mouseleave', play);
    show(0); play();
  }

  window.addEventListener('scroll', () => { const hd = stage.querySelector('.hdc'); hd && hd.classList.toggle('is-scrolled', scrollY > 10); }, { passive: true });

  // инструмент: ссылки на соседние страницы и просмотр на телефоне (не часть дизайна)
  function tool(extra = '') {
    if (frame) return null;
    const page = document.body.dataset.page || 'index';
    const t = document.createElement('div');
    t.className = 'tool tool-sb';
    t.setAttribute('role', 'region'); t.setAttribute('aria-label', 'Страницы сборки');
    const pages = [['index', 'Сборка'], ['stil', 'Стили'], ['fishki', '15 фишек'], ['logo', 'Логотипы']];
    t.innerHTML = pages.map(([p, n]) => `<a href="${p}.html" class="tool-pg"${p === page ? ' aria-current="page"' : ''}>${n}</a>`).join('') + extra + '<button type="button" class="tool-phone">Телефон</button>';
    document.body.appendChild(t);
    const ph = document.createElement('div');
    ph.className = 'phone'; ph.hidden = true;
    ph.innerHTML = '<div class="phone-in"><iframe title="Просмотр на телефоне"></iframe></div><button class="phone-x" type="button">Закрыть</button>';
    document.body.appendChild(ph);
    ph.addEventListener('click', e => { if (e.target === ph || e.target.classList.contains('phone-x')) ph.hidden = true; });
    t.querySelector('.tool-phone').addEventListener('click', () => {
      ph.querySelector('iframe').src = page + '.html?frame=1' + location.hash;
      ph.hidden = false;
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') ph.hidden = true; });
    return t;
  }

  render();
  window.SB = { stage, frame, ic, mark, vbtn, tool };
  if (!document.body.dataset.page) tool();
})();
