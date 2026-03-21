const axios = require("axios");

module.exports = {
  config: {
    name: "rndm",
    aliases: ["randomvideo"],
    usePrefix: true,
    role: 0,
    author: "JOY AHMED",
    description: "Get random video by name",
    category: "media"
  },

  onStart: async function ({ bot, chatId, event, args }) {
    if (!args[0]) {
      return bot.sendMessage(chatId, "❌ Usage: /rndm <name>", {
        reply_to_message_id: event.messageID
      });
    }

    const name = args.join(" ").toLowerCase();

    try {
      const apiJson = await axios.get(
        "https://raw.githubusercontent.com/JUBAED-AHMED-JOY/Joy/main/api.json"
      );

      const BASE_URL = apiJson.data.rndm;

      const res = await axios.get(
        `${BASE_URL}/random?name=${encodeURIComponent(name)}`
      );

      if (!res.data || !res.data.data) {
        return bot.sendMessage(chatId, `❌ No video found for "${name}"`, {
          reply_to_message_id: event.messageID
        });
      }

      const video = res.data.data;

      // 👉 DIRECT SEND (NO DOWNLOAD)
      await bot.sendVideo(chatId, video.url, {
        caption: `🎬 ${video.name}`,
        reply_to_message_id: event.messageID
      });

    } catch (err) {
      console.error(err.message);

      bot.sendMessage(
        chatId,
        "❌ API error / Video link broken",
        { reply_to_message_id: event.messageID }
      );
    }
  }
};
