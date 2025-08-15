// ===============================================
// 📁 tests/e2e/auth.spec.js (Playwright)
import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should complete login flow', async ({ page }) => {
    // Aller à la page de connexion secrète
    await page.goto('/secret-admin-access')
    
    // Cliquer sur le lien de connexion
    await page.click('text=Se connecter')
    
    // Remplir le formulaire de connexion
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'testpassword')
    
    // Soumettre le formulaire
    await page.click('button[type="submit"]')
    
    // Vérifier la redirection
    await expect(page).toHaveURL('/')
    
    // Vérifier que l'utilisateur est connecté
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login')
    
    await page.fill('[name="email"]', 'wrong@example.com')
    await page.fill('[name="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')
    
    // Vérifier le message d'erreur
    await expect(page.locator('text=Identifiants invalides')).toBeVisible()
  })

  test('should complete signup flow', async ({ page }) => {
    await page.goto('/signup')
    
    await page.fill('[name="name"]', 'New User')
    await page.fill('[name="username"]', 'newuser')
    await page.fill('[name="email"]', 'new@example.com')
    await page.fill('[name="password"]', 'newpassword')
    
    await page.click('button[type="submit"]')
    
    await expect(page).toHaveURL('/')
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible()
  })
})