import { writeFileSync } from "node:fs";
import { browserSync } from "vibium";

const vibe = browserSync.launch({ headless: true });

try {
  vibe.go("https://the-internet.herokuapp.com/");

  const link = vibe.find('a[href="/add_remove_elements/"]');
  link.click();

  vibe.find("h3");

  const screenshot = vibe.screenshot();
  writeFileSync("after-click.png", screenshot);
} finally {
  vibe.quit();
}
