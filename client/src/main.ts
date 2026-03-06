const app = document.getElementById("app");

if (!app) {
  throw new Error("App root element not found.");
}

app.innerHTML = `
  <main class="home-page">
    <section class="hero">
      <h1>Online Shop</h1>
      <p>Frontend radi iz TypeScript-a.</p>
    </section>
  </main>
`;