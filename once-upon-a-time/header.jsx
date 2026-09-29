// Header — sticky, hide on scroll down, show on scroll up

const Header = () => {
  const [hidden, setHidden] = React.useState(false);
  const lastY = React.useRef(0);

  React.useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 80) { setHidden(false); lastY.current = y; return; }
      const dy = y - lastY.current;
      if (dy > 6) setHidden(true);
      else if (dy < -6) setHidden(false);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header className={"header" + (hidden ? " is-hidden" : "")}>
      <div className="header-inner">
        <nav className="header-nav left">
          <a href="#top" className="header-link" onClick={scrollTo('top')}>Главная</a>
          <a href="#catalog" className="header-link" onClick={scrollTo('catalog')}>Каталог</a>
        </nav>
        <a href="#top" className="header-logo" onClick={scrollTo('top')}>
          <span className="mark">Once Upon a Time</span>
          <span className="sub">Винтаж · Екатеринбург</span>
        </a>
        <nav className="header-nav right">
          <a href="#application" className="header-link" onClick={scrollTo('application')}>Заявка</a>
          <a href="#address" className="header-link" onClick={scrollTo('address')}>Адрес</a>
        </nav>
      </div>
    </header>
  );
};

window.Header = Header;
