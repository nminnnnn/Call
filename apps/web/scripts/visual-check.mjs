import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const baseUrl = process.env.BASE_URL ?? "http://localhost:5175";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const outputDir = resolve("../../.qa/playwright");
await mkdir(outputDir, { recursive: true });

const cases = [
  { name: "desktop", viewport: { width: 1440, height: 900 }, path: "/messages/du-an-mach" },
  { name: "tablet", viewport: { width: 900, height: 1100 }, path: "/messages/du-an-mach" },
  { name: "mobile-list", viewport: { width: 390, height: 844 }, path: "/messages" },
  { name: "mobile-chat", viewport: { width: 390, height: 844 }, path: "/messages/du-an-mach" },
];

let failed = false;
for (const testCase of cases) {
  const page = await browser.newPage({ viewport: testCase.viewport });
  await page.addInitScript(() => {
    window.localStorage.setItem("mach.demo.session", JSON.stringify({ version: 1, accountId: "u-01", name: "Minh Anh", startedAt: new Date().toISOString() }));
  });
  await page.goto(`${baseUrl}${testCase.path}`, { waitUntil: "networkidle" });
  await page.waitForSelector(testCase.path === "/messages" ? ".conversation-item" : ".message, .ui-state");
  await page.waitForTimeout(450);
  const metrics = await page.evaluate(() => ({
    viewportWidth: window.innerWidth,
    documentWidth: document.documentElement.scrollWidth,
  }));
  await page.screenshot({ path: resolve(outputDir, `${testCase.name}.png`), fullPage: false });
  const overflow = metrics.documentWidth > metrics.viewportWidth;
  failed ||= overflow;
  console.log(`${testCase.name}: ${metrics.viewportWidth}px, overflow-x=${overflow ? "YES" : "no"}`);

  if (testCase.name === "desktop") {
    if (await page.locator(".unread-divider").count() !== 1) throw new Error("Không hiển thị đúng mốc tin nhắn mới");
    const replyTarget = page.locator(".message__bubble").filter({ hasText: "Môi trường staging" }).first();
    await replyTarget.hover();
    await replyTarget.getByTitle("Trả lời").click();
    await page.locator(".composer-wrap > .reply-preview").waitFor();
    const sentText = "Đã nhận, mình sẽ kiểm tra lại ngay.";
    await page.getByLabel("Nội dung tin nhắn").fill(sentText);
    await page.getByLabel("Gửi tin nhắn").click();
    await page.locator(".message__bubble p", { hasText: sentText }).waitFor();
    console.log("message-flow: unread, reply và gửi tin hoạt động qua mock repository");

    await page.locator(".conversation-sidebar").getByRole("button", { name: /Thanh Mai/ }).click();
    await page.waitForURL("**/messages/thanh-mai");
    await page.locator(".chat-header h2", { hasText: "Thanh Mai" }).waitFor();
    const header = await page.locator(".chat-header h2").textContent();
    const panel = await page.locator(".info-content__identity h3").first().textContent();
    if (header !== "Thanh Mai" || panel !== "Thanh Mai") throw new Error("Header và panel không đồng bộ khi đổi hội thoại");

    await page.locator(".conversation-sidebar").getByRole("button", { name: /Gia Bảo/ }).click();
    await page.waitForURL("**/messages/gia-bao");
    await page.getByRole("heading", { name: "Chưa có tin nhắn" }).waitFor();
    console.log("conversation-switch: header, messages và info panel đồng bộ");
  }
  await page.close();
}

await browser.close();
if (failed) process.exitCode = 1;
