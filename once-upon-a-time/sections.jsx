// Reveal-on-scroll wrapper + content sections

const Reveal = ({ children, delay = 0, as: Tag = 'div', className = '', ...rest }) => {
  const ref = React.useRef(null);
  const [vis, setVis] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { setVis(true); io.unobserve(el); } });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const cls = `${className} reveal${vis ? ' is-in' : ''}${delay ? ' delay-' + delay : ''}`;
  return <Tag ref={ref} className={cls} {...rest}>{children}</Tag>;
};

const Hero = () => (
  <section id="top" className="hero">
    <span className="corner tl"></span>
    <span className="corner tr"></span>
    <div className="hero-anim">
      <div className="hero-eyebrow">est. winter · vintage selection</div>
      <h1 className="hero-title">
        Once <span className="it">upon</span> a Time
      </h1>
      <div className="flourish"><span className="dot"></span></div>
      <p className="hero-subtitle">
        В винтажке «Once Upon a Time» мы предлагаем вам одежду, прошедшую строгий отбор.
        Только трендовые вещи, которые подчеркнут вашу индивидуальность и стиль.
      </p>
      <div className="hero-meta">
        <span>Екатеринбург</span>
        <span className="dot"></span>
        <span>ул. Малышева, 39</span>
        <span className="dot"></span>
        <span>+7 996 591 42 17</span>
      </div>
    </div>
  </section>
);

const About = () => (
  <section className="section">
    <Reveal className="split">
      <div className="split-text">
        <div className="section-eyebrow">— Глава I</div>
        <h2 className="section-title">О проекте <span className="it">и философии</span></h2>
        <p className="section-lead">
          Здесь мы создаем эмоциональную связь и объясняем, почему винтаж — это
          не просто «старые вещи».
        </p>
        <p style={{ marginTop: 28 }}>
          «Once Upon a Time» — это проект для тех, кто ищет уникальность в мире масс-маркета.
          Мы верим, что одежда должна рассказывать историю. Каждая вещь в нашей коллекции —
          это бережно найденный артефакт, который ждет своего продолжения в вашем гардеробе.
        </p>
      </div>
      <div className="split-media">
        <span className="frame"></span>
        <img src="images/about.jpg" alt="О проекте" />
      </div>
    </Reveal>
  </section>
);

const Selection = () => (
  <section className="section">
    <Reveal className="split reverse">
      <div className="split-text">
        <div className="section-eyebrow">— Глава II</div>
        <h2 className="section-title">Бескомпромиссный <span className="it">отбор</span></h2>
        <p className="section-lead">
          Качество, прошедшее проверку временем.
        </p>
        <p style={{ marginTop: 24 }}>
          Мы берем на себя самую сложную работу, чтобы вы получали удовольствие от покупки:
        </p>
        <ul className="bullet-list">
          <li><b>Строгая селекция.</b> Мы отсматриваем сотни позиций, выбирая только те, что актуальны сегодня.</li>
          <li><b>Безупречное состояние.</b> Каждая вещь проходит тщательную проверку на дефекты, профессиональную чистку и реставрацию фурнитуры при необходимости.</li>
          <li><b>Натуральные материалы.</b> Мы отдаем приоритет винтажному льну, шерсти, шелку и хлопку — тканям, которые служат десятилетиями.</li>
        </ul>
      </div>
      <div className="split-media">
        <span className="frame"></span>
        <img src="images/selection.jpg" alt="Бескомпромиссный отбор" />
      </div>
    </Reveal>
  </section>
);

const Capsules = () => (
  <section className="section">
    <Reveal className="split">
      <div className="split-text">
        <div className="section-eyebrow">— Глава III</div>
        <h2 className="section-title">Готовые <span className="it">капсулы</span> для вас</h2>
        <p className="section-lead">Создаем готовые образы за вас.</p>
        <p style={{ marginTop: 24 }}>
          Мы знаем, как порой непросто собрать гармоничный комплект. Именно поэтому
          в «Once Upon a Time» мы предлагаем услугу по созданию капсул:
        </p>
        <p style={{ marginTop: 16 }}>
          <b style={{ fontFamily: 'var(--serif)', fontSize: 19 }}>Готовые сеты.</b>
          {' '}В нашем каталоге вы найдете уже стилизованные комплекты (например, блуза + юбка + кепи),
          которые идеально дополняют друг друга по фактуре и цвету.
        </p>
      </div>
      <div className="split-media">
        <span className="frame"></span>
        <img src="images/capsules.jpg" alt="Готовые капсулы" />
      </div>
    </Reveal>
  </section>
);

const Divider = () => (
  <div className="divider">
    <span className="line"></span>
    <span className="glyph">✦</span>
    <span className="line"></span>
  </div>
);

window.Hero = Hero;
window.About = About;
window.Selection = Selection;
window.Capsules = Capsules;
window.Divider = Divider;
window.Reveal = Reveal;
