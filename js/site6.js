/* Сайт, шестой круг (03.10). Выбор Роберта зафиксирован: тема 5 «Лес», карточки 2 «Без рамки», обложки 5, пунктир.
   Фишки: 1, 2, 4, 9, 10 (прокрутка при наведении), 13, 14, B, N8. Новое: подробная карточка работы ×5, допы ×5, форма ×2, светлая главная. */
(function () {
  const SB = window.SB, st = SB.stage, D = window.D, ic = SB.ic, body = document.body;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer:fine)').matches;
  const ss = { get: k => { try { return sessionStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { sessionStorage.setItem(k, v); } catch (e) {} } };
  const ls = { get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} } };
  const $ = (s, r = st) => r.querySelector(s), $$ = (s, r = st) => [...r.querySelectorAll(s)];
  const NAMES = Object.fromEntries(Object.entries(D.works).map(([k, w]) => [k, w.name]));

  // описание работ для подробной карточки: только то, что видно на самих сайтах
  const INFO = {
    gurumotors: 'Сайт автосервиса и чип-тюнинга в Тюмени. Разделы: услуги, диностенд, замеры, работы, отзывы и заявка. Цены и тексты владелец меняет сам в панели управления, заявки приходят в Telegram.',
    veha: 'Сайт застройщика. Проекты, подбор квартир по параметрам, ипотечный калькулятор и акции. Главный экран с крупной фотографией дома.',
    norden: 'Сайт ателье тюнинга. Работы, материалы, команда, услуги, вопросы, отзывы и заявка. Направления «Двигатель», «Салон» и «Стиль» сразу на первом экране.',
    bambini: 'Сайт частного детского сада в Екатеринбурге. Фото, цены, отзывы и запись на просмотр. Тексты и цены меняются в панели управления.',
    garage: 'Сайт автосервиса полного цикла. Услуги, онлайн-запись, отзывы и контакты. Кнопки записи и звонка на первом экране.',
    private: 'Многостраничный сайт художницы: собрание работ, выставка и журнал. Спокойная галерея, где главное картины.',
    once: 'Сайт магазина винтажной одежды в Екатеринбурге. Каталог вещей, адрес и телефон на первом экране, заявка с сайта.',
    mentors: 'Многостраничный сайт юридической фирмы. Услуги, команда, дела и страница о компании, заявка на консультацию.',
    zest: 'Сайт кофейни. Меню, страница о заведении и контакты, кнопка «Забронировать стол».',
    porfume: 'Интернет-магазин парфюмерии. Новинки, товары, скидки и корзина.',
  };
  const ORDER = ['gurumotors', 'veha', 'norden', 'bambini', 'garage', 'private', 'once', 'mentors', 'zest', 'porfume'];
  window.WINFO = INFO; // описания работ нужны вариантам блока «Работы» (site12.js)

  // ---------- варианты ----------
  // фишки, которые Роберт выключил: их стили из site5.css гасим классами
  body.classList.add('off-n1', 'off-n2', 'off-n3', 'off-n4', 'off-n5', 'off-n6', 'off-n7', 'off-n9', 'off-n10', 'off-11', 'off-a');
  // выбор Роберта 03.10: главная светлая + карточки за курсором + перелив акцентного текста, карточка 1, допы 2,
  // форма «по одному вопросу» со шагами с подписями, фон главной «Аврора», кнопки по блокам (site8.css), «Обсудить» = «Печатает…».
  const VAR = { dm: 1, dop: 2, form: 1, hbg: 1 };
  const dmv = () => window.DMV || VAR.dm; // вид подробной карточки работы выбирается на панели (site14)
  body.classList.add('fb-3');
  let hbgRun = null;
  const applyVars = () => {
    st.className = `stage styled s1 th tg5 hero-light ha-4 ha-txt hbg-${VAR.hbg}`;
    if (hbgRun) hbgRun();
    if (typeof renderForm === 'function') renderForm();
    $('#raboty').classList.add('wv-2');
    const x = $('.sv2-extra'); x.className = 'sv2-extra ex-' + VAR.dop;
    const a = $('.m-ap .ap-steps'); a.className = a.className.replace(/\b(cv|sp)-\d/g, '') + ' cv-5 sp-4';
  };

  // ---------- шапка: новый логотип (круг-иллюстрация) ----------
  const LOGO = '<svg class="lg6" viewBox="0 0 52 52" aria-hidden="true"><defs><linearGradient id="lgGr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#B5E853"/><stop offset="1" stop-color="#11998E"/></linearGradient></defs><circle cx="26" cy="26" r="25" class="l6c"/><path d="M3 34c8-7 15 3 23-3s15-3 24 1v4a25 25 0 0 1-47 0z" class="l6h"/><g transform="translate(10.36 12.66) scale(.92)"><g class="l6b"><rect width="34" height="23" rx="3.5" class="l6l"/><rect x="-3" y="24.5" width="40" height="4.5" rx="2" class="l6l"/><g class="l6f"><circle cx="11" cy="10" r="2.3"/><circle cx="23" cy="10" r="2.3"/></g><path d="M11 15c2 3 4.5 4 6 4s4-1 6-4" class="l6m"/></g></g></svg>';
  $$('.logo').forEach(l => { l.querySelector('.mark').outerHTML = LOGO; l.querySelector('.wm').textContent = 'Dolzha'; });

  // ---------- работы: подпись под заголовком ----------
  const wsec = $('#raboty');
  $('.sec-head', wsec).classList.add('wk-head');

  // ---------- допы: заново, 5 новых вариантов ----------
  const XI = ['M10 11h20v14H10zM10 15h20M14 19h6M14 22h9', 'M12 9h12l4 4v18H12zM24 9v4h4M16 19h8M16 23h8', 'M11 12h18v16H11zM11 17h18M16 9v5M24 9v5M15 22h3M22 22h3', 'M18 25a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM23 23l6 6M15 18h6'];
  $('.sv2-extra').outerHTML = `<div class="sv2-extra"><div class="xh"><h3 class="xt">Дополнительно</h3><p class="xs">Подключается к любому виду сайта и оплачивается отдельно.</p></div><ul class="xl">${D.extras.map(([t, p, d], i) => `<li class="xi" data-p="${p.replace(/\s/g, '')}"><span class="xic" aria-hidden="true"><svg viewBox="0 0 40 40"><path d="${XI[i]}"/></svg></span><span class="xn">${t}</span><span class="xd">${d}</span><b class="xp">${p}&nbsp;₽</b><button type="button" class="xadd" aria-pressed="false" aria-label="Добавить: ${t}"><span>Добавить</span></button></li>`).join('')}</ul><div class="xsum" aria-live="polite"><span>Выбрано допов на</span><b>0 ₽</b></div>${SB.vbtn('Открыть прайс-лист', D.price, 'sv2-pdf', true)}</div>`;
  const xsum = $('.xsum b');
  $$('.xadd').forEach(b => b.addEventListener('click', () => {
    const on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', on); b.closest('.xi').classList.toggle('sel', on);
    b.querySelector('span').textContent = on ? 'Добавлено' : 'Добавить';
    const sum = $$('.xi.sel').reduce((s, li) => s + +li.dataset.p, 0); xsum.textContent = sum.toLocaleString('ru-RU') + ' ₽';
  }));

  // ---------- 13-14. панели «Входит»: иконки, светлый круг впереди, тёмный позади ----------
  const P = {
    text: 'M12 14h12M12 19h14M12 24h9', phone: 'M14.5 10.5h7a1.8 1.8 0 0 1 1.8 1.8v15.4a1.8 1.8 0 0 1-1.8 1.8h-7a1.8 1.8 0 0 1-1.8-1.8V12.3a1.8 1.8 0 0 1 1.8-1.8zM17 26.5h2',
    send: 'M10.5 19.5 26 13l-4.5 15-4-5.5-7-3zM17.5 22.5 26 13', star: 'M18 11l2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.5 5-.7z',
    search: 'M17 23.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM21 21.5l4.5 4.5', chart: 'M12 27v-6M17.5 27V13M23 27v-9',
    pin: 'M18 29s-6.5-6-6.5-10.5a6.5 6.5 0 0 1 13 0C24.5 23 18 29 18 29zM18 20.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z', lock: 'M12.5 18.5h11v9h-11zM14.8 18.5v-3a3.2 3.2 0 0 1 6.4 0v3',
    shield: 'M18 10.5l7 3v5c0 5-3 8.2-7 10-4-1.8-7-5-7-10v-5z', cal: 'M11.5 13h13v13h-13zM11.5 17.5h13M15 10.5v4M21 10.5v4',
    pen: 'M12 27l1.5-5.5 9-9 4 4-9 9zM20.5 14.5l4 4', clock: 'M18 27.5a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15zM18 16.5V20l2.8 1.8',
  };
  // иконки: круг с переливом (слева розовый -> фиолетовый, справа зелёный -> синий), пиктограмма точно по центру
  body.insertAdjacentHTML('afterbegin', '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="icoA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FF6FA5"/><stop offset="1" stop-color="#7B5CFF"/></linearGradient><linearGradient id="icoB" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7BDB6E"/><stop offset="1" stop-color="#2F7BFF"/></linearGradient></defs></svg>');
  const cIcon = (k) => `<svg class="cico" viewBox="0 0 40 40" aria-hidden="true"><circle class="ci-c" cx="20" cy="20" r="18"/><path class="ci-p" d="${P[k]}"/></svg>`;
  const centerIcons = (root) => root.querySelectorAll('.cico .ci-p').forEach(p => { const b = p.getBBox(); p.style.transform = `translate(${(20 - (b.x + b.width / 2)).toFixed(2)}px,${(20 - (b.y + b.height / 2)).toFixed(2)}px)`; });
  const G1 = [['text', 'Тексты для сайта по вашим услугам и отзывам клиентов'], ['phone', 'Адаптивная вёрстка под телефон, планшет и компьютер'], ['send', 'Заявки с сайта приходят вам в Telegram'], ['star', 'Отзывы клиентов из 2ГИС на сайте'], ['cal', 'Кнопка онлайн-записи YClients или DIKIDI, если вы ими пользуетесь'], ['shield', 'Политика и согласие по 152-ФЗ, страницы «Спасибо» и 404']];
  const G2 = [['search', 'Настройка под поиск Яндекса и Google: Вебмастер, Search Console, карта сайта'], ['chart', 'Яндекс Метрика: статистика посещений и заявок'], ['pin', 'Ссылка на сайт в ваших карточках 2ГИС и Яндекса'], ['lock', 'Подключение домена, SSL-сертификат, публикация'], ['pen', 'Один вариант дизайна и 2 круга правок'], ['clock', 'Месяц мелких правок после запуска']];
  const rows = (g) => `<ul class="inc-rows">${g.map(([k, t]) => `<li>${cIcon(k)}<span>${t}</span></li>`).join('')}</ul>`;
  wsec.closest('[data-blk]').insertAdjacentHTML('afterend', `
  <div class="mix f13 fsec" data-blk="inc"><section class="sec inc-sec" id="vhodit">
    <div class="wrap">
      <div class="sec-head"><h2 class="h2">Входит в любой сайт</h2></div>
      <div class="inc-grid">
        <div class="inc-p inc-p1"><h3 class="inc-h">Сам сайт</h3>${rows(G1)}</div>
        <div class="inc-p inc-p2"><h3 class="inc-h">Поиск и запуск</h3>${rows(G2)}</div>
      </div>
    </div>
  </section></div>`);

  // ---------- обложки шагов «Подход» ----------
  const SC = [
    '<rect class="b" width="160" height="100"/><rect class="s" x="20" y="18" width="78" height="28" rx="14"/><path class="s" d="M32 44l-8 11 18-9z"/><circle class="w" cx="40" cy="32" r="3.2"/><circle class="w" cx="52" cy="32" r="3.2"/><circle class="w" cx="64" cy="32" r="3.2"/><rect class="p" x="62" y="54" width="78" height="28" rx="14"/><path class="p" d="M128 80l8 9-17-8z"/><rect class="a" x="76" y="65" width="44" height="6" rx="3"/>',
    '<rect class="b" width="160" height="100"/><rect class="w" x="26" y="16" width="92" height="66" rx="8"/><path class="p" d="M26 24a8 8 0 0 1 8-8h76a8 8 0 0 1 8 8v4H26z"/><circle class="a" cx="35" cy="22" r="2.4"/><circle class="s" cx="43" cy="22" r="2.4"/><rect class="s" x="36" y="38" width="42" height="8" rx="4"/><rect class="l" x="36" y="51" width="30" height="5" rx="2.5"/><rect class="l" x="36" y="61" width="36" height="5" rx="2.5"/><rect class="a" x="86" y="38" width="24" height="30" rx="5"/><path class="p" d="M110 78l20-20 7 7-20 20-9 2z"/>',
    '<rect class="b" width="160" height="100"/><rect class="w" x="28" y="18" width="104" height="64" rx="10"/><path class="ps" d="M58 36 44 50l14 14M102 36l14 14-14 14"/><path class="as" d="M86 32 74 68"/>',
    '<rect class="b" width="160" height="100"/><rect class="w" x="22" y="18" width="70" height="64" rx="8"/><rect class="p" x="32" y="30" width="44" height="6" rx="3"/><rect class="l" x="32" y="43" width="36" height="5" rx="2.5"/><rect class="l" x="32" y="54" width="42" height="5" rx="2.5"/><rect class="l" x="32" y="65" width="28" height="5" rx="2.5"/><circle class="w2" cx="104" cy="48" r="19"/><circle class="ps" cx="104" cy="48" r="19"/><path class="ps" d="M118 62l14 14"/><path class="as" d="M95 48l6 6 11-12"/>',
    '<rect class="b" width="160" height="100"/><circle class="a" cx="34" cy="24" r="3"/><circle class="a" cx="128" cy="30" r="2.4"/><circle class="a" cx="118" cy="74" r="2"/><circle class="s" cx="40" cy="70" r="2.4"/><path class="w" d="M80 12c11 8 15 22 13 40H67c-2-18 2-32 13-40z"/><circle class="p" cx="80" cy="32" r="6"/><path class="p" d="M67 44l-9 12 10-3zM93 44l9 12-10-3z"/><path class="s" d="M71 52h18l-4 9h-10z"/><path class="a" d="M74 61h12l-6 15z"/>',
  ];
  $$('.m-ap .ap').forEach((li, i) => li.insertAdjacentHTML('afterbegin', `<div class="ap-cv"><svg class="ap-art" viewBox="0 0 160 100" aria-hidden="true">${SC[i]}</svg></div>`));

  // ---------- форма: вариант 2 = как на dolzha.github.io ----------
  const ctForm = $('.m-ct .ct-form');
  ctForm.insertAdjacentHTML('afterend', `<form class="ct-old" action="#" data-old><h3 class="ct-form-h">Оставить заявку</h3><label class="fld"><span>Ваше имя</span><input name="name" required autocomplete="name" placeholder="Как к вам обращаться?"></label><label class="fld"><span>Email</span><input name="email" type="email" required placeholder="email@example.com"></label><label class="fld"><span>Сообщение</span><textarea name="message" rows="5" required placeholder="Расскажите о вашем проекте..."></textarea></label><button class="vbtn" type="submit"><span>Отправить заявку</span>${ic.arrow}</button><div class="ct-done" hidden>${ic.check}<b>${D.contact.done}</b><p>${D.contact.doneP}</p></div></form>`);
  $('.ct-old').addEventListener('submit', e => { e.preventDefault(); if (e.target.reportValidity()) $('.ct-old .ct-done').hidden = false; });
  centerIcons(st);

  // ---------- шапка: пункты ближе к логотипу, кнопка отдельно справа ----------
  const hin = $('.hdc-in'), hcta = $('.hdc-r .hdc-cta');
  hin.insertAdjacentHTML('afterbegin', '<span class="hdc-sp" aria-hidden="true"></span>');
  hin.insertBefore(hcta, $('.hd-burger', hin)); hcta.classList.add('hdc-cta-x');

  // ---------- «Обо мне»: стрелки с кольцом и счётчик ----------
  const car = $('#obo-mne .car');
  const ring = '<svg class="cb-ring" viewBox="0 0 56 56" aria-hidden="true"><circle cx="28" cy="28" r="26.5"/></svg>';
  car.querySelector('.car-prev').innerHTML = ring + '<svg class="cb-ar" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>';
  car.querySelector('.car-next').innerHTML = ring + '<svg class="cb-ar" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  car.insertAdjacentHTML('beforeend', '<span class="car-cnt" aria-live="polite"><b>01</b> / ' + String(D.photos.length).padStart(2, '0') + '</span>');
  const cnt = car.querySelector('.car-cnt b'), imgs6 = [...car.querySelectorAll('.car-track img')];
  new MutationObserver(() => { const i = imgs6.findIndex(x => x.classList.contains('on')); cnt.textContent = String(i + 1).padStart(2, '0'); }).observe(car.querySelector('.car-track'), { attributes: true, subtree: true, attributeFilter: ['class'] });

  // ---------- форма заявки: 5 вариантов ----------
  const ctIn = $('.m-ct .ct-in');
  ctIn.insertAdjacentHTML('beforeend', '<div class="cf"></div>');
  const cf = $('.cf');
  const done = (t = 'Заявка отправлена', p = D.contact.doneP) => `<div class="cf-done">${ic.check}<b>${t}</b><p>${p}</p></div>`;
  const BIZ = ['Автосервис или тюнинг', 'Магазин', 'Салон или студия', 'Кафе или ресторан', 'Другое'];
  const NEED = ['Сайт-лендинг', 'Многостраничный сайт', 'Сайт с каталогом', 'Карточки Яндекс и 2ГИС', 'Пока не знаю'];
  // форма «по одному вопросу»: 5 сборок блока, у каждой свой индикатор шагов
  const QF = [['Как вас зовут?', 'Имя', 'name', 'Имя'], ['Чем занимаетесь?', 'Например, автосервис', 'biz', 'Бизнес'], ['Что нужно сделать?', 'Например, лендинг с записью', 'task', 'Задача'], ['Как с вами связаться?', '@telegram или телефон', 'contact', 'Контакт']];
  const QI = ['<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>', '<svg viewBox="0 0 24 24"><path d="M4 8h16v11H4zM9 8V5h6v3"/></svg>', '<svg viewBox="0 0 24 24"><path d="M5 19l1.5-5L16 4.5l3.5 3.5L10 17.5zM14 6.5l3.5 3.5"/></svg>', '<svg viewBox="0 0 24 24"><path d="M21 3 3 10.5l7 2.5 2.5 7z"/></svg>'];
  function renderForm() {
    const n = VAR.form, N = QF.length;
    const pg = {
      1: `<ol class="pg1">${QF.map((q, i) => `<li><button type="button" class="pg1-b" data-i="${i}" tabindex="-1"><span class="pg1-d">${i + 1}</span><span class="pg1-l">${q[3]}</span></button></li>`).join('')}</ol>`,
      2: `<div class="pg2"><svg viewBox="0 0 64 64" aria-hidden="true"><circle class="pg2-bg" cx="32" cy="32" r="28"/><circle class="pg2-fg" cx="32" cy="32" r="28"/></svg><span class="pg2-t"><b>1</b>/${N}</span></div>`,
      3: `<div class="pg3"><b class="pg3-n">01</b><span>/ ${String(N).padStart(2, '0')}</span><span class="pg3-l">${QF[0][3]}</span></div>`,
      4: `<ol class="pg4">${QF.map((q, i) => `<li><button type="button" class="pg4-b" data-i="${i}" tabindex="-1"><span class="pg4-l">${q[3]}</span><span class="pg4-v">Пока пусто</span></button></li>`).join('')}</ol>`,
      5: `<div class="pg5"><i class="pg5-tr"><i class="pg5-f"></i></i>${QF.map((q, i) => `<span class="pg5-s" title="${q[3]}">${QI[i]}</span>`).join('')}</div>`,
    }[n];
    cf.innerHTML = `<form class="cf5 cfa-${n}" action="#" novalidate><div class="pg" aria-hidden="true">${pg}</div><div class="cf5-main"><div class="cf5-body">${QF.map(([q, ph, nm], i) => `<label class="cf5-q"><span class="cf5-n">Шаг ${i + 1} из ${N}</span><b>${q}</b><input name="${nm}" placeholder="${ph}" autocomplete="off"></label>`).join('')}</div><div class="cf5-act"><button type="button" class="cf5-back" hidden>Назад</button><button class="vbtn" type="submit"><span>Дальше</span>${ic.arrow}</button><span class="cf5-hint">или Enter</span></div></div></form>`;
    const f = $('.cf5', cf), qs = $$('.cf5-q', f), ins = qs.map(q => q.querySelector('input'));
    let i = 0, touched = false;
    const upd = () => {
      qs.forEach((q, j) => { q.classList.toggle('on', j === i); q.classList.toggle('gone', j < i); q.style.setProperty('--k', Math.max(0, j - i)); q.querySelector('input').tabIndex = j === i ? 0 : -1; });
      $('.cf5-back', f).hidden = i === 0;
      $('.vbtn span', f).textContent = i === N - 1 ? 'Отправить заявку' : 'Дальше';
      $$('.pg1 li, .pg4 li', f).forEach((li, j) => { li.classList.toggle('cur', j === i); li.classList.toggle('done', j < i); });
      $$('.pg4-v', f).forEach((v, j) => { v.textContent = ins[j].value.trim() || 'Пока пусто'; });
      const fg = $('.pg2-fg', f); if (fg) fg.style.strokeDashoffset = (175.93 * (1 - (i + 1) / N)).toFixed(2);
      const t2 = $('.pg2-t b', f); if (t2) t2.textContent = i + 1;
      const n3 = $('.pg3-n', f); if (n3) { n3.textContent = String(i + 1).padStart(2, '0'); $('.pg3-l', f).textContent = QF[i][3]; }
      const f5 = $('.pg5-f', f); if (f5) f5.style.width = (i / (N - 1) * 100) + '%';
      $$('.pg5-s', f).forEach((p, j) => { p.classList.toggle('cur', j === i); p.classList.toggle('done', j < i); });
      if (touched) setTimeout(() => ins[i].focus({ preventScroll: true }), 80);
    };
    f.addEventListener('submit', e => {
      e.preventDefault(); touched = true;
      const inp = ins[i];
      if (!inp.value.trim()) { inp.classList.add('err'); setTimeout(() => inp.classList.remove('err'), 600); inp.focus(); return; }
      if (i < N - 1) { i++; upd(); return; }
      const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');
      cf.innerHTML = `<div class="cf-done">${ic.check}<b>Заявка отправлена</b><ul class="cf-sum">${QF.map((q, j) => `<li><span>${q[3]}</span>${esc(ins[j].value.trim())}</li>`).join('')}</ul><p>${D.contact.doneP}</p></div>`;
    });
    $('.cf5-back', f).addEventListener('click', () => { touched = true; i--; upd(); });
    $$('.pg1-b, .pg4-b', f).forEach(b => b.addEventListener('click', () => { const j = +b.dataset.i; if (j < i) { touched = true; i = j; upd(); } }));
    upd();
  }

  // ================= 10. работы: прокрутка при наведении + подробная карточка =================
  const keyOf = (a) => [...a.classList].find(c => c.startsWith('wk-') && D.works[c.slice(3)]).slice(3);
  $$('.wk', wsec).forEach(a => {
    const k = keyOf(a), shot = $('.wk-shot', a);
    shot.insertAdjacentHTML('beforeend', `<img class="lng" alt="" aria-hidden="true" decoding="async"><span class="wk-open" aria-hidden="true">Подробнее</span>`);
    const lng = $('.lng', shot);
    a.addEventListener('mouseenter', () => {
      const go = () => { shot.style.setProperty('--h', shot.clientHeight + 'px'); shot.style.setProperty('--d', Math.max(4, Math.min(11, lng.naturalHeight / lng.naturalWidth * 2.2)) + 's'); a.classList.add('scroll'); };
      if (!lng.getAttribute('src')) { lng.src = `img/long/${k}.jpg`; lng.onload = () => a.matches(':hover') && go(); } else if (lng.complete) go();
    });
    a.addEventListener('mouseleave', () => a.classList.remove('scroll'));
    a.addEventListener('click', e => { e.preventDefault(); openDm(k, a); });
  });

  // телефон (реалистичный)
  const SIG = '<svg viewBox="0 0 18 12" aria-hidden="true"><rect x="0" y="8" width="3" height="4" rx=".8"/><rect x="5" y="5.5" width="3" height="6.5" rx=".8"/><rect x="10" y="3" width="3" height="9" rx=".8"/><rect x="15" y="0" width="3" height="12" rx=".8"/></svg>';
  const WIFI = '<svg viewBox="0 0 16 12" aria-hidden="true"><path d="M8 11.5 5.6 9a3.4 3.4 0 0 1 4.8 0zM3.4 6.8a6.5 6.5 0 0 1 9.2 0l-1.5 1.5a4.4 4.4 0 0 0-6.2 0zM1 4.4a9.9 9.9 0 0 1 14 0l-1.5 1.5a7.8 7.8 0 0 0-11 0z"/></svg>';
  const BAT = '<svg viewBox="0 0 27 12" aria-hidden="true"><rect x=".5" y=".5" width="23" height="11" rx="3.2" fill="none" stroke="currentColor" opacity=".45"/><rect x="2" y="2" width="17" height="8" rx="1.8"/><path d="M25 4v4a2 2 0 0 0 0-4z" opacity=".5"/></svg>';
  const host = (k) => D.works[k].show.split('/')[0];
  const phone = (k) => `<div class="iph"><i class="iph-b b1"></i><i class="iph-b b2"></i><i class="iph-b b3"></i><i class="iph-b b4"></i><div class="iph-scr"><div class="iph-sb"><span class="iph-time">9:41</span><i class="iph-isl"></i><span class="iph-ic">${SIG}${WIFI}${BAT}</span></div><div class="iph-view dm-scroll" tabindex="0" aria-label="Мобильная версия сайта ${NAMES[k]}, можно листать"><img src="img/mob/${k}.jpg" alt="Мобильная версия сайта ${NAMES[k]}" decoding="async"></div><div class="iph-bot"><span class="iph-url"><svg viewBox="0 0 10 12" aria-hidden="true"><path d="M2 5V3.5a3 3 0 0 1 6 0V5M1 5h8v6.5H1z"/></svg>${host(k)}</span><i class="iph-home"></i></div></div></div>`;
  const browser = (k) => `<div class="brw"><div class="brw-bar"><i></i><i></i><i></i><span class="brw-url"><svg viewBox="0 0 10 12" aria-hidden="true"><path d="M2 5V3.5a3 3 0 0 1 6 0V5M1 5h8v6.5H1z"/></svg>${D.works[k].show}</span></div><div class="brw-view dm-scroll" tabindex="0" aria-label="Сайт ${NAMES[k]} на компьютере, можно листать"><img src="img/long/${k}.jpg" alt="Сайт ${NAMES[k]} на компьютере" decoding="async"></div></div>`;
  // автопрокрутка, пользователь может листать сам
  const scrollers = new Set(); let looping = false;
  function scroller(view) {
    if (view._sc) return view._sc;
    const s = { view, dir: 1, pause: 1500, last: 0, hold: 0 };
    ['wheel', 'touchstart', 'pointerdown', 'keydown'].forEach(ev => view.addEventListener(ev, () => { s.hold = performance.now() + 3500; }, { passive: true }));
    s.start = () => { if (reduce) return; s.last = performance.now(); scrollers.add(s); loop(); };
    s.stop = () => scrollers.delete(s);
    view._sc = s; return s;
  }
  function loop() {
    if (looping) return; looping = true;
    const f = (t) => {
      if (!scrollers.size) { looping = false; return; }
      scrollers.forEach(s => {
        const dt = Math.min(64, t - s.last); s.last = t; if (t < s.hold) return;
        if (s.pause > 0) { s.pause -= dt; return; }
        const v = s.view, max = v.scrollHeight - v.clientHeight; if (max <= 0) return;
        v.scrollTop += s.dir * dt * Math.max(.06, v.clientWidth / 300 * .06);
        if (v.scrollTop >= max - 1 && s.dir > 0) { s.dir = -1; s.pause = 1500; }
        if (v.scrollTop <= 0 && s.dir < 0) { s.dir = 1; s.pause = 1500; }
      });
      requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  }

  // подробная карточка: 5 вариантов оформления
  const pcI = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4.5" width="18" height="12" rx="1.5"/><path d="M8.5 20h7M12 16.5V20"/></svg>';
  const phI = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="3" width="10" height="18" rx="2.2"/><path d="M11 18h2"/></svg>';
  body.insertAdjacentHTML('beforeend', `<div class="dm" hidden><div class="dm-back"></div><div class="dm-p" role="dialog" aria-modal="true" aria-labelledby="dmName"><button type="button" class="dm-x" aria-label="Закрыть">×</button><div class="dm-prev-w"><div class="dm-sw" role="group" aria-label="Версия сайта"><button type="button" data-v="pc" aria-pressed="true">${pcI}<span>Компьютер</span></button><button type="button" data-v="ph" aria-pressed="false">${phI}<span>Телефон</span></button></div><div class="dm-stage"></div></div><div class="dm-info"><p class="dm-k"></p><h3 class="dm-n" id="dmName"></h3><p class="dm-b"></p><p class="dm-d"></p><ul class="dm-t"></ul><div class="dm-act"><a class="vbtn dm-go" target="_blank" rel="noopener"><span>Открыть сайт</span>${ic.arrow}</a><span class="dm-url"></span></div><div class="dm-nav"><button type="button" class="dm-pv">${ic.prev}<span>Предыдущая</span></button><span class="dm-cnt"></span><button type="button" class="dm-nx"><span>Следующая</span>${ic.next}</button></div></div></div></div>`);
  const dm = document.querySelector('.dm'), dmP = dm.querySelector('.dm-p'), dmStage = dm.querySelector('.dm-stage');
  let dmKey = null, dmView = 'pc', dmFrom = null;
  const dmFill = () => {
    const k = dmKey, w = D.works[k];
    dm.querySelector('.dm-k').textContent = String(ORDER.indexOf(k) + 1).padStart(2, '0') + ' / ' + String(ORDER.length).padStart(2, '0');
    dm.querySelector('.dm-n').textContent = w.name; dm.querySelector('.dm-b').textContent = w.biz; dm.querySelector('.dm-d').textContent = INFO[k];
    dm.querySelector('.dm-t').innerHTML = w.tags.map(t => `<li>${ic.check}<span>${t}</span></li>`).join('');
    dm.querySelector('.dm-go').href = w.url; dm.querySelector('.dm-url').textContent = w.show;
    dm.querySelector('.dm-cnt').textContent = `${ORDER.indexOf(k) + 1} из ${ORDER.length}`;
    dmRender();
  };
  const dmRender = () => {
    scrollers.forEach(s => s.stop());
    const k = dmKey;
    dmStage.innerHTML = dmv() === 5 && innerWidth > 900 ? `<div class="dm-duo">${browser(k)}${phone(k)}</div>` : (dmView === 'pc' ? browser(k) : `<div class="dm-phw">${phone(k)}</div>`);
    dmStage.classList.remove('swap'); void dmStage.offsetWidth; dmStage.classList.add('swap');
    dm.querySelectorAll('.dm-sw button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === dmView));
    dmStage.querySelectorAll('.dm-scroll').forEach(v => { const sc = scroller(v); setTimeout(() => sc.start(), 900); });
  };
  function openDm(k, from) {
    dmKey = k; dmView = 'pc'; dmFrom = from;
    dm.className = 'dm dm-' + dmv(); dm.hidden = false; body.classList.add('dm-on');
    dmFill();
    if (dmv() === 4 && from && !reduce) {
      const r = from.querySelector('.wk-shot').getBoundingClientRect(), f = dmP.getBoundingClientRect();
      dmP.style.transition = 'none'; dmP.style.transformOrigin = '0 0';
      dmP.style.transform = `translate(${r.left - f.left}px,${r.top - f.top}px) scale(${r.width / f.width},${r.height / f.height})`;
      void dmP.offsetWidth; dmP.style.transition = ''; dmP.style.transform = '';
    }
    requestAnimationFrame(() => dm.classList.add('in'));
    dm.querySelector('.dm-x').focus();
  }
  function closeDm() {
    dm.classList.remove('in'); body.classList.remove('dm-on'); scrollers.forEach(s => s.stop());
    setTimeout(() => { dm.hidden = true; dmStage.innerHTML = ''; }, reduce ? 0 : 420);
    dmFrom && dmFrom.focus();
  }
  dm.querySelector('.dm-x').addEventListener('click', closeDm);
  dm.querySelector('.dm-back').addEventListener('click', closeDm);
  dm.querySelectorAll('.dm-sw button').forEach(b => b.addEventListener('click', () => { if (dmView === b.dataset.v) return; dmView = b.dataset.v; dmRender(); }));
  const step = (d) => { dmKey = ORDER[(ORDER.indexOf(dmKey) + d + ORDER.length) % ORDER.length]; dmFill(); };
  dm.querySelector('.dm-pv').addEventListener('click', () => step(-1));
  dm.querySelector('.dm-nx').addEventListener('click', () => step(1));
  document.addEventListener('keydown', e => {
    if (dm.hidden) return;
    if (e.key === 'Escape') closeDm();
    if (e.key === 'ArrowRight' && !e.target.closest('.dm-scroll')) step(1);
    if (e.key === 'ArrowLeft' && !e.target.closest('.dm-scroll')) step(-1);
    if (e.key === 'Tab') { const f = [...dmP.querySelectorAll('button,a[href],[tabindex="0"]')].filter(x => x.offsetParent); if (!f.length) return; const a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
  });

  // ================= фишки, которые остаются =================
  // 2. шторки
  $$('[data-blk]').forEach(b => { if (b.dataset.blk !== 'hero') { b.classList.add('has-shard'); b.insertAdjacentHTML('beforeend', '<i class="shard" aria-hidden="true"></i><i class="shard shard2" aria-hidden="true"></i>'); } });
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('opened'); io.unobserve(e.target); } }), { threshold: 0.12 });
  $$('.has-shard').forEach(b => io.observe(b));
  // 4. плоскости за курсором
  const hero = $('.m-hero .hero'), hbg = $('.m-hero .hero-bg');
  if (fine && !reduce) {
    let raf = 0, mx = 0, my = 0;
    hero.addEventListener('pointermove', e => { const r = hero.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width - .5; my = (e.clientY - r.top) / r.height - .5; if (!raf) raf = requestAnimationFrame(() => { raf = 0; hbg.style.transform = `translate3d(${mx * -30}px,${my * -16}px,0)`; }); });
    hero.addEventListener('pointerleave', () => { hbg.style.transform = ''; });
  }
  // 9. плашка «Обсудить»
  body.insertAdjacentHTML('beforeend', `<div class="fbar"><span>Расскажите о задаче, покажу макет бесплатно</span><a class="fbtn" href="#svyaz"><i class="fb-ic" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M21.5 3.5 2.8 10.7c-1 .4-1 1.8 0 2.1l4.7 1.5 1.8 5.6c.3.9 1.4 1.1 2 .4l2.6-2.7 4.8 3.5c.8.6 1.9.1 2.1-.8l3-15.2c.2-1-.8-1.9-1.8-1.6z"/></svg></i><i class="fb-dots" aria-hidden="true"><b></b><b></b><b></b></i><span>Обсудить</span>${ic.arrow}</a><button type="button" class="fbar-x" aria-label="Скрыть плашку">×</button></div>`);
  const bar = document.querySelector('.fbar'); let barOff = false;
  bar.querySelector('.fbar-x').addEventListener('click', () => { barOff = true; bar.classList.remove('show'); });
  bar.querySelector('a').addEventListener('click', e => { e.preventDefault(); const el = document.getElementById('svyaz'); scrollTo({ top: el.getBoundingClientRect().top + scrollY - 64, behavior: 'smooth' }); });
  // 1. заставка
  function loader(force) {
    if (reduce || (!force && ss.get('fL6'))) return;
    ss.set('fL6', 1);
    document.querySelectorAll('.ldr').forEach(x => x.remove());
    body.insertAdjacentHTML('beforeend', `<div class="ldr" aria-hidden="true"><i></i><i></i><i></i><div class="ldr-m">${LOGO}<span>Dolzha</span></div></div>`);
    const l = body.lastElementChild;
    requestAnimationFrame(() => l.classList.add('go'));
    setTimeout(() => l.classList.add('out'), 650);
    setTimeout(() => l.remove(), 1150);
  }
  // B. кольцо вместо курсора
  if (fine && !reduce) {
    body.insertAdjacentHTML('beforeend', '<div class="fcur" aria-hidden="true"></div>');
    const cur = body.lastElementChild; let x = -100, y = -100, cx = -100, cy = -100, run = false;
    const tick = () => { cx += (x - cx) * .25; cy += (y - cy) * .25; cur.style.transform = `translate3d(${cx}px,${cy}px,0)`; if (Math.abs(x - cx) + Math.abs(y - cy) > .3) requestAnimationFrame(tick); else run = false; };
    document.addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; cur.classList.toggle('big', !!e.target.closest('a,button,summary,input,textarea,label,.wk,[tabindex]')); cur.classList.toggle('txt', !!e.target.closest('input,textarea')); if (!run) { run = true; requestAnimationFrame(tick); } }, { passive: true });
    document.addEventListener('pointerdown', () => cur.classList.add('down')); document.addEventListener('pointerup', () => cur.classList.remove('down'));
  }
  // N8. маскот (теперь это новый логотип)
  body.insertAdjacentHTML('beforeend', `<button type="button" class="masc" aria-label="Перейти к форме заявки"><svg viewBox="0 0 52 52" aria-hidden="true"><defs><linearGradient id="msGr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#B5E853"/><stop offset="1" stop-color="#11998E"/></linearGradient></defs><circle cx="26" cy="26" r="25" fill="url(#msGr)"/><path d="M3 34c8-7 15 3 23-3s15-3 24 1v4a25 25 0 0 1-47 0z" fill="#0F2621"/><g transform="translate(10.36 12.66) scale(.92)"><g class="ms-b"><rect width="34" height="23" rx="3.5" fill="#fff"/><rect x="-3" y="24.5" width="40" height="4.5" rx="2" fill="#fff"/><g class="ms-eyes"><circle cx="11" cy="10" r="2.3"/><circle cx="23" cy="10" r="2.3"/></g><path d="M11 15c2 3 4.5 4 6 4s4-1 6-4" class="ms-sm"/></g></g></svg><span class="ms-say">Привет! Я Dolzha</span></button>`);
  const masc = document.querySelector('.masc');
  masc.addEventListener('click', () => { const el = document.getElementById('svyaz'); scrollTo({ top: el.getBoundingClientRect().top + scrollY - 64, behavior: 'smooth' }); });
  if (fine) document.addEventListener('pointermove', e => { const r = masc.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2), d = Math.hypot(dx, dy) || 1; masc.style.setProperty('--ex', (dx / d * 2.2).toFixed(2) + 'px'); masc.style.setProperty('--ey', (dy / d * 1.8).toFixed(2) + 'px'); }, { passive: true });
  window.addEventListener('scroll', () => {
    const ct = $('#svyaz').getBoundingClientRect();
    bar.classList.toggle('show', !barOff && scrollY > innerHeight * .9 && ct.top > innerHeight * .6);
    const ftTop = ($('.m-ft') || $('footer')).getBoundingClientRect().top, inFt = ftTop < innerHeight - 40;
    masc.classList.toggle('peek', scrollY > innerHeight * .6 && !inFt);
    masc.classList.toggle('full', ct.top < innerHeight * .7 && ct.bottom > 0 && !inFt);
  }, { passive: true });

  // ================= панель: только то, что ещё выбираем =================
  const VV = [];
  body.insertAdjacentHTML('beforeend', `<aside class="fpan" aria-label="Что ещё выбираем"><button type="button" class="fpan-t" aria-expanded="true">Что ещё выбираем</button><div class="fpan-b">
    ${VV.map(([k, n, opts]) => `<div class="vv"><p class="fpan-g">${n}</p><div class="vv-b" data-k="${k}">${opts.map((o, i) => `<button type="button" data-n="${i + 1}" aria-pressed="${VAR[k] === i + 1}" title="${o}">${i + 1}</button>`).join('')}</div><p class="vv-n">${opts[VAR[k] - 1]}</p></div>`).join('')}
    <button type="button" class="fpan-dm">Открыть карточку Guru Motors</button>
    <button type="button" class="fpan-cp">Скопировать мой выбор</button><p class="fpan-ok" hidden>Скопировано, вставьте в чат</p>
    <button type="button" class="fpan-r">Показать заставку ещё раз</button></div></aside>`);
  const pan = document.querySelector('.fpan');
  if (innerWidth <= 900) { pan.classList.add('closed'); $('.fpan-t', pan).setAttribute('aria-expanded', 'false'); }
  $('.fpan-t', pan).addEventListener('click', e => { const c = pan.classList.toggle('closed'); e.currentTarget.setAttribute('aria-expanded', !c); });
  $$('.vv-b', pan).forEach(g => g.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
    const k = g.dataset.k; VAR[k] = +b.dataset.n; ls.set('v8-' + k, VAR[k]);
    g.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
    g.nextElementSibling.textContent = VV.find(v => v[0] === k)[2][VAR[k] - 1];
    applyVars();
  })));
  $('.fpan-dm', pan).addEventListener('click', () => openDm('gurumotors', $('.wk-gurumotors')));
  $('.fpan-cp', pan).addEventListener('click', () => {
    const txt = 'Выбор: ' + VV.map(([k, n, o]) => `${n} ${VAR[k]} (${o[VAR[k] - 1]})`).join('; ');
    const done = () => { $('.fpan-ok', pan).hidden = false; setTimeout(() => $('.fpan-ok', pan).hidden = true, 2500); };
    (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(done, () => { prompt('Скопируйте строку:', txt); });
  });
  $('.fpan-r', pan).addEventListener('click', () => loader(true));

  // анимация 4: карточки на главной наклоняются за курсором
  const hv = $('.m-hero .hero-vis');
  if (fine && !reduce) hero.addEventListener('pointerleave', () => { hv.style.setProperty('--rx', '0deg'); hv.style.setProperty('--ry', '0deg'); });
  if (fine && !reduce) hero.addEventListener('pointermove', e => { const r = hv.getBoundingClientRect(); hv.style.setProperty('--ry', (((e.clientX - r.left) / r.width - .5) * 16).toFixed(2) + 'deg'); hv.style.setProperty('--rx', (((e.clientY - r.top) / r.height - .5) * -12).toFixed(2) + 'deg'); });
  // фон главной: 5 вариантов в одном слое, CSS показывает нужный (hbg-N на .stage)
  (() => {
    const W = 2880, H = 900;
    let lines = '';
    for (let k = 0; k < 13; k++) {
      const y0 = 40 + k * 66, a = 18 + (k % 4) * 7, ph = k * .7;
      let d = `M0 ${y0}`;
      for (let x = 40; x <= W; x += 40) d += ` L${x} ${(y0 + Math.sin(x / 1440 * Math.PI * 4 + ph) * a + Math.sin(x / 1440 * Math.PI * 2 + ph * 2) * a * .6).toFixed(1)}`;
      lines += `<path d="${d}"/>`;
    }
    hero.insertAdjacentHTML('afterbegin', `<div class="hbg" aria-hidden="true"><i class="hb-a"></i><i class="hb-a"></i><i class="hb-a"></i><i class="hb-d"></i><i class="hb-d hb-d2"></i><svg class="hb-t" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMinYMid slice">${lines}</svg><i class="hb-g"></i><canvas class="hb-p"></canvas></div>`);
    const box = $('.hbg', hero), cv = $('.hb-p', box), cx = cv.getContext('2d');
    let mx = -999, my = -999, on = false, raf = 0, pts = [], w = 0, h = 0;
    if (fine) {
      hero.addEventListener('pointermove', e => { const r = hero.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; box.style.setProperty('--mx', mx + 'px'); box.style.setProperty('--my', my + 'px'); }, { passive: true });
      hero.addEventListener('pointerleave', () => { mx = my = -999; box.style.setProperty('--mx', '-999px'); });
    }
    const size = () => { const r = hero.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2); cv.width = r.width * dpr; cv.height = r.height * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0); w = r.width; h = r.height; return r; };
    const seed = () => { const r = size(), n = Math.round(Math.min(90, r.width * r.height / 14000)); pts = Array.from({ length: n }, () => ({ x: Math.random() * r.width, y: Math.random() * r.height, r: 1.2 + Math.random() * 2.8, v: .15 + Math.random() * .35, w: Math.random() * 6.28, c: Math.random() < .55 ? '181,232,83' : '17,153,142', a: .25 + Math.random() * .45 })); };
    const tick = () => {
      raf = 0; if (!on) return;
      cx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.w += .01; p.y -= p.v; p.x += Math.sin(p.w) * .3;
        const dx = p.x - mx, dy = p.y - my, d = Math.hypot(dx, dy);
        if (d < 120 && d > 0) { p.x += dx / d * (120 - d) * .04; p.y += dy / d * (120 - d) * .04; }
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 6.283); cx.fillStyle = `rgba(${p.c},${p.a})`; cx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    let vis = true;
    new IntersectionObserver(es => { vis = es[0].isIntersecting; run(); }).observe(hero);
    const run = () => { const want = VAR.hbg === 5 && vis && !reduce; if (want && !pts.length) seed(); on = want; if (on && !raf) raf = requestAnimationFrame(tick); };
    addEventListener('resize', () => { if (pts.length) seed(); });
    hbgRun = run; run();
  })();
  applyVars();
  loader();
})();
