module.exports = {
    config: {
        name: "unsend",
        aliases: ["u", "uns"],
        version: "1.5",
        author: "Joy",
        role: 0,
        cooldown: 2,
        description: "Unsend bot's message",
        category: "bot",
        usePrefix: true
    },

    onStart: async function({ bot, chatId, msg, api }) {
        try {
            // Check if user replied to a message
            if (!msg.reply_to_message) {
                return api.sendMessage("❌ Please reply to the bot's message you want to unsend.", chatId, {
                    reply_to_message_id: msg.message_id
                });
            }

            const botInfo = await bot.getMe();
            const botId = botInfo.id;

            // Only allow deleting bot's own message
            if (msg.reply_to_message.from.id !== botId) {
                return api.sendMessage("❌ You can only unsend the bot's own messages.", chatId, {
                    reply_to_message_id: msg.message_id
                });
            }

            // Delete the message
            await bot.deleteMessage(chatId, msg.reply_to_message.message_id);

            // Optional: confirmation
            return api.sendMessage("✅ Message successfully unsent.", chatId, {
                reply_to_message_id: msg.message_id
            });

        } catch (err) {
            console.error("❌ Unsend command error:", err);
            return api.sendMessage(`❌ Failed to unsend message: ${err.message}`, chatId, {
                reply_to_message_id: msg.message_id
            });
        }
    }
};