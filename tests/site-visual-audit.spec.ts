import { expect, test } from "@playwright/test";

const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";

const publicRoutes = [
  { name: "home", path: "/" },
  { name: "supporters", path: "/supporters" },
  { name: "bowling", path: "/bowling-for-backpacks" },
  { name: "gala", path: "/gala" },
  { name: "development", path: "/development" },
];

const viewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 1100 },
];

test.describe("site visual audit", () => {
  for (const viewport of viewports) {
    for (const route of publicRoutes) {
      test(`${route.name} has no visible overflow at ${viewport.name}`, async ({
        page,
      }, testInfo) => {
        await page.setViewportSize(viewport);
        await page.goto(`${baseUrl}${route.path}`, { waitUntil: "networkidle" });

        await expect(page.locator("body")).toBeVisible();

        const metrics = await page.evaluate(() => ({
          bodyWidth: document.body.scrollWidth,
          viewportWidth: window.innerWidth,
          documentHeight: document.documentElement.scrollHeight,
          visibleText: document.body.innerText.slice(0, 500),
        }));

        const screenshot = await page.screenshot({
          fullPage: true,
          path: `tests/visual-artifacts/${route.name}-${viewport.name}.png`,
        });

        await testInfo.attach(`${route.name}-${viewport.name}.png`, {
          body: screenshot,
          contentType: "image/png",
        });

        expect(metrics.bodyWidth).toBeLessThanOrEqual(metrics.viewportWidth + 1);
        expect(metrics.documentHeight).toBeGreaterThan(100);
        expect(metrics.visibleText.length).toBeGreaterThan(20);
      });
    }
  }

  test("primary public paths expose clear CTAs", async ({ page }) => {
    await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
    await expect(page.getByRole("link", { name: "View supporter events" })).toBeVisible();

    await page.goto(`${baseUrl}/supporters`, { waitUntil: "networkidle" });
    await expect(page.getByRole("link", { name: "Register or sponsor" })).toBeVisible();

    await page.goto(`${baseUrl}/bowling-for-backpacks`, {
      waitUntil: "networkidle",
    });
    const sponsorshipSection = page.locator("#sponsorships");
    await expect(
      sponsorshipSection.getByRole("heading", { name: "Event Sponsor - $5,000" }),
    ).toBeVisible();
    await expect(
      sponsorshipSection.getByRole("heading", {
        name: "Team Sponsor / Team Registration",
      }),
    ).toBeVisible();
    await expect(
      sponsorshipSection.getByRole("heading", { name: "Lane Sponsor" }),
    ).toBeVisible();

    await page.goto(`${baseUrl}/gala`, { waitUntil: "networkidle" });
    await expect(
      page.getByRole("heading", {
        name: "Reserve your place at Stories From the Center.",
      }),
    ).toBeVisible();
  });

  test("visible internal links and same-page anchors are valid", async ({
    page,
    request,
  }) => {
    const internalPaths = new Set<string>();

    for (const route of publicRoutes) {
      await page.goto(`${baseUrl}${route.path}`, { waitUntil: "networkidle" });

      const linkReport = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href]"));

        return links.map((link) => {
          const href = link.getAttribute("href") ?? "";
          const url = new URL(href, window.location.href);
          const isSameOrigin = url.origin === window.location.origin;
          const isSamePage = url.pathname === window.location.pathname;
          const anchorExists = url.hash
            ? Boolean(document.getElementById(decodeURIComponent(url.hash.slice(1))))
            : true;

          return {
            href,
            isSameOrigin,
            isSamePage,
            anchorExists,
            pathname: url.pathname,
          };
        });
      });

      for (const link of linkReport) {
        if (link.isSameOrigin && link.isSamePage) {
          expect(link.anchorExists, `${route.path} missing ${link.href}`).toBeTruthy();
        }

        if (
          link.isSameOrigin &&
          !link.pathname.startsWith("/api/") &&
          !link.pathname.includes("[")
        ) {
          internalPaths.add(link.pathname);
        }
      }
    }

    for (const path of internalPaths) {
      const response = await request.get(`${baseUrl}${path}`);
      expect(response.status(), `${path} should resolve`).toBeLessThan(400);
    }
  });

  test("primary CTAs keep layout stable on hover", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1100 });

    const hoverTargets = [
      { path: "/", name: "View supporter events" },
      { path: "/supporters", name: "Register or sponsor" },
      { path: "/bowling-for-backpacks", name: "Register a Team" },
      { path: "/gala", name: "Reserve Your Place" },
    ];

    for (const target of hoverTargets) {
      await page.goto(`${baseUrl}${target.path}`, { waitUntil: "networkidle" });
      const locator = page.getByRole("link", { name: target.name }).first();
      await locator.hover();
      const widths = await page.evaluate(() => ({
        bodyWidth: document.body.scrollWidth,
        viewportWidth: window.innerWidth,
      }));
      expect(widths.bodyWidth).toBeLessThanOrEqual(widths.viewportWidth + 1);
    }
  });
});
