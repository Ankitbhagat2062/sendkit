import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { sendTelegramMessage, telegramMessageInputSchema } from "sendkit-core";

const server = new McpServer({
    name: "local-mcp",
    version: "0.0.0",
});

function getTelegramBotToken(): string {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
        throw new Error("TELEGRAM_BOT_TOKEN environment variable is not set.");
    }
    return token;
}

server.registerTool(
    "telegram",
    {
        title: "Telegram",
        description: "Send a Telegram message",
        inputSchema: telegramMessageInputSchema.shape,
    },
    async (input)=> {
        const result = await sendTelegramMessage({
            ...input,
            botToken: getTelegramBotToken(),
        });    
        return {
            content: [
                {
                    type: "text",
                    text: `Sent Telegram Message ${result.messageId} to a chat ID of ${result.chatId}`,
                }
            ],
            structuredContent: result,
        }
    },
)

const transport = new StdioServerTransport();
try {
    await server.connect(transport);
} catch (error) {
    console.error("Failed to connect MCP server:", error);
    process.exit(1);
}