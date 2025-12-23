import { writeFile } from "node:fs/promises";
import { browser } from "vibium";

const vibe = await browser.launch({ headless: true });

try {
  await vibe.go("https://the-internet.herokuapp.com/");

  const link = await vibe.find('a[href="/add_remove_elements/"]');
  await link.click();

  await vibe.find("h3");

  const screenshot = await vibe.screenshot();
  await writeFile("after-click.png", screenshot);
} finally {
  await vibe.quit();
}
