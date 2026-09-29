// Root app

const App = () => (
  <React.Fragment>
    <Header />
    <main>
      <Hero />
      <Divider />
      <About />
      <Selection />
      <Capsules />
      <Divider />
      <Catalog cols={3} />
      <Application />
      <Address />
    </main>
    <Footer />
  </React.Fragment>
);

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
