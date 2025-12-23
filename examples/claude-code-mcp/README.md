# Vibium MCP setup (Claude Code)

This example shows how to connect Vibium to Claude Code using MCP.

## Prerequisites

- Claude Code installed and authenticated
- Node.js 18+

## Setup

Add the Vibium MCP server:

```bash
claude mcp add vibium -- npx -y vibium
```

Claude Code will now have browser tools like `browser_launch`, `browser_navigate`, and `browser_screenshot`.

## Usage

Start a Claude Code session and ask it to browse or take screenshots. Vibium will download Chrome for Testing on first run and clean up when the session ends.
