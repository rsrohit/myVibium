# Vibium API Reference

This reference covers the JavaScript/TypeScript client APIs for async (`browser`) and sync (`browserSync`) usage.

## browser.launch(options)

Start a Clicker-managed browser and return a `Vibe` instance.

**Signature**
```ts
import { browser } from 'vibium';

const vibe = await browser.launch(options?);
```

**Options**
```ts
interface LaunchOptions {
  headless?: boolean; // default: true
  port?: number; // default: 0 (auto-select)
  executablePath?: string; // optional Clicker binary path
}
```

**Example**
```ts
const vibe = await browser.launch({ headless: true });
```

## browserSync.launch(options)

Start a Clicker-managed browser and return a `VibeSync` instance.

**Signature**
```ts
import { browserSync } from 'vibium';

const vibe = browserSync.launch(options?);
```

**Options**
```ts
interface LaunchOptions {
  headless?: boolean; // default: true
}
```

**Example**
```ts
const vibe = browserSync.launch({ headless: false });
```

---

## Vibe (async)

Represents a browser session with async methods.

### go(url)
Navigate to a URL and wait for the page load.

```ts
await vibe.go('https://example.com');
```

### screenshot()
Capture a viewport screenshot.

```ts
const pngBuffer = await vibe.screenshot();
```

### evaluate(script)
Run JavaScript in the page context and return the result.

```ts
const title = await vibe.evaluate<string>('return document.title;');
```

### find(selector, options?)
Find an element by CSS selector, waiting for it to exist.

```ts
const el = await vibe.find('button.submit', { timeout: 10_000 });
```

**Options**
```ts
interface FindOptions {
  timeout?: number; // default: 30000
}
```

### quit()
Close the BiDi connection and stop the Clicker process.

```ts
await vibe.quit();
```

---

## VibeSync (sync)

Represents a browser session with synchronous methods.

### go(url)
```ts
vibe.go('https://example.com');
```

### screenshot()
```ts
const pngBuffer = vibe.screenshot();
```

### evaluate(script)
```ts
const title = vibe.evaluate<string>('return document.title;');
```

### find(selector, options?)
```ts
const el = vibe.find('button.submit', { timeout: 10_000 });
```

### quit()
```ts
vibe.quit();
```

---

## Element (async)

Represents a matched element. Access its metadata via `element.info`.

### click(options?)
```ts
await element.click({ timeout: 10_000 });
```

### type(text, options?)
```ts
await element.type('hello', { timeout: 10_000 });
```

### text()
```ts
const label = await element.text();
```

### getAttribute(name)
```ts
const href = await element.getAttribute('href');
```

### boundingBox()
```ts
const box = await element.boundingBox();
```

**Action options**
```ts
interface ActionOptions {
  timeout?: number; // default: 30000
}
```

---

## ElementSync (sync)

Synchronous element API.

### click(options?)
```ts
element.click({ timeout: 10_000 });
```

### type(text, options?)
```ts
element.type('hello', { timeout: 10_000 });
```

### text()
```ts
const label = element.text();
```

### getAttribute(name)
```ts
const href = element.getAttribute('href');
```

### boundingBox()
```ts
const box = element.boundingBox();
```

---

## Error Types

The client library throws these error classes from `clients/javascript/src/utils/errors.ts`:

- `ConnectionError`: Failed to connect to the Clicker WebSocket endpoint.
- `TimeoutError`: A wait operation timed out (ex: Clicker startup, `find`, `click`, `type`).
- `ElementNotFoundError`: Selector did not match any element (ex: `text`, `boundingBox`).
- `BrowserCrashedError`: The browser process exited unexpectedly.

---

## Configuration Options

### Launch options
- `headless` (default `true`): Launch Chrome in headless mode.
- `port` (async only): Set a specific Clicker port; `0` picks a free port.
- `executablePath` (async only): Path to a Clicker binary to launch.

### Wait options
- `FindOptions.timeout` (default `30000`): How long to wait for a selector to appear.
- `ActionOptions.timeout` (default `30000`): How long to wait for actionability checks.

### Environment variables
- `VIBIUM_DEBUG=1` enables debug logging in the JS client.
- `VIBIUM_SKIP_BROWSER_DOWNLOAD=1` skips browser download during install.
