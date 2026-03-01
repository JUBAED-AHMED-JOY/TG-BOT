const fs = require("fs");
const path = require("path");

const chatGroupsFile = path.join(__dirname, "../../chatGroups.json");

module.exports.config = {
    name: "noti",
    author: "JUBAED AHMED JOY",
    role: 2, // 🔒 OWNER ONLY
    cooldown: 10,
    usePrefix: true,
    description: "Send notification to all chats (supports image reply)"
};

module.exports.onStart = async function ({ bot, chatId, args, msg }) {
    const text = args.join(" ");

    if (!fs.existsSync(chatGroupsFile)) {
        return bot.sendMessage(chatId, "❌ chatGroups.json not found");
    }

    const chatGroups = JSON.parse(fs.readFileSync(chatGroupsFile, "utf8"));

    let success = 0;
    let failed = 0;

    // 🖼 If command is a reply to an image
    if (msg.reply_to_message && msg.reply_to_message.photo) {
        const photos = msg.reply_to_message.photo;
        const fileId = photos[photos.length - 1].file_id; // highest quality
        const caption = text || msg.reply_to_message.caption || "";

        for (const id of chatGroups) {
            try {
                await bot.sendPhoto(id, fileId, {
                    caption: `📢 *BOT NOTIFICATION*\n\n${caption}`,
                    parse_mode: "Markdown"
                });
                success++;
            } catch {
                failed++;
            }
        }
    } else {
        // 📝 Normal text notification
        if (!text) {
            return bot.sendMessage(
                chatId,
                "❌ Message দাও অথবা কোনো image এ reply করো\n\nExample:\n/notification Bot updated 🚀"
            );
        }

        for (const id of chatGroups) {
            try {
                await bot.sendMessage(
                    id,
                    `📢 *BOT NOTIFICATION*\n\n${text}`,
                    { parse_mode: "Markdown" }
                );
                success++;
            } catch {
                failed++;
            }
        }
    }

    bot.sendMessage(
        chatId,
        `✅ Notification sent\n\n✔️ Success: ${success}\n❌ Failed: ${failed}`
    );
};