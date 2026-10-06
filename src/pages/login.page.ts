import type { Page } from '@playwright/test';
import { LOGIN } from '../selectors';

export class LoginPage {
  constructor(private page: Page) {}

  async navigate(): Promise<void> {
    await this.page.goto('/login');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async login(username: string, password: string): Promise<void> {
    const emailField = this.page.locator(LOGIN.emailInput).first();
    await emailField.waitFor({ state: 'visible', timeout: 15000 });
    await emailField.fill(username);

    const passwordField = this.page.locator(LOGIN.passwordInput).first();
    await passwordField.waitFor({ state: 'visible', timeout: 15000 });
    await passwordField.fill(password);

    await this.page.locator(LOGIN.submitBtn).first().click();

    // Wait for redirect after login (Frappe v16 uses /desk, older versions use /app)
    await this.page.waitForURL(url => {
      const path = url.pathname;
      return path.startsWith('/app') || path.startsWith('/desk') || path === '/';
    }, { timeout: 30000 });
    await this.page.waitForLoadState('domcontentloaded');
  }
}
