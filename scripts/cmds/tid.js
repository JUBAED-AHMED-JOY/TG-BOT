module.exports = {
    config: {
        name: "tid",
        version: "1.0",
        author: "Joy Ahmed",
        role: 0,
        cooldown: 3,
        description: "Get Telegram Group Chat ID (UID)",
        category: "utility",
        usePrefix: true
    },

    onStart: async function ({ msg, message }) {
        try {
            const chatId = msg.chat.id; // Group chat ID
            const chatType = msg.chat.type; // group, supergroup, private

            let text = `💬 Chat Type: ${chatType}\n🔢 Group UID: ${chatId}`;

            await message.reply(text);

        } catch (err) {
            console.error("GID CMD ERROR:", err);
            await message.reply("❌ Failed to get Group UID");
        }
    }
};