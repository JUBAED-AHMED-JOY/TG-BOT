 // ================= BOT ADMIN MEMORY =================
global.botAdmins = global.botAdmins || new Set();

module.exports = {
    config: {
        name: "admin",
        version: "1.2.0",
        author: "Joy Ahmed",
        role: 2, // ONLY BOT OWNER
        cooldown: 3,
        description: "Bot admin add/remove/list",
        category: "system",
        usePrefix: true
    },

    onStart: async function ({ bot, chatId, msg, args, userId, message }) {
        try {
            const sub = args[0];

            // ================= LIST =================
            if (!sub || sub === "list") {
                if (global.botAdmins.size === 0)
                    return message.reply("⚠️ No bot admins found");

                let text = "👑 BOT ADMIN LIST 👑\n\n";
                let i = 1;
                for (const id of global.botAdmins) {
                    text += `${i++}. 🆔 ${id}\n`;
                }
                return message.reply(text);
            }

            // ================= GET TARGET ID =================
            let targetId = null;

            // 1️⃣ REPLY
            if (msg.reply_to_message) {
                targetId = msg.reply_to_message.from.id;
            }

            // 2️⃣ UID
            else if (args[1] && !isNaN(args[1])) {
                targetId = Number(args[1]);
            }

            // ❌ Mention not reliable in Telegram
            if (!targetId) {
                return message.reply(
                    "❌ User detect kora jai nai\n\n" +
                    "✅ Use only:\n" +
                    "• Reply method\n" +
                    "• UID method\n\n" +
                    "Example:\n/admin add 123456789"
                );
            }

            // ================= ADD =================
            if (sub === "add") {
                if (global.botAdmins.has(targetId))
                    return message.reply("⚠️ Already a bot admin");

                global.botAdmins.add(targetId);
                return message.reply(
                    `✅ Bot Admin Added Successfully\n🆔 ${targetId}`
                );
            }

            // ================= REMOVE =================
            if (sub === "remove") {
                if (!global.botAdmins.has(targetId))
                    return message.reply("⚠️ This user is not a bot admin");

                global.botAdmins.delete(targetId);
                return message.reply(
                    `✅ Bot Admin Removed\n🆔 ${targetId}`
                );
            }

            return message.reply(
                "❌ Invalid usage\n\n" +
                "/admin add <uid>\n" +
                "/admin remove <uid>\n" +
                "/admin list"
            );

        } catch (err) {
            console.error("ADMIN CMD ERROR:", err);
            return message.reply("❌ Admin command failed (check console)");
        }
    }
};