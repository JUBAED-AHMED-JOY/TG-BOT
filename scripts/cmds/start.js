module.exports = {
  config: {
    name: "start",
    description: "Send greeting message to users when they text the bot",
    author: "Joy Ahmed",  
    role: 0,
    cooldown: 0,
    usePrefix: true, // এখন prefix চালু
    prefix: "/",      // এটা ব্যবহার হবে /start কমান্ডের জন্য
  },

  onStart: async function({ bot, chatId, msg }) {
    try {
      const welcomeMessage = 
`👋 Hello! I'm online now.

You can use commands like /song, /video, /userinfo, etc.
Type /help to see all commands.`;

      const options = {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "👑 Bot Owner: Joy Ahmed", url: "https://t.me/JOY_AHMED_88" }
            ]
          ]
        },
        reply_to_message_id: msg?.message_id || undefined
      };

      // Safety check
      if (!bot || !chatId) return;

      await bot.sendMessage(chatId, welcomeMessage, options);

    } catch (err) {
      console.error("❌ Start command error:", err);
    }
  }
};