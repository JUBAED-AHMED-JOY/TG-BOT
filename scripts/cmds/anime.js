const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");

module.exports = {
  config: {
    name: "anime",
    version: "5.0.0",
    author: "JOY",
    role: 0,
    cooldown: 5,
    description: "Anime image",
    category: "media",
    usePrefix: true
  },

  onStart: async function ({ bot, chatId }) {
    try {
      const res = await axios.get("https://api.waifu.pics/nsfw/waifu");

      if (!res.data || !res.data.url) {
        return bot.sendMessage(chatId, "❌ Image পাওয়া যায়নি!");
      }

      const imageUrl = res.data.url;
      const path = __dirname + "/cache/anime.jpg";

      request(imageUrl)
        .pipe(fs.createWriteStream(path))
        .on("close", () => {
          bot.sendPhoto(chatId, path).then(() => {
            fs.unlinkSync(path);
          });
        });

    } catch (err) {
      console.error(err);
      bot.sendMessage(chatId, "❌ Error:\n" + err.message);
    }
  }
};
