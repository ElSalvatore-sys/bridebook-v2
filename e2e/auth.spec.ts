import { test, expect } from './fixtures/test-fixtures'

test.describe('Authentication', () => {
  test('landing page shows Get Started link', async ({ page }) => {
    await page.goto('/')

    const getStarted = page.getByRole('link', { name: 'Get Started' })

    await expect(getStarted).toBeVisible()
    await expect(getStarted).toHaveAttribute('href', '/signup')
  })

  test('login form renders with all fields', async ({ page }) => {
    await page.goto('/login')

    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible()
    await expect(page.getByRole('button', { name: /Continue with Google/i })).toBeVisible()
  })

  test('valid login redirects to dashboard', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel('Email').fill(
      process.env.E2E_TEST_USER_EMAIL || 'dev-user@test.com'
    )
    await page.getByLabel('Password').fill(
      process.env.E2E_TEST_USER_PASSWORD || 'TestPassword123!'
    )
    await page.getByRole('button', { name: 'Sign In' }).click()

    await page.waitForURL('**/dashboard', { timeout: 15000 })
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test('invalid credentials shows error', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel('Email').fill('invalid@example.com')
    await page.getByLabel('Password').fill('WrongPassword999!')
    await page.getByRole('button', { name: 'Sign In' }).click()

    await expect(page.getByText(/Invalid login credentials/i)).toBeVisible({ timeout: 10000 })
  })

  test('signup page shows role selection', async ({ page }) => {
    await page.goto('/signup')

    await expect(page.getByText('Fan')).toBeVisible()
    await expect(page.getByText('Artist')).toBeVisible()
    await expect(page.getByText('Venue')).toBeVisible()
  })
})
