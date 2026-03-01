module.exports = {
    config: {
        name: "uid",
        version: "1.0.0",
        author: "Joy",
        cooldown: 5,
        role: 0,
        description: "Show Telegram user ID",
        category: "info",
        usePrefix: true
    },

    onStart: async function ({ bot, chatId, userId, args, msg }) {
        try {
            // 1️⃣ Reply করা message থাকলে
            if (msg.reply_to_message) {
                const target = msg.reply_to_message.from;
                return bot.sendMessage(
                    chatId,
                    `👤 User ID Info\n\n` +
                    `Name: ${target.first_name || ""} ${target.last_name || ""}\n` +
                    `Username: ${target.username ? "@" + target.username : "N/A"}\n` +
                    `User ID: ${target.id}`,
                    { reply_to_message_id: msg.message_id }
                );
            }

            // 2️⃣ Mention করা থাকলে
            if (msg.entities) {
                const mention = msg.entities.find(e => e.type === "text_mention");
                if (mention && mention.user) {
                    const u = mention.user;
                    return bot.sendMessage(
                        chatId,
                        `👤 User ID Info\n\n` +
                        `Name: ${u.first_name || ""} ${u.last_name || ""}\n` +
                        `Username: ${u.username ? "@" + u.username : "N/A"}\n` +
                        `User ID: ${u.id}`,
                        { reply_to_message_id: msg.message_id }
                    );
                }
            }

            // 3️⃣ নিজের UID
            if (!args[0]) {
                return bot.sendMessage(
                    chatId,
                    `👤 Your User ID\n\nUser ID: ${userId}`,
                    { reply_to_message_id: msg.message_id }
                );
            }

            // 4️⃣ Username দিলে
            if (args[0].startsWith("@")) {
                return bot.sendMessage(
                    chatId,
                    `⚠️ Telegram limitation:\nUsername দিয়ে সরাসরি ID পাওয়া যায় না\n\nReply বা mention ব্যবহার করো`,
                    { reply_to_message_id: msg.message_id }
                );
            }

            // fallback
            bot.sendMessage(chatId, "❌ Invalid usage. Reply, mention, or use /uid");

        } catch (err) {
            bot.sendMessage(chatId, `❌ Error: ${err.message}`);
        }
    }
};