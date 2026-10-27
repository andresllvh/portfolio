import { expect, test } from "@playwright/test";

test.describe("portfolio", () => {
  test("shows name, role and the resume link", async ({ page, request }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/André Santos/);

    const hero = page.locator('[data-kb-section="hero"]');
    await expect(hero.locator("h1")).toContainText("André");
    await expect(hero).toContainText("Desenvolvedor Front-End Jr.");

    const cv = hero.getByRole("link", { name: /Baixar CV/ });
    await expect(cv).toHaveAttribute("href", "/cv.pdf");
    const pdf = await request.get("/cv.pdf");
    expect(pdf.ok()).toBe(true);
    expect(pdf.headers()["content-type"]).toContain("pdf");
  });

  test("renders every project and opens its details", async ({ page }) => {
    await page.goto("/");
    const sections = page.locator('[data-kb-section^="project"]');
    await expect(sections).toHaveCount(4);

    const cubo = page.locator('[data-kb-section="project4"]');
    await cubo.scrollIntoViewIfNeeded();
    await cubo.getByRole("button", { name: /Ver mais/ }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toContainText("CuboVision");
    await expect(dialog.getByRole("link", { name: /Abrir site/ })).toHaveAttribute(
      "href",
      "https://cubovision.vercel.app"
    );
  });

  test("publishes structured data about the author", async ({ page }) => {
    await page.goto("/");
    const raw = await page.locator('script[type="application/ld+json"]').textContent();
    const data = JSON.parse(raw ?? "{}");
    expect(data["@type"]).toBe("Person");
    expect(data.sameAs).toContain("https://github.com/andresllvh");
  });

  test("serves robots.txt and sitemap.xml", async ({ request }) => {
    const robots = await request.get("/robots.txt");
    expect(await robots.text()).toContain("sitemap.xml");
    const sitemap = await request.get("/sitemap.xml");
    expect(await sitemap.text()).toContain("<loc>");
  });

  test("shows a friendly 404 page", async ({ page }) => {
    const response = await page.goto("/pagina-que-nao-existe");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Página não encontrada");
    await expect(page.getByRole("link", { name: "Voltar ao portfólio" })).toHaveAttribute("href", "/");
  });
});

test.describe("on a phone", () => {
  test.skip(({ isMobile }) => !isMobile, "phone-only behavior");

  test("opens straight on the hero, without the photo intro", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#hero-intro")).toHaveCount(0);
    await expect(page.getByRole("link", { name: /Baixar CV/ })).toBeInViewport();
  });

  test("shows the stack as a tappable grid", async ({ page }) => {
    await page.goto("/");
    const tiles = page.locator(".skill-tile");
    await expect(tiles).toHaveCount(15);
    await tiles.filter({ hasText: "Supabase" }).click();
    await expect(page.getByRole("status").filter({ hasText: "Supabase ·" })).toBeVisible();
  });
});
