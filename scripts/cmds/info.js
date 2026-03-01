const moment = require("moment-timezone");

module.exports = {
    config: {
        name: "info",
        aliases: ["about", "ownerinfo"],
        version: "1.1.0",
        author: "Joy",
        role: 0,
        cooldown: 5,
        description: "Displays personal info of the bot owner",
        category: "info",
        usePrefix: true
    },

    onStart: async function ({ bot, chatId, msg }) {
        try {
            const currentTime = moment
                .tz("Asia/Dhaka")
                .format("D/MM/YYYY • hh:mm:ss A");

            // Telegram supports direct image URL
            const imageUrl =
                "https://raw.githubusercontent.com/JUBAED-AHMED-JOY/Joy/main/joy404.png";

            const infoText = `
╭╼|━━━━━━━━━━━━━━|╾╮
👤 𝗡𝗮𝗺𝗲 : MD JUBAED AHMED JOY
╰╼|━━━━━━━━━━━━━━|╾╯

📘 Facebook : JOY AHMED
🕋 Religion : Islam
🚻 Gender   : Male
🎂 Age      : 16+
💘 Status   : Single
🎓 Work     : Student

🏠 Permanent Address : Jamalpur, Dhaka
📍 Current Address   : Tarakandi, Sarisha-Bari, Jamalpur

📧 Gmail     : mdjubaedahmed124@gmail.com
📞 WhatsApp  : wa.me/+8801709045888
✈️ Telegram  : t.me/JOY_AHMED_88
🔗 Facebook  : facebook.com/100001435123762

⏰ Time : ${currentTime}
`;

            // Send photo with inline button
            await bot.sendPhoto(chatId, imageUrl, {
                caption: infoText,
                reply_to_message_id: msg.message_id,
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: "JOY AHMED", url: "https://t.me/JOY_AHMED_88" },
                            { text: "🌐 Facebook", url: "https://facebook.com/100001435123762" }
                        ]
                    ]
                }
            });

        } catch (err) {
            console.error("Info command error:", err);
            bot.sendMessage(chatId, "❌ Failed to load info.");
        }
    }
};