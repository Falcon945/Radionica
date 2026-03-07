import type { AuthUser } from "../types/Auth.js";

export const renderAuthStatus = (user: AuthUser | null): string => {
  if (!user) {
    return `
      <section class="auth-status">
        <div class="auth-status-content">
          <span>Nisi ulogovan.</span>
        </div>
      </section>
    `;
  }

  return `
    <section class="auth-status">
      <div class="auth-status-content">
        <span>Ulogovan: <strong>${user.name}</strong> (${user.role})</span>
        <button id="logout-btn" class="secondary-btn" type="button">Logout</button>
      </div>
    </section>
  `;
};

export const renderAuthForms = (): string => {
  return `
    <section class="auth-section">
      <div class="auth-grid">

        <article class="auth-card">
          <h2>Register</h2>

          <form id="register-form" class="auth-form">
            <input type="text" name="name" placeholder="Ime" required />
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Lozinka" required />

            <button type="submit">
              Registracija
            </button>
          </form>

          <p id="register-message" class="form-message"></p>
        </article>

        <article class="auth-card">
          <h2>Login</h2>

          <form id="login-form" class="auth-form">
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Lozinka" required />

            <button type="submit">
              Prijava
            </button>
          </form>

          <p id="login-message" class="form-message"></p>
        </article>

      </div>
    </section>
  `;
};