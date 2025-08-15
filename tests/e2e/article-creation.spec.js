// ===============================================
// 📁 tests/e2e/article-creation.spec.js
import { test, expect } from '@playwright/test'

test.describe('Article Creation', () => {
  test.beforeEach(async ({ page }) => {
    // Se connecter en tant qu'admin
    await page.goto('/secret-admin-access')
    // ... processus de connexion
  })

  test('should create and publish article', async ({ page }) => {
    await page.goto('/create')
    
    // Remplir le formulaire d'article
    await page.fill('[data-testid="article-title"]', 'Mon Premier Article')
    
    // Sélectionner une catégorie
    await page.selectOption('[data-testid="category-select"]', 'developpement')
    
    // Écrire du contenu dans l'éditeur Tiptap
    await page.click('[data-testid="tiptap-editor"]')
    await page.type('[data-testid="tiptap-editor"]', 'Ceci est le contenu de mon article de test.')
    
    // Publier l'article
    await page.click('button:has-text("Publier l\'article")')
    
    // Vérifier la redirection vers l'article
    await expect(page).toHaveURL(/\/articles\/mon-premier-article/)
    await expect(page.locator('h1')).toContainText('Mon Premier Article')
  })

  test('should save draft automatically', async ({ page }) => {
    await page.goto('/create')
    
    await page.fill('[data-testid="article-title"]', 'Brouillon Auto')
    await page.type('[data-testid="tiptap-editor"]', 'Contenu du brouillon')
    
    // Attendre la sauvegarde automatique
    await expect(page.locator('text=Brouillon sauvegardé')).toBeVisible({ timeout: 35000 })
    
    // Aller à la page des brouillons
    await page.goto('/drafts')
    
    await expect(page.locator('text=Brouillon Auto')).toBeVisible()
  })
})