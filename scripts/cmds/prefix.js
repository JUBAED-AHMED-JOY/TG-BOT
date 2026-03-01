const config = require("../../config.json"); // path ঠিক রাখো যেখান থেকে config.json আছে

module.exports = {
  config: {
    name: "prefix",
    aliases: ["showprefix"],
    version: "1.0.1",
    author: "JOY",
    description: "Show the current bot prefix",
    category: "info",
    cooldown: 3,
    role: 0,
    usePrefix: false // noprefix system
  },

  onStart: async function({ bot, chatId, msg }) {
    try {
      // get prefix directly from config.json
      const prefix = config.prefix || "/"; // default "/" if undefined
      const replyText = `🤖 Joy bot prefix is: *${prefix}*\n` +
                        `Use this prefix before commands, e.g., ${prefix}help`;

      await bot.sendMessage(chatId, replyText, {
        parse_mode: "Markdown",
        reply_to_message_id: msg.message_id
      });

    } catch (err) {
      console.error("Prefix command error:", err);
      await bot.sendMessage(chatId, "❌ Could not fetch bot prefix.", {
        reply_to_message_id: msg.message_id
      });
    }
  }
};