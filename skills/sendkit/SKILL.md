---
name: sendkit
description: SendKit to send Telegram messages from agents through the SendKit MCP tool or CLI fallback. Use when a user asks to send a Telegram message, use SendKit CLI(@guha/sendkit), interact with the SendKit toolset, verify SendKit manually, or choose between SendKit MCP and CLI workflows.
---

# SendKit

SendKit provides two ways to send Telegram messages from agents. Both rely on a Telegram bot token.

## Prerequisite: Get a Telegram bot token

1. Open Telegram, search for [@BotFather](https://t.me/botfather)
2. Send `/newbot` and follow the prompts
3. Copy the bot token (looks like `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`)

## Getting started

### CLI setup

```bash
# Install globally
npm install -g @guha/sendkit

# Or use directly without installing
npx @guha/sendkit init --telegram-bot-token <your-token>

# Send a message
sendkit telegram <chatId> <message>
```

The token is stored in `~/.config/sendkit/config.json`. Alternatively, set `TELEGRAM_BOT_TOKEN` in your shell environment or in your agent's MCP config.

### MCP setup

Add the MCP server to your agent's config (e.g. `opencode.json` or `.mcp.json`):

```json
{
  "mcpServers": {
    "sendkit": {
      "type": "stdio",
      "command": "bunx",
      "args": ["-y", "@guha/sendkit-mcp"],
      "env": {
        "TELEGRAM_BOT_TOKEN": "<your-token>"
      }
    }
  }
}
```

Then restart your agent. The tool `sendkit_telegram` should appear.

## Usage

### MCP tool (preferred)

When the MCP server is running, the `sendkit_telegram` tool sends messages directly:

- **Tool:** `sendkit_telegram`
- **Inputs:** `chatId` (string), `message` (string)

The bot token comes from the `TELEGRAM_BOT_TOKEN` environment variable set in the MCP config.

### CLI fallback

Run the CLI directly when the MCP tool is unavailable:

```bash
sendkit telegram <chatId> <message>
```

The CLI can also be invoked via `npx` without a global install:

```bash
npx @guha/sendkit telegram <chatId> <message>
```

## When to fall back to CLI

- The MCP tool is not available in the current agent session
- The MCP tool returns an error
- The user explicitly asks for CLI usage
- You need to debug connectivity

## Verifying

**MCP:** Confirm `sendkit_telegram` appears in the available tools list.

**CLI:** Run `sendkit telegram <testChatId> "Hello from SendKit test"` and confirm the output includes `"ok": true`.
