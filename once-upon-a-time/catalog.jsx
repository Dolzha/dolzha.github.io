// Catalog — 3 / 2 / 1 (list) layouts

const PRODUCTS = [
  {
    num: '№ 01',
    tag: 'Блуза',
    title: 'Прованская нежность',
    price: '1000 ₽',
    image: 'images/item-blouse.jpg',
    desc: 'Легкая блуза из натуральной хлопковой ткани кремового оттенка. Свободный крой «бэби-долл» с завышенной линией талии.'
  },
  {
    num: '№ 02',
    tag: 'Юбка',
    title: 'Винтажный сад',
    price: '1200 ₽',
    image: 'images/item-skirt.jpg',
    desc: 'Мини-юбка трапециевидного силуэта, выполненная из плотной фактурной ткани с гобеленовым плетением, крупного цветочного принта в пыльных розовых, терракотовых и золотистых оттенках.'
  },
  {
    num: '№ 03',
    tag: 'Кепи',
    title: 'Кепи Монмартр',
    price: '900 ₽',
    image: 'images/item-cap.jpg',
    desc: 'Стильное кепи в нежном молочном оттенке.'
  },
];

const ProductCard = ({ p, index, layout }) => (
  <Reveal as="article" className="product" delay={Math.min(index + 1, 4)}>
    <div className="product-media">
      <span className="product-num">{p.num}</span>
      <span className="product-tag">{p.tag}</span>
      <img src={p.image} alt={p.title} loading="lazy" />
    </div>
    <div className="product-body">
      <h3 className="product-title">{p.title}</h3>
      <div className="product-price">
        <span className="amount">{p.price}</span>
        <span style={{ fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>за шт.</span>
      </div>
      <p className="product-desc">{p.desc}</p>
    </div>
  </Reveal>
);

const Catalog = ({ cols }) => {
  const colsClass = cols === 3 ? 'cols-3' : cols === 2 ? 'cols-2' : 'cols-1';
  return (
    <section id="catalog" className="section">
      <Reveal className="catalog-head">
        <div className="section-eyebrow">— Прайс-лист</div>
        <h2 className="section-title"><span className="it">Коллекция</span> сезона</h2>
        <p className="section-lead">
          Несколько избранных артефактов из нашей текущей коллекции.
          Каждая позиция существует в единственном экземпляре.
        </p>
      </Reveal>
      <div className={"catalog " + colsClass}>
        {PRODUCTS.map((p, i) => <ProductCard key={p.num} p={p} index={i} layout={cols} />)}
      </div>
    </section>
  );
};

window.Catalog = Catalog;
