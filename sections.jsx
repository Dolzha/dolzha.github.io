/* Sections: Header, Hero, Projects, Services, About, Contact, Footer */

const { useState, useEffect, useRef, useMemo } = React;

// Intersection-observer based reveal
function useReveal(options = { threshold: 0.12 }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) { setShown(true); io.disconnect(); break; }
      }, options
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown]);
  return [ref, shown];
}

// ---------- PRELOADER (идея 17) ----------
function Preloader() {
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setGone(true), 2300);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className={`preloader${gone ? ' hide' : ''}`} aria-hidden>
      <div className="pl-logo"><Logo size={92} /></div>
      <div className="pl-bar"><span /></div>
    </div>
  );
}

// ---------- FLOATING TELEGRAM BUTTON (идея 6) ----------
function TelegramFab() {
  return (
    <a
      href="https://t.me/Dolshanski"
      target="_blank"
      rel="noreferrer"
      className="tg-fab"
      aria-label="Написать в Telegram"
      onClick={() => { try { window.va && window.va('event', { name: 'telegram_click', where: 'fab' }); } catch (e) {} }}
    >
      <IconMsg size={26} />
    </a>
  );
}

// ---------- HEADER ----------
function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const links = [
    { href: '#projects', label: 'Проекты' },
    { href: '#services', label: 'Услуги' },
    { href: '#about', label: 'Обо мне' },
    { href: '#contact', label: 'Контакты' },
  ];
  const smoothTo = (e, href) => {
    e.preventDefault();
    e.stopPropagation();
    const id = href.replace('#', '');
    const el = id === 'top' ? document.body : document.getElementById(id);
    if (!el) return;
    const headerH = window.innerWidth >= 768 ? 80 : 64;
    const y = (id === 'top' ? 0 : el.getBoundingClientRect().top + window.pageYOffset - headerH);
    window.scrollTo({ top: y, behavior: 'smooth' });
    setOpen(false);
  };
  return (
    <>
      <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
        <div className="container header-inner">
          <a href="#top" className="logo" aria-label="Dolzha" onClick={(e) => smoothTo(e, '#top')}>
            <Logo />
            <span className="brandname">Dolzha</span>
          </a>
          <nav className="header-nav" aria-label="Главная навигация">
            <ul className="nav-links">
              {links.slice(0, 4).map(l => (
                <li key={l.href}><a href={l.href} onClick={(e) => smoothTo(e, l.href)}>{l.label}</a></li>
              ))}
            </ul>
          </nav>
          <button className="menu-btn" aria-label="Меню" onClick={() => setOpen(v => !v)}>
            {open ? <IconX /> : <IconMenu />}
          </button>
        </div>
      </header>
      <div className={`mobile-menu${open ? ' open' : ''}`} style={{ height: open ? 'auto' : 0 }}>
        <ul>
          {links.map((l, i) => (
            <li key={l.href} style={{ transitionDelay: open ? `${i * 0.05}s` : '0s' }}>
              <a href={l.href} onClick={(e) => smoothTo(e, l.href)}>{l.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

// ---------- HERO ----------
function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t); }, []);
  const delay = (d) => ({ transitionDelay: `${d}s` });
  return (
    <section className="hero" id="top">
      <div className="plx-orb o1" aria-hidden />
      <div className="plx-orb o2" aria-hidden />
      <div className="container hero-inner">
        <h1>
          <span className={`line fx ${mounted ? 'show' : ''}`} style={delay(0.1)}>Создаю сайты,</span>
          <span className={`line fx fx-left ${mounted ? 'show' : ''}`} style={delay(0.3)}>
            <span className="accent">которые работают</span>
          </span>
          <span className={`line fx ${mounted ? 'show' : ''}`} style={delay(0.45)}>на вас</span>
        </h1>
        <div className={`hero-lead fx ${mounted ? 'show' : ''}`} style={delay(0.55)}>
          <p>
            Помогаю бизнесу и специалистам создать сайт мечты, от
            концепции до запуска. Понимаю, какие решения нужны именно
            вашему проекту.
          </p>
        </div>
        <div className={`hero-cta fx ${mounted ? 'show' : ''}`} style={delay(0.7)}>
          <a href="https://t.me/Dolshanski" target="_blank" rel="noreferrer" className="btn btn-primary btn-lg">
            Написать в Telegram
          </a>
          <a href="#projects" className="btn btn-outline btn-lg">
            Смотреть проекты <IconArrowRight size={16} />
          </a>
          <a href="#contact" className="btn btn-outline btn-lg">Обсудить проект</a>
        </div>
        <div className="hero-stats">
          <div className={`fx fx-scale ${mounted ? 'show' : ''}`} style={delay(0.9)}>
            <div className="stat-num">2+</div>
            <div className="stat-label">года опыта</div>
          </div>
          <div className={`fx fx-scale ${mounted ? 'show' : ''}`} style={delay(1.1)}>
            <div className="stat-num">100%</div>
            <div className="stat-label">в срок</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- PROJECTS (10 реальных живых сайтов) ----------
const PROJECTS = [
  {
    name: 'Guru Motors',
    business: 'Чип-тюнинг и автосервис',
    url: 'https://gurumotors.ru',
    display: 'gurumotors.ru',
    img: 'assets/projects/gurumotors.jpg',
    tags: ['Панель управления', 'Заявки в Telegram'],
  },
  {
    name: 'NORDEN',
    business: 'Ателье тюнинга',
    url: 'https://dolzha.github.io/norden/',
    display: 'dolzha.github.io/norden',
    img: 'assets/projects/norden.jpg',
    tags: ['Галерея работ', 'Заявка с сайта'],
  },
  {
    name: 'Bambini',
    business: 'Частный детский сад',
    url: 'https://dolzha.github.io/bambini/',
    display: 'dolzha.github.io/bambini',
    img: 'assets/projects/bambini.jpg',
    tags: ['Панель управления', 'Запись на просмотр'],
  },
  {
    name: 'Garage 82/1',
    business: 'Автосервис полного цикла',
    url: 'https://garage82-1.ru',
    display: 'garage82-1.ru',
    img: 'assets/projects/garage.jpg',
    tags: ['Онлайн-запись', 'Цены и отзывы'],
  },
  {
    name: 'Veha',
    business: 'Застройщик · недвижимость',
    url: 'https://dolzha.github.io/veha/',
    display: 'dolzha.github.io/veha',
    img: 'assets/projects/veha.jpg',
    tags: ['Подбор квартир', 'Калькулятор ипотеки'],
  },
  {
    name: 'Private',
    business: 'Арт-галерея художницы',
    url: 'https://private-art.vercel.app',
    display: 'private-art.vercel.app',
    img: 'assets/projects/private.jpg',
    tags: ['Многостраничный', 'Витрина работ'],
  },
  {
    name: 'Mentors',
    business: 'Юридическая фирма',
    url: 'https://mentors-law.vercel.app',
    display: 'mentors-law.vercel.app',
    img: 'assets/projects/mentors.jpg',
    tags: ['Многостраничный', 'Заявка с сайта'],
  },
  {
    name: 'Zest',
    business: 'Кофейня',
    url: 'https://zest-cafe-three.vercel.app',
    display: 'zest-cafe-three.vercel.app',
    img: 'assets/projects/zest.jpg',
    tags: ['Многостраничный', 'Меню заведения'],
  },
  {
    name: 'Porfume',
    business: 'Магазин парфюмерии',
    url: 'https://porfum4ik.vercel.app',
    display: 'porfum4ik.vercel.app',
    img: 'assets/projects/porfume.jpg',
    tags: ['Интернет-магазин', 'Корзина'],
  },
  {
    name: 'Once Upon a Time',
    business: 'Винтажная одежда',
    url: 'https://dolzha.github.io/once-upon-a-time/',
    display: 'dolzha.github.io/once-upon-a-time',
    img: 'assets/projects/once.jpg',
    tags: ['Каталог вещей', 'Заявка с сайта'],
  },
];

function Projects() {
  const [ref, shown] = useReveal();
  return (
    <section className="section-pad" id="projects" ref={ref}>
      <div className="container">
        <div className="section-head">
          <h2 className={`fx ${shown ? 'show' : ''}`}>Живые сайты, а не картинки</h2>
          <p className={`fx ${shown ? 'show' : ''}`} style={{ transitionDelay: '0.1s' }}>
            Каждая работа открывается по кнопке. Это реальный сайт реального бизнеса.
            Наведите на превью, чтобы пролистать.
          </p>
        </div>
        <div className="projects-grid">
          {PROJECTS.map((p, i) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className={`proj fx ${shown ? 'show' : ''}`}
              style={{ transitionDelay: `${0.15 + i * 0.1}s` }}
            >
              <div className="bframe">
                <div className="bframe-bar">
                  <span className="live-dot" />
                  <span className="bframe-url">{p.display}</span>
                  <span className="live-badge">live</span>
                </div>
                <div className="bframe-view">
                  <img src={p.img} alt={`${p.business}, ${p.name}`} loading="lazy" />
                </div>
              </div>
              <div className="proj-meta">
                <div className="proj-head">
                  <h3>{p.name}</h3>
                  <span className="open-dot"><IconArrowRight size={15} /></span>
                </div>
                <div className="proj-biz">{p.business}</div>
                <div className="tags">
                  {p.tags.map(t => <span key={t} className="tag">{t}</span>)}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- SERVICES ----------
const SERVICES = [
  { icon: 'layout', title: 'Лендинг', tags: ['от 12 рабочих дней', 'адаптивный'],
    desc: 'Одна страница, на которой человек сразу видит услуги, цены, отзывы и кнопку записи. Подходит, когда клиенты приходят по рекомендации или из карт и им нужно просто посмотреть и записаться.' },
  { icon: 'globe', title: 'Многостраничный сайт', tags: ['от 18 рабочих дней', 'CMS'],
    desc: 'У каждой услуги своя страница. Так вас проще найти в поиске по конкретному запросу, а клиенту проще выбрать нужное и не листать всё подряд.' },
  { icon: 'cart', title: 'Интернет-магазин', tags: ['от 25 рабочих дней', 'e-commerce'],
    desc: 'Каталог товаров, корзина и оформление заказа. Покупатель выбирает и оплачивает, не выходя с сайта, а заказы собираются в одном месте.' },
  { icon: 'palette', title: 'Портфолио', tags: ['от 12 рабочих дней', 'креатив'],
    desc: 'Сайт для тех, кто продаёт своими работами: фотографы, мастера, дизайнеры. Главное здесь галерея и способ быстро с вами связаться.' },
  { icon: 'settings', title: 'Техническая поддержка', tags: ['по запросу', 'сопровождение'],
    desc: 'Сайт уже есть, но что-то не работает, выглядит устаревшим или его некому обновлять. Чиню, дорабатываю и держу в рабочем состоянии.' },
];
const serviceIcon = (k) => ({
  layout: <IconLayout size={26} />, globe: <IconGlobe size={26} />,
  cart: <IconShoppingCart size={26} />, palette: <IconPalette size={26} />,
  rocket: <IconRocket size={26} />, settings: <IconSettings size={26} />,
}[k]);

function Services() {
  const [ref, shown] = useReveal();
  const [open, setOpen] = useState(null);
  return (
    <section className="section-pad section-alt" id="services" ref={ref}>
      <div className="container">
        <div className="section-head">
          <h2 className={`fx ${shown ? 'show' : ''}`}>Услуги</h2>
          <p className={`fx ${shown ? 'show' : ''}`} style={{ transitionDelay: '0.1s' }}>
            Делаю сайты для малого бизнеса. Нажмите на услугу, чтобы посмотреть, что это такое.
          </p>
        </div>
        <div className="services-list">
          {SERVICES.map((s, i) => (
            <div
              key={s.title}
              className={`svc-item fx ${shown ? 'show' : ''} ${open === i ? 'open' : ''}`}
              style={{ transitionDelay: `${0.12 + i * 0.06}s` }}
            >
              <button
                type="button"
                className="svc-line"
                aria-expanded={open === i}
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="svc-name">{s.title}</span>
                <span className="svc-meta">{s.tags[0]}</span>
                <span className="svc-arrow"><IconArrowRight size={18} /></span>
              </button>
              <div className="svc-body">
                <div className="svc-body-in">
                  <p>{s.desc}</p>
                  <a href="#contact" className="svc-order">
                    Обсудить проект <IconArrowRight size={14} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={`svc-price fx ${shown ? 'show' : ''}`} style={{ transitionDelay: '0.5s' }}>
          <span className="svc-price-note">Сколько стоит каждый вид сайта и что в него входит</span>
          <a href="price.pdf" target="_blank" rel="noopener" className="btn btn-outline btn-lg">
            Открыть прайс-лист <IconArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

// ---------- ABOUT ----------
const ADVANTAGES = [
  { icon: <IconCode size={20} />, title: 'Чистый код', desc: 'Пишу понятный и поддерживаемый код, который легко масштабировать' },
  { icon: <IconLightbulb size={20} />, title: 'Креативный подход', desc: 'Нахожу нестандартные решения для достижения целей вашего бизнеса' },
  { icon: <IconUsers size={20} />, title: 'Клиентоориентированность', desc: 'Вникаю в задачи клиента и предлагаю оптимальные решения' },
  { icon: <IconZap size={20} />, title: 'Быстрая разработка', desc: 'Использую современные инструменты для эффективной работы' },
];

// Photo carousel, auto-plays; skips images that fail to load (напр. пока не добавлены).
function PhotoCarousel({ photos }) {
  const [failed, setFailed] = useState({});
  const [i, setI] = useState(0);
  const shown = photos.filter(p => !failed[p]);
  const n = shown.length;
  const idx = n ? ((i % n) + n) % n : 0;
  useEffect(() => {
    if (n < 2) return;
    const t = setInterval(() => setI(v => v + 1), 4500);
    return () => clearInterval(t);
  }, [n]);
  return (
    <div className="pcar">
      <div className="pcar-track">
        {photos.map(p => (
          <img
            key={p}
            src={p}
            alt="Dolzha"
            loading="lazy"
            onError={() => setFailed(f => ({ ...f, [p]: true }))}
            className={shown[idx] === p ? 'on' : ''}
            style={{ display: failed[p] ? 'none' : undefined }}
          />
        ))}
      </div>
      {n > 1 && (
        <>
          <button className="pcar-btn prev" onClick={() => setI(v => v - 1)} aria-label="Предыдущее фото">‹</button>
          <button className="pcar-btn next" onClick={() => setI(v => v + 1)} aria-label="Следующее фото">›</button>
          <div className="pcar-dots">
            {shown.map((_, k) => (
              <span key={k} className={k === idx ? 'on' : ''} onClick={() => setI(k)} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const STACK = [
  { n: 'React', t: 'Библиотека для быстрых интерактивных интерфейсов' },
  { n: 'Next.js', t: 'Фреймворк для быстрых сайтов с хорошим SEO' },
  { n: 'TypeScript', t: 'Строгий JavaScript, меньше ошибок в коде' },
  { n: 'JavaScript', t: 'Язык, который «оживляет» сайт' },
  { n: 'Tailwind CSS', t: 'Инструмент для быстрой и аккуратной вёрстки' },
  { n: 'Vite', t: 'Сборщик, делает сайт лёгким и быстрым' },
  { n: 'Framer Motion', t: 'Плавные анимации интерфейса' },
  { n: 'Tilda', t: 'Конструктор сайтов, быстро и без кода' },
  { n: 'Figma', t: 'Программа для дизайна макетов' },
  { n: 'Git', t: 'Контроль версий, вся история изменений кода' },
  { n: 'Vercel', t: 'Хостинг, публикую сайт в интернете' },
];

function About() {
  const [ref, shown] = useReveal();
  const photos = ['assets/photos/1.jpg', 'assets/photos/2.jpg', 'assets/photos/3.jpg'];
  return (
    <section className="section-pad" id="about" ref={ref}>
      <div className="container">
        <div className="about-v10">
          <div className={`about-carousel fx fx-left ${shown ? 'show' : ''}`} style={{ transitionDelay: '0.05s' }}>
            <PhotoCarousel photos={photos} />
          </div>
          <div className={`about-card fx fx-right ${shown ? 'show' : ''}`} style={{ transitionDelay: '0.15s' }}>
            <h2 className="about-name">Я Dolzha</h2>
            <p className="about-intro">
              Веб-разработчик из Екатеринбурга. Делаю быстрые сайты для бизнеса,
              от лендинга до многостраничника. Настоящие работающие сайты, а не картинки.
            </p>
            <div className="about-stack-label">Мой стек</div>
            <div className="about-stack">
              {STACK.map(t => <span key={t.n} className="tech" data-tip={t.t} tabIndex={0}>{t.n}</span>)}
            </div>
            <a href="https://t.me/Dolshanski" target="_blank" rel="noreferrer" className="tg-cta">
              Написать в Telegram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- CONTACT ----------
// Night sky: many stars, each twinkling slowly with its own delay.
function Starfield({ count = 90 }) {
  const stars = useMemo(() => {
    const seed = (n) => { const x = Math.sin(n * 999.13) * 43758.5453; return x - Math.floor(x); };
    return Array.from({ length: count }, (_, i) => ({
      top: seed(i + 1) * 100,
      left: seed(i + 2.7) * 100,
      size: 0.6 + seed(i + 5.1) * 1.8,
      delay: seed(i + 8.3) * 9,
      dur: 4 + seed(i + 11.9) * 5,
      green: seed(i + 3.3) > 0.86,
    }));
  }, [count]);
  return (
    <div className="starfield" aria-hidden>
      {stars.map((s, i) => (
        <span
          key={i}
          className={s.green ? 'g' : ''}
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.dur}s`,
          }}
        />
      ))}
    </div>
  );
}

function Contact() {
  const [ref, shown] = useReveal();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const mailtoFallback = () => {
    const subject = encodeURIComponent('Заявка с сайта: ' + (form.name || 'без имени'));
    const body = encodeURIComponent('Имя: ' + form.name + '\nEmail: ' + form.email + '\n\n' + form.message);
    window.location.href = 'mailto:dolshanski235@gmail.com?subject=' + subject + '&body=' + body;
  };

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const r = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const j = await r.json().catch(() => ({}));
      if (!j || !j.ok) throw new Error('no delivery');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      mailtoFallback(); // пока доставка в Telegram не настроена, открываем письмо
    }
    setSending(false);
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <section className="section-pad" id="contact" ref={ref}>
      <Starfield />
      <div className="container">
        <div className="contact-grid">
          <div>
            <h2 className={`contact-title fx ${shown ? 'show' : ''}`}>
              Давайте создадим<br />
              <span className="accent">ваш проект</span>
            </h2>
            <p className={`contact-lead fx ${shown ? 'show' : ''}`} style={{ transitionDelay: '0.1s' }}>
              Расскажите о вашей идее, предложу решение и сроки. Быстрее всего в Telegram.
            </p>
            <a
              href="https://t.me/Dolshanski"
              target="_blank"
              rel="noreferrer"
              className={`tg-cta fx ${shown ? 'show' : ''}`}
              style={{ transitionDelay: '0.15s' }}
            >
              Написать в Telegram
            </a>
            <a href="mailto:dolshanski235@gmail.com" className={`contact-card fx fx-left ${shown ? 'show' : ''}`} style={{ transitionDelay: '0.25s' }}>
              <div className="ci"><IconMail size={20} /></div>
              <div>
                <div className="lbl">Email</div>
                <div className="val">dolshanski235@gmail.com</div>
              </div>
            </a>
            <a href="https://t.me/Dolshanski" target="_blank" rel="noreferrer" className={`contact-card fx fx-left ${shown ? 'show' : ''}`} style={{ transitionDelay: '0.32s' }}>
              <div className="ci"><IconMsg size={20} /></div>
              <div>
                <div className="lbl">Telegram</div>
                <div className="val">@Dolshanski</div>
              </div>
            </a>
            <div className={`contact-quote fx ${shown ? 'show' : ''}`} style={{ transitionDelay: '0.4s' }}>
              <span style={{ color: 'var(--primary)', fontWeight: 500 }}>«Всё не рождается из ничего»</span>. Ваш сайт начинается с первого сообщения.
            </div>
          </div>
          <form className={`form-card fx fx-right ${shown ? 'show' : ''}`} style={{ transitionDelay: '0.25s' }} onSubmit={submit}>
            <h3>Оставить заявку</h3>
            {[
              { id: 'name', label: 'Ваше имя', el: 'input', type: 'text', placeholder: 'Как к вам обращаться?' },
              { id: 'email', label: 'Email', el: 'input', type: 'email', placeholder: 'email@example.com' },
              { id: 'message', label: 'Сообщение', el: 'textarea', placeholder: 'Расскажите о вашем проекте...' },
            ].map((f, i) => (
              <div key={f.id} className={`field ${shown ? 'show' : ''}`} style={{ transitionDelay: `${0.35 + i * 0.08}s` }}>
                <label htmlFor={f.id}>{f.label}</label>
                {f.el === 'input' ? (
                  <input id={f.id} type={f.type} required placeholder={f.placeholder}
                    value={form[f.id]} onChange={e => setForm({ ...form, [f.id]: e.target.value })} />
                ) : (
                  <textarea id={f.id} rows={5} required placeholder={f.placeholder}
                    value={form[f.id]} onChange={e => setForm({ ...form, [f.id]: e.target.value })} />
                )}
              </div>
            ))}
            <button type="submit" disabled={sending} className={`submit-btn${sent ? ' sent' : ''}`}>
              <IconSend size={16} />
              {sending ? 'Отправляю…' : sent ? 'Заявка отправлена ✓' : 'Отправить заявку'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

// ---------- FOOTER ----------
function Footer() {
  const [ref, shown] = useReveal();
  return (
    <footer ref={ref}>
      <div className="container">
        <div className="footer-grid">
          <div className={`footer-col fx ${shown ? 'show' : ''}`}>
            <h5 className="footer-brand">DOLZHA</h5>
            <p className="desc">
              Создаю современные и эффективные веб-решения для бизнеса и частных специалистов.
            </p>
          </div>
          <div className={`footer-col fx ${shown ? 'show' : ''}`} style={{ transitionDelay: '0.1s' }}>
            <h5 className="footer-accent">Навигация</h5>
            <a href="#projects">Проекты</a>
            <a href="#services">Услуги</a>
            <a href="#about">Обо мне</a>
            <a href="#contact">Контакты</a>
          </div>
          <div className={`footer-col fx ${shown ? 'show' : ''}`} style={{ transitionDelay: '0.2s' }}>
            <h5 className="footer-accent">Контакты</h5>
            <a href="mailto:dolshanski235@gmail.com">dolshanski235@gmail.com</a>
            <a href="https://t.me/Dolshanski" target="_blank" rel="noreferrer">@Dolshanski</a>
            <a href="https://github.com/Dolzha" target="_blank" rel="noreferrer">github.com/Dolzha</a>
            <div className="socials">
              <a href="https://github.com/Dolzha" target="_blank" rel="noreferrer" aria-label="GitHub"><IconGithub size={18} /></a>
              <a href="https://t.me/Dolshanski" target="_blank" rel="noreferrer" aria-label="Telegram"><IconMsg size={18} /></a>
              <a href="mailto:dolshanski235@gmail.com" aria-label="Email"><IconMail size={18} /></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© 2026 Dolzha. Все права защищены.</div>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Header, Hero, Projects, Services, About, Contact, Footer, Preloader, TelegramFab });
