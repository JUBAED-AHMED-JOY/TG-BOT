module.exports.config = {
    name: "userinfo",
    aliases: ["uinfo", "info"],
    version: "1.0.2",
    permission: 0,
    credits: "Joy",
    prefix: false, // no prefix
    description: "Show user info by reply or mention",
    category: "tools",
    usages: "userinfo | userinfo @username | reply + userinfo"
};

module.exports.onStart = async ({ bot, msg }) => {
    try {
        const chatId = msg.chat.id;
        let targetUser = null;

        // 1️⃣ Reply user
        if (msg.reply_to_message) {
            targetUser = msg.reply_to_message.from;
        }

        // 2️⃣ Mention user (@username)
        else if (msg.entities) {
            const mention = msg.entities.find(
                e => e.type === "mention" || e.type === "text_mention"
            );

            if (mention) {
                if (mention.type === "text_mention" && mention.user) {
                    targetUser = mention.user;
                } else if (mention.type === "mention") {
                    // @username → Telegram doesn't give full user object
                    return bot.sendMessage(
                        chatId,
                        "⚠️ @username mention থেকে User ID পাওয়া যায় না.\n\n👉 Reply করে command ব্যবহার করো।",
                        { reply_to_message_id: msg.message_id }
                    );
                }
            }
        }

        // 3️⃣ Default: sender
        if (!targetUser) {
            targetUser = msg.from;
        }

        const text = `
👤 *User Information*

• Name: ${targetUser.first_name || ""} ${targetUser.last_name || ""}
• Username: ${targetUser.username ? "@" + targetUser.username : "None"}
• User ID: ${targetUser.id}
• Is Bot: ${targetUser.is_bot ? "Yes" : "No"}
`;

        await bot.sendMessage(chatId, text, {
            parse_mode: "Markdown",
            reply_to_message_id: msg.message_id
        });

    } catch (err) {
        console.error(err);
        await bot.sendMessage(msg.chat.id, "❌ Failed to fetch user info.");
    }
};