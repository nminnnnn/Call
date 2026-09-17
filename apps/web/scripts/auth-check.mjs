import { chromium } from "playwright-core";

const baseUrl = process.env.BASE_URL ?? "http://localhost:5175";
const browser = await chromium.launch({ channel: "msedge", headless: true });

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(`${baseUrl}/messages/du-an-mach`, { waitUntil: "networkidle" });
  await page.waitForURL("**/login?next=%2Fmessages%2Fdu-an-mach");
  await page.getByRole("heading", { name: "Đăng nhập bản demo" }).waitFor();

  await page.getByLabel("Email demo").fill("sai@mach.demo");
  await page.getByLabel("Mật khẩu demo").fill("khong-dung");
  await page.getByRole("button", { name: /^Đăng nhập/ }).click();
  await page.getByRole("alert").waitFor();
  if (!page.url().includes("/login")) throw new Error("Đăng nhập sai vẫn rời trang login");

  await page.getByRole("button", { name: "Trải nghiệm demo" }).click();
  await page.waitForURL("**/messages/du-an-mach");
  await page.locator(".chat-header h2", { hasText: "Dự án Mạch" }).waitFor();

  await page.reload({ waitUntil: "networkidle" });
  await page.locator(".chat-header h2", { hasText: "Dự án Mạch" }).waitFor();

  await page.getByRole("button", { name: "Đăng xuất" }).click();
  await page.waitForURL("**/login");
  const storedSession = await page.evaluate(() => window.localStorage.getItem("mach.demo.session"));
  if (storedSession !== null) throw new Error("Đăng xuất chưa xóa phiên demo");

  await page.evaluate(() => window.localStorage.setItem("mach.demo.session", "not-json"));
  await page.goto(`${baseUrl}/contacts`, { waitUntil: "networkidle" });
  await page.waitForURL("**/login?next=%2Fcontacts");

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto(`${baseUrl}/login`, { waitUntil: "networkidle" });
  const mobileMetrics = await mobile.evaluate(() => ({ viewportWidth: window.innerWidth, documentWidth: document.documentElement.scrollWidth }));
  if (mobileMetrics.documentWidth > mobileMetrics.viewportWidth) throw new Error("Trang login bị tràn ngang trên mobile");
  await mobile.getByRole("button", { name: "Trải nghiệm demo" }).click();
  await mobile.waitForURL("**/messages");
  const mobileLogout = mobile.getByRole("button", { name: "Đăng xuất" });
  await mobileLogout.waitFor();
  if (!(await mobileLogout.isVisible())) throw new Error("Nút đăng xuất không hiển thị trên mobile");
  await mobileLogout.click();
  await mobile.waitForURL("**/login");

  console.log("auth-flow: redirect, invalid credentials, demo entry, refresh persistence, desktop/mobile logout, malformed-session rejection PASS");
} finally {
  await browser.close();
}
