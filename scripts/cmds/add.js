const axios = require("axios");

module.exports = {
  config: {
    name: "add",
    aliases: [],
    usePrefix: true,
    role: 0,
    author: "JOY AHMED",
    description: "Reply to video and add to API"
  },

  onStart: async function ({ bot, chatId, event, args }) {
    try {
      if (!args[0]) {
        return bot.sendMessage(
          chatId,
          "❌ Usage: Reply to a video and type /add <name>",
          { reply_to_message_id: event.messageID }
        );
      }

      // 👉 Telegram reply check
      if (!event.msg.reply_to_message || !event.msg.reply_to_message.video) {
        return bot.sendMessage(
          chatId,
          "❌ You must reply to a video.",
          { reply_to_message_id: event.messageID }
        );
      }

      const video = event.msg.reply_to_message.video;
      const fileId = video.file_id;

      // 👉 Telegram file link আনতে হবে
      const token = bot.token;
      const fileRes = await axios.get(
        `https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`
      );

      const filePath = fileRes.data.result.file_path;
      const videoUrl = `https://api.telegram.org/file/bot${token}/${filePath}`;

      // 🔹 API URL load
      const apiJson = await axios.get(
        "https://raw.githubusercontent.com/JUBAED-AHMED-JOY/Joy/main/api.json"
      );

      const BASE_URL = apiJson.data.add;
      if (!BASE_URL) {
        return bot.sendMessage(chatId, "❌ add API not found", {
          reply_to_message_id: event.messageID
        });
      }

      const name = args.join(" ").toLowerCase();

      await bot.sendMessage(chatId, "⏳ Uploading video...", {
        reply_to_message_id: event.messageID
      });

      // 🔹 API call
      const apiRes = await axios.post(
        `${BASE_URL}/add`,
        {
          name,
          videoUrl
        },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 300000
        }
      );

      if (!apiRes.data || !apiRes.data.success) {
        return bot.sendMessage(
          chatId,
          `❌ API Error: ${apiRes.data?.msg || "Unknown error"}`,
          { reply_to_message_id: event.messageID }
        );
      }

      const data = apiRes.data.data;

      bot.sendMessage(
        chatId,
        `✅ Video Added Successfully!\n📛 Name: ${data.name}\n🔢 Serial: ${data.serial}`,
        { reply_to_message_id: event.messageID }
      );

    } catch (err) {
      console.error("ADD ERROR:", err.message);

      bot.sendMessage(
        chatId,
        `❌ Error:\n${err.response?.data?.msg || err.message}`,
        { reply_to_message_id: event.messageID }
      );
    }
  }
};
