export const renderContactPage = (): string => {
  return `
    <main class="contact-page">
      <section class="contact-section">
        <h1>Contact</h1>
        <p>Ako želiš saradnju ili više informacija, koristi formu ispod.</p>

        <form class="contact-form" id="contact-form">
          <input type="text" name="name" placeholder="Ime" required />
          <input type="email" name="email" placeholder="Email" required />
          <textarea name="message" placeholder="Poruka" rows="6" required></textarea>
          <button type="submit">Pošalji poruku</button>
        </form>

        <p id="contact-message" class="form-message"></p>
      </section>
    </main>
  `;
};