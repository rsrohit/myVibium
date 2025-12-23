/**
 * CLI Tests: Element Finding, Click, and Type
 * Tests the clicker binary directly
 */

const { test, describe } = require('node:test');
const assert = require('node:assert');
const { execSync } = require('node:child_process');
const path = require('node:path');

const CLICKER = path.join(__dirname, '../../clicker/bin/clicker');

describe('CLI: Elements', () => {
  test('find command locates element', () => {
    const result = execSync(
      `${CLICKER} find https://the-internet.herokuapp.com "a[href=\\"/add_remove_elements/\\"]"`,
      {
        encoding: 'utf-8',
        timeout: 30000,
      }
    );
    assert.match(result, /tag=a/i, 'Should find anchor tag');
    assert.match(result, /Add\/Remove Elements/i, 'Should show link text');
    assert.match(result, /box=/i, 'Should show bounding box');
  });

  test('click command navigates via link', () => {
    const result = execSync(
      `${CLICKER} click https://the-internet.herokuapp.com "a[href=\\"/add_remove_elements/\\"]"`,
      {
        encoding: 'utf-8',
        timeout: 30000,
      }
    );
    assert.match(result, /add_remove_elements/i, 'Should navigate after clicking link');
  });

  test('type command enters text into input', () => {
    const result = execSync(
      `${CLICKER} type https://the-internet.herokuapp.com/inputs "input" "12345"`,
      {
        encoding: 'utf-8',
        timeout: 30000,
      }
    );
    assert.match(result, /12345/, 'Should show typed text in result');
  });
});
