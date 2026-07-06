import { Command } from "commander";
import { sendTelegramMessage } from "sendkit-core";

const program = new Command();

program
    .name("sendkit")
    .description("SendKit CLI")
    .command("telegram")
    .description("Send a Telegram message")
    .argument("<chatId>", "The Telegram chat ID")
    .argument("<message>", "The message text to send")
    .action(async (chatId: string, message: string) => {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        if (!token) {
            console.error("Error: TELEGRAM_BOT_TOKEN is not set in the environment variables.");
            process.exit(1);
        }
        if (!chatId || !message) {
            console.error("Error: Both chatId and message are required.");
            process.exit(1);
        }
        try {
            const result = await sendTelegramMessage({
                botToken: token,
                chatId,
                message
            });
            console.log("Sent Telegram Message to chat", result.chatId);
            console.log("Telegram Message ID:", result.messageId);
        } catch (error) {
            const detail = error instanceof Error ? error.message : String(error);
            console.error("Error sending Telegram message:", detail);
            process.exit(1);
        }

    });

program.parseAsync(process.argv);