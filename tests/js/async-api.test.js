/**
 * JS Library Tests: Async API
 * Tests browser.launch() and async Vibe methods
 */

const { test, describe } = require('node:test');
const assert = require('node:assert');

// Import from built library
const { browser } = require('../../clients/javascript/dist');

describe('JS Async API', () => {
  test('browser.launch() and vibe.quit() work', async () => {
    const vibe = await browser.launch({ headless: true });
    assert.ok(vibe, 'Should return a Vibe instance');
    await vibe.quit();
  });

  test('vibe.go() navigates to URL', async () => {
    const vibe = await browser.launch({ headless: true });
    try {
      await vibe.go('https://the-internet.herokuapp.com/');
      // If we get here without error, navigation worked
      assert.ok(true);
    } finally {
      await vibe.quit();
    }
  });

  test('vibe.screenshot() returns PNG buffer', async () => {
    const vibe = await browser.launch({ headless: true });
    try {
      await vibe.go('https://the-internet.herokuapp.com/');
      const screenshot = await vibe.screenshot();

      assert.ok(Buffer.isBuffer(screenshot), 'Should return a Buffer');
      assert.ok(screenshot.length > 1000, 'Screenshot should have reasonable size');

      // Check PNG magic bytes
      assert.strictEqual(screenshot[0], 0x89, 'Should be valid PNG');
      assert.strictEqual(screenshot[1], 0x50, 'Should be valid PNG');
      assert.strictEqual(screenshot[2], 0x4E, 'Should be valid PNG');
      assert.strictEqual(screenshot[3], 0x47, 'Should be valid PNG');
    } finally {
      await vibe.quit();
    }
  });

  test('vibe.evaluate() executes JavaScript', async () => {
    const vibe = await browser.launch({ headless: true });
    try {
      await vibe.go('https://the-internet.herokuapp.com/');
      const title = await vibe.evaluate('return document.title');
      assert.match(title, /The Internet/i, 'Should return page title');
    } finally {
      await vibe.quit();
    }
  });

  test('vibe.find() locates element', async () => {
    const vibe = await browser.launch({ headless: true });
    try {
      await vibe.go('https://the-internet.herokuapp.com/');
      const heading = await vibe.find('h1.heading');

      assert.ok(heading, 'Should return an Element');
      assert.ok(heading.info, 'Element should have info');
      assert.match(heading.info.tag, /^h1$/i, 'Should be an h1 tag');
      assert.match(heading.info.text, /Welcome to the-internet/i, 'Should have heading text');
    } finally {
      await vibe.quit();
    }
  });

  test('element.getAttribute() returns attribute value', async () => {
    const vibe = await browser.launch({ headless: true });
    try {
      await vibe.go('https://the-internet.herokuapp.com/');
      const link = await vibe.find('a[href="/add_remove_elements/"]');
      const href = await link.getAttribute('href');
      assert.strictEqual(href, '/add_remove_elements/', 'Should return href attribute');
    } finally {
      await vibe.quit();
    }
  });

  test('element.boundingBox() returns box dimensions', async () => {
    const vibe = await browser.launch({ headless: true });
    try {
      await vibe.go('https://the-internet.herokuapp.com/');
      const heading = await vibe.find('h1.heading');
      const box = await heading.boundingBox();
      assert.ok(box, 'Should return a bounding box');
      assert.ok(box.width > 0, 'Box should have width');
      assert.ok(box.height > 0, 'Box should have height');
    } finally {
      await vibe.quit();
    }
  });

  test('element.click() works', async () => {
    const vibe = await browser.launch({ headless: true });
    try {
      await vibe.go('https://the-internet.herokuapp.com/');
      const link = await vibe.find('a[href="/add_remove_elements/"]');
      await link.click();

      // After click, we should have navigated
      const heading = await vibe.find('h3');
      assert.match(heading.info.text, /Add\/Remove Elements/i, 'Should have navigated to new page');
    } finally {
      await vibe.quit();
    }
  });

  test('element.click() waits for element to become visible', async () => {
    const vibe = await browser.launch({ headless: true });
    try {
      await vibe.go('https://the-internet.herokuapp.com/');
      await vibe.evaluate(`
        const link = document.querySelector('a[href="/add_remove_elements/"]');
        if (link) {
          link.style.display = 'none';
          setTimeout(() => {
            link.style.display = 'block';
          }, 500);
        }
        return true;
      `);

      const link = await vibe.find('a[href="/add_remove_elements/"]');
      await link.click();

      const heading = await vibe.find('h3');
      assert.match(heading.info.text, /Add\/Remove Elements/i, 'Should navigate after click');
    } finally {
      await vibe.quit();
    }
  });

  test('element.type() enters text', async () => {
    const vibe = await browser.launch({ headless: true });
    try {
      await vibe.go('https://the-internet.herokuapp.com/inputs');
      const input = await vibe.find('input');
      await input.type('12345');

      // Verify the value was entered
      const value = await vibe.evaluate(`
        return document.querySelector('input').value;
      `);
      assert.strictEqual(value, '12345', 'Input should have typed value');
    } finally {
      await vibe.quit();
    }
  });

  test('element.text() returns element text', async () => {
    const vibe = await browser.launch({ headless: true });
    try {
      await vibe.go('https://the-internet.herokuapp.com/');
      const heading = await vibe.find('h1.heading');
      const text = await heading.text();
      assert.match(text, /Welcome to the-internet/i, 'Should return heading text');
    } finally {
      await vibe.quit();
    }
  });

  test('element.click() fails when element disappears', async () => {
    const vibe = await browser.launch({ headless: true });
    try {
      await vibe.go('https://the-internet.herokuapp.com/');
      const link = await vibe.find('a[href="/add_remove_elements/"]');
      await vibe.evaluate(`
        const link = document.querySelector('a[href="/add_remove_elements/"]');
        if (link) {
          link.remove();
        }
        return true;
      `);

      await assert.rejects(
        () => link.click({ timeout: 1000 }),
        /timeout|not found|actionable|enabled|stable|visible/i,
        'Clicking a removed element should fail'
      );
    } finally {
      await vibe.quit();
    }
  });

  test('element.type() fails on non-editable element', async () => {
    const vibe = await browser.launch({ headless: true });
    try {
      await vibe.go('https://the-internet.herokuapp.com/');
      const heading = await vibe.find('h1.heading');

      await assert.rejects(
        () => heading.type('nope', { timeout: 1000 }),
        /editable|actionable|timeout|enabled|receives/i,
        'Typing on non-editable elements should fail'
      );
    } finally {
      await vibe.quit();
    }
  });

  test('element.click() fails on disabled element', async () => {
    const vibe = await browser.launch({ headless: true });
    try {
      await vibe.go('https://the-internet.herokuapp.com/dynamic_controls');
      const input = await vibe.find('#input-example input');
      const disabled = await input.getAttribute('disabled');
      assert.ok(disabled !== null, 'Input should be disabled');

      await assert.rejects(
        () => input.click({ timeout: 1000 }),
        /enabled|actionable|timeout|receives|visible/i,
        'Clicking a disabled element should fail'
      );
    } finally {
      await vibe.quit();
    }
  });
});
