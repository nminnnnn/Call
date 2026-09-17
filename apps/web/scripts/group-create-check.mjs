import { chromium } from "playwright-core";

const baseUrl = process.env.BASE_URL ?? "http://localhost:5175";
const browser = await chromium.launch({ channel: "msedge", headless: true });

async function newDemoPage(viewport) {
  const page = await browser.newPage({ viewport });
  await page.addInitScript(() => {
    window.localStorage.setItem("mach.demo.session", JSON.stringify({ version: 1, accountId: "u-01", name: "Minh Anh", startedAt: new Date().toISOString() }));
  });
  return page;
}

try {
  await checkInitialFocusNotForced();
  await checkGroupCreate({ name: "desktop", width: 1440, height: 900, checkDrawer: false });
  await checkGroupCreate({ name: "mobile", width: 390, height: 844, checkDrawer: true });
  await checkDialogFocus();
  await checkSubmittingEscapeKeepsFocusInside();
  await checkAbandonedCreateOnRouteChange();
  await checkCreateClearsSearch();
  console.log("group-create: validation, member selection, navigation, member panel/drawer and send flow PASS");
} finally {
  await browser.close();
}

async function checkInitialFocusNotForced() {
  const page = await newDemoPage({ width: 1440, height: 900 });
  try {
    await page.goto(`${baseUrl}/messages`, { waitUntil: "networkidle" });
    await page.locator(".conversation-item").first().waitFor();
    const triggerFocused = await page.locator("[data-dialog-return-focus='true']").evaluate((element) => element === document.activeElement);
    if (triggerFocused) throw new Error("Create-group trigger received focus before dialog interaction");
    console.log("group-create-initial-focus: PASS");
  } finally {
    await page.close();
  }
}

async function checkDialogFocus() {
  const page = await newDemoPage({ width: 1440, height: 900 });
  try {
    await page.goto(`${baseUrl}/messages`, { waitUntil: "networkidle" });
    await page.locator(".conversation-item").first().waitFor();
    const trigger = page.locator(".sidebar-header .ui-icon-button");
    await trigger.click();
    await page.locator(".ui-dialog").waitFor();
    await page.keyboard.press("Shift+Tab");
    const focusInsideDialog = await page.evaluate(() => Boolean(document.querySelector(".ui-dialog")?.contains(document.activeElement)));
    if (!focusInsideDialog) throw new Error("Dialog focus escaped after Shift+Tab");
    await page.keyboard.press("Escape");
    await page.locator(".ui-dialog").waitFor({ state: "detached" });
    await page.waitForTimeout(500);
    const focusState = await trigger.evaluate((element) => ({
      restored: element === document.activeElement,
      activeTag: document.activeElement?.tagName,
      activeClass: document.activeElement?.getAttribute("class"),
      activeLabel: document.activeElement?.getAttribute("aria-label"),
      triggerLabel: element.getAttribute("aria-label"),
      returnFocusCount: document.querySelectorAll("[data-dialog-return-focus='true']").length,
    }));
    if (!focusState.restored) throw new Error(`Dialog did not restore focus to the create-group trigger: ${JSON.stringify(focusState)}`);
    console.log("group-create-focus: PASS");
  } finally {
    await page.close();
  }
}

async function checkCreateClearsSearch() {
  const page = await newDemoPage({ width: 1440, height: 900 });
  try {
    await page.goto(`${baseUrl}/messages`, { waitUntil: "networkidle" });
    await page.locator(".conversation-item").first().waitFor();
    await page.getByLabel("Tìm hội thoại").fill("no-match-filter");
    await page.getByRole("heading", { name: "Không tìm thấy" }).waitFor();
    await page.locator(".sidebar-header .ui-icon-button").click();
    await page.locator(".ui-dialog").waitFor();

    await page.locator(".group-dialog .ui-input").fill("Visible After Filter");
    await page.locator(".group-member-option input").nth(0).check();
    await page.locator(".group-dialog button[type='submit']").click();
    await page.waitForURL(/\/messages\/group-/);
    await page.locator(".chat-header h2", { hasText: "Visible After Filter" }).waitFor();
    await page.locator(".conversation-sidebar").getByRole("button", { name: /Visible After Filter/ }).waitFor();
    const searchValue = await page.getByLabel("Tìm hội thoại").inputValue();
    if (searchValue) throw new Error("Conversation search was not cleared after group creation");
    console.log("group-create-clears-search: PASS");
  } finally {
    await page.close();
  }
}

async function checkSubmittingEscapeKeepsFocusInside() {
  const page = await newDemoPage({ width: 1440, height: 900 });
  try {
    await page.goto(`${baseUrl}/messages`, { waitUntil: "networkidle" });
    await page.locator(".conversation-item").first().waitFor();
    await page.locator(".sidebar-header .ui-icon-button").click();
    await page.locator(".ui-dialog").waitFor();
    await page.locator(".group-dialog .ui-input").fill("Escape While Submitting");
    await page.locator(".group-member-option input").nth(0).check();
    await page.locator(".group-dialog button[type='submit']").click();
    await page.keyboard.press("Escape");
    for (let index = 0; index < 6; index += 1) await page.keyboard.press("Tab");
    const focusInsideDialog = await page.evaluate(() => Boolean(document.querySelector(".ui-dialog")?.contains(document.activeElement)));
    if (!focusInsideDialog) throw new Error("Escape during group creation moved focus outside the open dialog");
    await page.waitForURL(/\/messages\/group-/);
    await page.locator(".chat-header h2", { hasText: "Escape While Submitting" }).waitFor();
    console.log("group-create-submitting-escape: PASS");
  } finally {
    await page.close();
  }
}

async function checkAbandonedCreateOnRouteChange() {
  const page = await newDemoPage({ width: 1440, height: 900 });
  try {
    await page.goto(`${baseUrl}/messages`, { waitUntil: "networkidle" });
    await page.locator(".conversation-item").first().waitFor();
    await page.locator(".conversation-sidebar").getByRole("button", { name: /Gia/ }).click();
    await page.waitForURL(/\/messages\/gia-bao/);
    await page.locator(".sidebar-header .ui-icon-button").click();
    await page.locator(".ui-dialog").waitFor();
    await page.locator(".group-dialog .ui-input").fill("Abandoned Create");
    await page.locator(".group-member-option input").nth(0).check();
    await page.locator(".group-dialog button[type='submit']").click();
    await page.goBack();
    await page.waitForURL(/\/messages$/);
    await page.waitForTimeout(650);
    if (await page.locator(".ui-dialog").count()) throw new Error("Abandoned group create left the dialog open");
    if (!page.url().endsWith("/messages")) throw new Error(`Abandoned group create redirected to ${page.url()}`);
    console.log("group-create-abandoned-route: PASS");
  } finally {
    await page.close();
  }
}

async function checkGroupCreate(testCase) {
  const page = await newDemoPage({ width: testCase.width, height: testCase.height });
  try {
    await page.goto(`${baseUrl}/messages`, { waitUntil: "networkidle" });
    await page.locator(".conversation-item").first().waitFor();
    await page.locator(".sidebar-header .ui-icon-button").click();
    await page.locator(".ui-dialog").waitFor();

    const metrics = await page.evaluate(() => ({
      viewportWidth: window.innerWidth,
      documentWidth: document.documentElement.scrollWidth,
    }));
    if (metrics.documentWidth > metrics.viewportWidth) {
      throw new Error(`${testCase.name} has horizontal overflow in group dialog`);
    }

    const title = `Demo QA ${testCase.name}`;
  await page.locator(".group-dialog button[type='submit']").click();
  await page.locator(".group-dialog__error").waitFor();

    await page.locator(".group-dialog .ui-input").fill(title);
  await page.locator(".group-member-option input").nth(0).check();
  await page.locator(".group-member-option input").nth(1).check();
  await page.locator(".group-dialog button[type='submit']").click();

  await page.waitForURL(/\/messages\/group-/);
    await page.locator(".chat-header h2", { hasText: title }).waitFor();
  await page.locator(".chat-header__title p", { hasText: "3" }).waitFor();
  await page.getByRole("heading", { name: "Chưa có tin nhắn" }).waitFor();

    if (testCase.checkDrawer) {
      await page.locator(".chat-header__actions .ui-icon-button").last().click();
      await page.locator(".ui-drawer").waitFor();
    }

    const memberScope = testCase.checkDrawer ? ".ui-drawer" : ".info-panel";
    const members = await page.locator(`${memberScope} .member-row`).count();
  if (members !== 3) throw new Error(`Expected 3 group members, found ${members}`);
    if (testCase.checkDrawer) {
      await page.locator(".ui-drawer header .ui-icon-button").click();
      await page.locator(".ui-drawer").waitFor({ state: "detached" });
    }

    const messageText = `Tin nhắn kiểm tra nhóm demo ${testCase.name}`;
  await page.locator(".composer .ui-textarea").fill(messageText);
  await page.locator(".composer__send").click();
  await page.locator(".message__bubble p", { hasText: messageText }).waitFor();
    console.log(`group-create-${testCase.name}: PASS`);
  } finally {
    await page.close();
  }
}
