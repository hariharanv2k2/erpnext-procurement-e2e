import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { ENV } from '../config/env.config';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login(ENV.ERP_USERNAME, ENV.ERP_PASSWORD);

  // Save signed-in state
  await page.context().storageState({ path: authFile });
});
