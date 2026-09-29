// Application form + address block

const Application = () => {
  const [sent, setSent] = React.useState(false);
  const [form, setForm] = React.useState({ name: '', phone: '', size: '', message: '' });
  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setSent(true);
  };

  return (
    <section id="application" className="application">
      <div className="application-inner">
        <Reveal className="application-media">
          <span className="frame"></span>
          <img src="images/about.jpg" alt="Once Upon a Time" />
        </Reveal>

        <Reveal className="form-card" delay={2}>
          <div className="section-eyebrow">— Письмо нам</div>
          <h2 className="section-title" style={{ fontSize: 'clamp(34px, 4vw, 52px)' }}>
            Оставить <span className="it">заявку</span>
          </h2>
          <p className="section-lead" style={{ fontSize: 17, marginTop: 8 }}>
            Расскажите, что вы ищете — подберём вещь или соберём капсулу под ваш стиль.
          </p>

          {!sent ? (
            <form className="form-grid" onSubmit={submit}>
              <div className="field">
                <label htmlFor="f-name">Имя</label>
                <input id="f-name" type="text" value={form.name} onChange={update('name')} placeholder="Анна" required />
              </div>
              <div className="field">
                <label htmlFor="f-phone">Телефон</label>
                <input id="f-phone" type="tel" value={form.phone} onChange={update('phone')} placeholder="+7 ___ ___ __ __" required />
              </div>
              <div className="field">
                <label htmlFor="f-size">Размер / параметры</label>
                <input id="f-size" type="text" value={form.size} onChange={update('size')} placeholder="S · 42 · 168" />
              </div>
              <div className="field">
                <label htmlFor="f-style">Стиль</label>
                <select id="f-style">
                  <option>Прованс / нежный</option>
                  <option>Парижская богема</option>
                  <option>Английский кантри</option>
                  <option>Подберите за меня</option>
                </select>
              </div>
              <div className="field full">
                <label htmlFor="f-msg">Что ищете</label>
                <textarea id="f-msg" value={form.message} onChange={update('message')}
                  placeholder="Например: блуза с ботанической вышивкой, любимый цвет — терракотовый…" />
              </div>
              <div className="field full" style={{ marginTop: 8 }}>
                <button type="submit" className="btn-primary">
                  <span>Оставить заявку</span>
                </button>
              </div>
              <p className="consent">
                Нажимая «Оставить заявку», вы соглашаетесь на обработку указанных в заявке данных
                ООО «Яндекс» (119021, г. Москва, ул. Льва Толстого, д. 16) на условиях
                {' '}<a href="https://yandex.ru/legal/confidential/" target="_blank" rel="noopener">Политики конфиденциальности</a>,
                а также на передачу и последующую обработку организацией, которой направляется заявка,
                для целей получения информации по заявке, включая бронирование услуг.
              </p>
            </form>
          ) : (
            <div className="form-success">
              <h3>Спасибо.</h3>
              <p>Ваша история начинается. Мы свяжемся с вами в течение нескольких часов.</p>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
};

const Address = () => (
  <section id="address" className="address">
    <Reveal>
      <div className="section-eyebrow">— Как нас найти</div>
      <h2 className="section-title">Заходите <span className="it">в гости</span></h2>
      <a className="address-card" href="https://yandex.ru/maps?ll=60.610062%2C56.835487&mode=routes&rtext=~56.835487%2C60.610062&z=17" target="_blank" rel="noopener">
        <span className="label">Адрес</span>
        улица Малышева, 39<br/>Екатеринбург
      </a>
      <div className="contact-row">
        <a href="tel:+79965914217">+7 996 591 42 17</a>
        <span>·</span>
        <a href="https://t.me/OUPTime" target="_blank" rel="noopener">Telegram · @OUPTime</a>
      </div>
    </Reveal>
  </section>
);

const Footer = () => (
  <footer className="footer">
    <span className="mark">Once Upon a Time</span>
    Винтажная одежда · Екатеринбург · 2026
  </footer>
);

window.Application = Application;
window.Address = Address;
window.Footer = Footer;
