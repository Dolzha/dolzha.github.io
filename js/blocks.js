/* Шаблоны блоков. Каркас один (тёмная v0-2), вариант t = 1..5 меняет обёртку через CSS-класс .tN */
(function () {
  const D = window.D;
  const ic = {
    arrow: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>',
    right: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>',
    check: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    tg: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 4 3 11l6 2.2M21 4l-3.2 16-8.8-6.8M21 4 9 13.2V19l3.2-3.4"/></svg>',
  };
  const mark = '<svg class="mark" viewBox="0 0 32 32" aria-hidden="true"><rect x="5" y="7" width="22" height="16" rx="1.5"/><rect x="5" y="23.5" width="22" height="2.6" rx=".4"/><g class="eyes"><circle cx="12.5" cy="13" r="1.3"/><circle cx="19.5" cy="13" r="1.3"/></g><path d="M12.5 16.6c1 1.6 2.2 2.3 3.5 2.3s2.5-.7 3.5-2.3"/></svg>';
  const logo = (cls = '') => `<a class="logo ${cls}" href="#top" aria-label="Dolzha, на главную">${mark}<span class="wm">DOLZHA</span></a>`;
  const tgBtn = (cls = 'btn') => `<a class="${cls}" href="${D.tg}" target="_blank" rel="noopener"><span>${D.hero.cta}</span>${ic.arrow}</a>`;
  const nav = (cls) => `<nav class="${cls}" aria-label="Разделы">${D.nav.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}</nav>`;
  const rub = (p, from) => `${from ? '<small>от</small> ' : ''}${p}&nbsp;₽`;

  // mode: big (крупная слева, кадр выше экрана), feat (справа), more (сетка «Ещё работы»)
  function card(k, mode) {
    const w = D.works[k], big = mode === 'big';
    const src = big ? `${k}-tall` : mode === 'feat' ? k : `${k}-s`;
    return `<a class="wk wk-${k} wk--${mode}" href="${w.url}" target="_blank" rel="noopener">
      <span class="wk-bar"><span class="wk-url">${w.show}</span><span class="wk-dim">${big ? '1440×1500' : '1440×900'}</span></span>
      <span class="wk-shot"><img src="img/w/${src}.jpg" alt="Главная страница сайта ${w.name}" loading="lazy" width="1440" height="${big ? 1500 : 900}"></span>
      <span class="wk-meta">
        <span class="wk-ico" aria-hidden="true">${w.name[0]}</span>
        <span class="wk-txt"><b class="wk-name">${w.name}</b><span class="wk-biz">${w.biz}</span></span>
        <span class="wk-tags">${w.tags.map(t => `<span>${t}</span>`).join('')}</span>
        <span class="wk-go">${ic.arrow}</span>
      </span>
    </a>`;
  }

  const B = {};

  B.header = (t) => `
  <header class="hd">
    <div class="wrap hd-in">
      ${logo()}
      ${nav('hd-nav')}
      <a class="btn hd-cta" href="#svyaz"><span>Обсудить проект</span>${ic.arrow}</a>
      <button class="hd-burger" type="button" aria-label="Открыть меню" aria-expanded="false"><span></span><span></span></button>
    </div>
    <div class="hd-menu">${nav('hd-mnav')}<a class="btn" href="#svyaz"><span>Обсудить проект</span>${ic.arrow}</a></div>
  </header>`;

  B.hero = (t) => {
    const lines = (t === 2 || t === 4) ? D.hero.h1b : D.hero.h1;
    const wz = D.works.worldzero, no = D.works.norden;
    return `
  <section class="hero" id="top">
    <div class="hero-bg" aria-hidden="true"><i></i><i></i><i></i></div>
    <div class="wrap hero-in">
      <div class="hero-copy">
        <p class="eyebrow">${D.hero.place}</p>
        <h1 class="h1">${lines.map((l, i) => `<span class="l l${i + 1}">${l}</span>`).join(' ')}</h1>
        <p class="lead">${D.hero.lead}</p>
        <div class="actions">${tgBtn()}<a class="btn-2" href="#raboty"><span>${D.hero.cta2}</span>${ic.right}</a></div>
        <p class="note">${ic.check}<span>${D.hero.free}</span></p>
      </div>
      <div class="hero-vis">
        <a class="hc hc-back" href="${wz.url}" target="_blank" rel="noopener">
          <span class="hc-shot"><img src="img/w/worldzero.jpg" alt="Главная страница сайта ${wz.name}" width="1600" height="1000"></span>
          <span class="hc-tag"><b>${wz.name}</b><span>${wz.biz}</span></span>
        </a>
        <a class="hc hc-front" href="${no.url}" target="_blank" rel="noopener">
          <span class="hc-shot"><img src="img/w/norden.jpg" alt="Главная страница сайта ${no.name}" width="1600" height="1000"></span>
          <span class="hc-tag"><b>${no.name}</b><span>${no.biz}</span></span>
        </a>
      </div>
    </div>
    <div class="strip"><div class="wrap strip-in"><span class="strip-h">Входит в любой сайт</span>${D.included.map(x => `<span class="strip-i">${x}</span>`).join('')}<span class="strip-end">${D.hero.load}</span></div></div>
  </section>`;
  };

  B.works = (t) => `
  <section class="sec works" id="raboty">
    <div class="sec-bg" aria-hidden="true"></div>
    <div class="wrap">
      <div class="sec-head"><h2 class="h2">${D.worksHead}</h2><p class="sec-lead">${D.worksLead}</p></div>
      <div class="wk-feat">${card('norden', 'big')}${card('worldzero', 'feat')}${card('veha', 'feat')}</div>
      <h3 class="wk-more-h">Ещё работы</h3>
      <div class="wk-more">${D.more.map(k => card(k, 'more')).join('')}</div>
    </div>
  </section>`;

  B.services = (t) => `
  <section class="sec svc" id="uslugi">
    <div class="sec-bg" aria-hidden="true"></div>
    <div class="wrap">
      <div class="sec-head"><h2 class="h2">Услуги и цены</h2><p class="sec-lead">${D.servicesLead}</p></div>
      <div class="sv-list">
        ${D.services.map((s, i) => `
        <article class="sv sv-${s.key}">
          <div class="sv-a">
            <span class="sv-n">${String(i + 1).padStart(2, '0')}</span>
            <h3 class="sv-name">${s.name}</h3>
            <p class="sv-price">${rub(s.price, s.from)}</p>
            <p class="sv-days">${s.days}</p>
          </div>
          <div class="sv-b"><p class="sv-lbl">Подходит для</p><p class="sv-fit">${s.fit}</p></div>
          <div class="sv-c"><p class="sv-lbl">Что входит</p><ul class="ck">${s.inc.map(x => `<li>${ic.check}<span>${x}</span></li>`).join('')}</ul></div>
          <a class="sv-go" href="#svyaz" aria-label="Обсудить: ${s.name}">${ic.arrow}</a>
        </article>`).join('')}
      </div>
      <div class="sv-every">
        <div class="sv-every-h"><h3 class="h3">Входит в любой сайт</h3><p>Включено в стоимость лендинга, многостраничного сайта и сайта с каталогом.</p></div>
        <ul class="ck ck-2">${D.everySite.map(x => `<li>${ic.check}<span>${x}</span></li>`).join('')}</ul>
      </div>
      <div class="sv-row2">
        <div class="sv-extra">
          <h3 class="h3">Дополнительно</h3><p class="sv-sub">Подключается к любому виду сайта и оплачивается отдельно.</p>
          <ul>${D.extras.map(([n, p, d]) => `<li><div class="ex-top"><b>${n}</b><span class="ex-p">${p}&nbsp;₽</span></div><p>${d}</p></li>`).join('')}</ul>
        </div>
        <div class="sv-pay">
          <h3 class="h3">Оплата</h3><p class="sv-sub">Оплата частями, каждая привязана к этапу работы.</p>
          ${D.pay.map(p => `
          <div class="pay">
            <div class="pay-ring" style="--a:${p.parts[0][0]};--b:${p.parts[0][0] + (p.parts[1] ? p.parts[1][0] : 0)}"><span>${p.split}</span></div>
            <div class="pay-txt"><b>${p.when}</b>
              <div class="pay-bar">${p.parts.map(([v]) => `<i style="flex:${v}"></i>`).join('')}</div>
              <ul>${p.parts.map(([v, d]) => `<li><b>${v}%</b> ${d}</li>`).join('')}</ul>
            </div>
          </div>`).join('')}
          <p class="sv-note">${D.payNote}</p>
        </div>
      </div>
      <p class="sv-note sv-days-note">${D.daysNote}</p>
    </div>
  </section>`;

  B.approach = (t) => `
  <section class="sec appr" id="podhod">
    <div class="sec-bg" aria-hidden="true"></div>
    <div class="wrap">
      <div class="sec-head"><h2 class="h2">${D.approachHead}</h2><p class="sec-lead">${D.approachLead}</p></div>
      <ol class="ap-steps">${D.steps.map(([h, p], i) => `<li class="ap"><span class="ap-n">${String(i + 1).padStart(2, '0')}</span><h3 class="ap-h">${h}</h3><p>${p}</p></li>`).join('')}</ol>
      <div class="ap-call">
        <h3 class="ap-call-h">${D.preview.h}</h3>
        <p>${D.preview.p}</p>
        <a class="btn btn-inv" href="#svyaz"><span>${D.preview.btn}</span>${ic.arrow}</a>
      </div>
    </div>
  </section>`;

  B.about = (t) => `
  <section class="sec about" id="obo-mne">
    <div class="sec-bg" aria-hidden="true"></div>
    <div class="wrap ab-in">
      <figure class="ab-ph"><img src="${D.about.photo}" alt="Dolzha, веб-разработчик из Екатеринбурга" loading="lazy" width="640" height="640"><figcaption>Екатеринбург</figcaption></figure>
      <div class="ab-txt">
        <h2 class="h2">${D.about.h}</h2>
        <p class="ab-p">${D.about.p}</p>
        <p class="ab-p2">${D.about.p2}</p>
        <dl class="ab-facts">${D.about.facts.map(([n, l]) => `<div><dt>${n}</dt><dd>${l}</dd></div>`).join('')}</dl>
        <div class="actions">${tgBtn()}</div>
      </div>
    </div>
  </section>`;

  B.faq = (t) => `
  <section class="sec faq" id="voprosy">
    <div class="sec-bg" aria-hidden="true"></div>
    <div class="wrap fq-in">
      <div class="fq-head"><h2 class="h2">Вопросы</h2><p class="sec-lead">Ответы на частые вопросы. Не нашли свой, спросите в Telegram.</p>${tgBtn('btn-2')}</div>
      <div class="fq-list">${D.faq.map(([q, a], i) => `<details class="fq"${i === 0 ? ' open' : ''}><summary><span class="fq-n">${String(i + 1).padStart(2, '0')}</span><span class="fq-q">${q}</span><i class="fq-ic" aria-hidden="true"></i></summary><div class="fq-a"><p>${a}</p></div></details>`).join('')}</div>
    </div>
  </section>`;

  B.contact = (t) => `
  <section class="sec contact" id="svyaz">
    <div class="sec-bg" aria-hidden="true"><i></i><i></i></div>
    <div class="wrap ct-in">
      <div class="ct-copy">
        <h2 class="h2 ct-h"><span class="l l1">${D.contact.h[0]}</span> <span class="l l2">${D.contact.h[1]}</span></h2>
        <p class="ct-p">${D.contact.p}</p>
        ${tgBtn()}
        <ul class="ct-links">
          <li><span>Telegram</span><a href="${D.tg}" target="_blank" rel="noopener">${D.tgName}</a></li>
          <li><span>Почта</span><a href="mailto:${D.mail}">${D.mail}</a></li>
        </ul>
        <p class="ct-quote">${D.contact.quote}</p>
      </div>
      <form class="ct-form" action="#" data-form>
        <h3 class="ct-form-h">Оставить заявку</h3>
        ${D.contact.fields.map(([id, l, ph]) => `<label class="fld"><span>${l}</span>${id === 'task' ? `<textarea name="${id}" rows="3" placeholder="${ph}" required></textarea>` : `<input name="${id}" placeholder="${ph}" required autocomplete="${id === 'name' ? 'name' : 'off'}">`}</label>`).join('')}
        <button class="btn" type="submit"><span>${D.contact.send}</span>${ic.arrow}</button>
        <div class="ct-done" hidden>${ic.check}<b>${D.contact.done}</b><p>${D.contact.doneP}</p></div>
      </form>
    </div>
  </section>`;

  B.footer = (t) => `
  <footer class="ft">
    <div class="wrap">
      <div class="ft-top">
        <div class="ft-brand">${logo('logo-ft')}<p>${D.footer.p}</p></div>
        <div class="ft-col"><p class="ft-h">Разделы</p>${nav('ft-nav')}</div>
        <div class="ft-col"><p class="ft-h">Связь</p>
          <a href="${D.tg}" target="_blank" rel="noopener">Telegram ${D.tgName}</a>
          <a href="mailto:${D.mail}">${D.mail}</a>
          <a href="${D.github}" target="_blank" rel="noopener">github.com/Dolzha</a>
          <a href="${D.price}" target="_blank" rel="noopener">Прайс-лист, PDF</a>
        </div>
      </div>
      <div class="ft-big" aria-hidden="true">DOLZHA</div>
      <div class="ft-bot"><span>${D.footer.copy}</span><span class="ft-geo">56.8389° N, 60.6057° E, Екатеринбург</span><a href="#top">Наверх</a></div>
    </div>
  </footer>`;

  window.BLOCKS = B;
  window.BLOCK_CARD = card;
  window.BLOCK_ORDER = [
    ['shapka', 'header', 'Шапка'],
    ['glavnaya', 'hero', 'Главная'],
    ['raboty', 'works', 'Работы'],
    ['uslugi', 'services', 'Услуги и цены'],
    ['podhod', 'approach', 'Подход'],
    ['obo-mne', 'about', 'Обо мне'],
    ['voprosy', 'faq', 'Вопросы'],
    ['svyaz', 'contact', 'Обратная связь'],
    ['futer', 'footer', 'Футер'],
  ];
  window.THEMES = {
    1: { name: 'Графит', ref: 'resn.co.nz', note: 'Geologica, графитовый фон с диагональными плоскостями, фирменный зелёный из логотипа' },
    2: { name: 'Прайс', ref: 'surf.ru + прайс-лист', note: 'Golos Text и IBM Plex Mono, светлый фон с сиреневым свечением, пастель как в PDF' },
    3: { name: 'Витрина', ref: 'dribbble.com + glitch', note: 'Wix Madefor, белый фон, тёмно-синие кнопки-пилюли, малиновый акцент' },
    4: { name: 'Небо', ref: 'calltoidea.com', note: 'Manrope, насыщенный синий с облаками, белые карточки, жёлтый свет маяка' },
    5: { name: 'Чертёж', ref: 'свои работы: World Zero', note: 'Martian Mono и Sofia Sans, сетка чертежа, янтарный акцент, размеры на карточках' },
  };
  window.THEME_FONTS = {
    1: 'family=Geologica:wght@300;400;500;600',
    2: 'family=Golos+Text:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500',
    3: 'family=Wix+Madefor+Display:wght@600;700;800&family=Wix+Madefor+Text:wght@400;500;600;700',
    4: 'family=Manrope:wght@300;400;500;600;700;800',
    5: 'family=Martian+Mono:wght@300;400;500;600&family=Sofia+Sans:wght@400;500;600;700',
  };
})();
