export const renderAboutPage = (): string => {
  return `
    <main class="about-page">
      <section class="about-section">
        <h1>About</h1>
        <p>
          Ova prodavnica je full-stack webshop projekat napravljen uz TypeScript,
          Node.js, Express i SQLite bazu.
        </p>

        <p>
          Projekat sadrži autentifikaciju korisnika i admina, prikaz proizvoda,
          carousel istaknutih proizvoda, korpu, porudžbine i admin panel za upravljanje.
        </p>

        <p>
          Cilj projekta je da prikaže funkcionalan e-commerce sistem sa fokusom na
          čist kod, preglednu strukturu i realne funkcionalnosti koje pravi shop koristi.
        </p>
      </section>
    </main>
  `;
};