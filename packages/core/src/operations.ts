import {
  telegramMessageOutputSchema,
  telegramMessageOptionsSchema,
  telegramSendMessageRequestSchema,
  telegramSendMessageResponseSchema,
  type TelegramMessageOptions,
  type TelegramMessageOutput,
} from "./schemas";

export async function sendTelegramMessage(
  input: TelegramMessageOptions,
): Promise<TelegramMessageOutput> {
  const parsedInput = telegramMessageOptionsSchema.parse(input);
  const requestBody = telegramSendMessageRequestSchema.parse({
    chat_id: parsedInput.chatId,
    text: parsedInput.message,
  });
  const response = await fetch(`https://api.telegram.org/bot${parsedInput.botToken}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: await Response.json(requestBody).text(),
  });
  const data = telegramSendMessageResponseSchema.parse(await response.json());
  if (!data.ok || !response.ok || !data.result) {
    const detail = data.description || response.statusText;
    throw new Error(detail ?? `Telegram Message Request failed`);
  }
  return telegramMessageOutputSchema.parse({
    ok: true,
    chatId: parsedInput.chatId.toString(),
    messageId: data.result.message_id,
  });
}
