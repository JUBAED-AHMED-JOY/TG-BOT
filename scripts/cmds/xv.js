const axios = require("axios");
const cheerio = require("cheerio");

module.exports = {
  config: {
    name: "xv",
    author: "JOY",
    role: 0,
    version: "1.2",
    category: "nsfw",
    usePrefix: true
  },

  onStart: async function ({ bot, chatId }) {
    try {
      const res = await axios.get("https://www.xvideos.com/", {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          "Accept-Language": "en-US,en;q=0.9",
          "Cookie": "age_verified=1; platform=pc"
        }
      });

      const $ = cheerio.load(res.data);

      let videos = [];

      $("a").each((i, el) => {
        const href = $(el).attr("href");

        if (href && href.startsWith("/video")) {
          videos.push("https://www.xvideos.com" + href);
        }
      });

      if (!videos.length) {
        return bot.sendMessage(chatId, "❌ No video found!");
      }

      const random = videos[Math.floor(Math.random() * videos.length)];

      bot.sendMessage(chatId, random);

    } catch (err) {
      console.error(err.response?.status, err.message);
      bot.sendMessage(chatId, "❌ Error: " + err.message);
    }
  }
};
