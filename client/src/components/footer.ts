export const renderFooter = (): string => {
  return `
    <footer class="site-footer">
      <div class="footer-content">
        <div class="footer-brand">
          <h3>Prodavnica</h3>
          <p>Minimalni TypeScript + SQLite webshop projekat.</p>
        </div>

        <div class="footer-links">
          <button type="button" onclick="window.navigate('/')">Home</button>
          <button type="button" onclick="window.navigate('/products')">Products</button>
          <button type="button" onclick="window.navigate('/about')">About</button>
          <button type="button" onclick="window.navigate('/contact')">Contact</button>
        </div>
      </div>
    </footer>
  `;
};