module.exports = {
  config: {
    name: "restart",
    version: "3.0.1",
    author: "JOY",
    role: 2,
    cooldown: 5,
    description: "Restart the bot instantly",
    category: "system",
    usePrefix: true
  },

  onStart: async function({ bot, chatId, userId }) {
    try {
      const config = require('../../config.json');

      // Only owner can restart
      if (userId != config.owner_id) {
        return bot.sendMessage(chatId, "❌ You are not allowed!");
      }

      // Send only ⚡ Restarting bot...
      await bot.sendMessage(chatId, "⚡ Restarting bot...");

      // Ultra fast restart (0.5 sec OFF)
      setTimeout(() => {
        console.log("♻️ Bot restarting...");
        process.exit(0);
      }, 500);

    } catch (err) {
      console.error("Restart error:", err);
      bot.sendMessage(chatId, "❌ Restart failed!");
    }
  }
};
