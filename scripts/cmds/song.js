const axios = require("axios");
const yts = require("yt-search");
const fs = require("fs");
const path = require("path");

async function getAPI() {
  try {
    const res = await axios.get(
      "https://raw.githubusercontent.com/JUBAED-AHMED-JOY/Joy/main/api.json"
    );
    return res.data;
  } catch (err) {
    console.error("Failed to fetch API JSON:", err.message);
    return null;
  }
}

module.exports = {
  config: {
    name: "song",
    version: "6.2.0",
    credits: "Joy",
    role: 0,
    category: "media",
    description: "Download song MP3",
    cooldown: 5
  },

  onStart: async function ({ bot, chatId, args, msg }) {

    if (!args.length) {
      return bot.sendMessage(
        chatId,
        "⚠️ Song name or YouTube link dao.",
        { reply_to_message_id: msg.message_id }
      );
    }

    const apis = await getAPI();
    if (!apis || !apis.Yt) {
      return bot.sendMessage(chatId, "❌ API load korte parlam na.");
    }

    let query = args.join(" ");
    let ytLink = query;

    try {

      // 🔎 Search if not YouTube link
      if (!query.includes("youtu")) {
        const search = await yts(query);
        if (!search.videos.length) {
          return bot.sendMessage(chatId, "❌ Song khuje pai nai.");
        }
        ytLink = search.videos[0].url;
      }

      const loadingMsg = await bot.sendMessage(chatId, "⏳ Downloading song...");

      // 🔥 API Call
      const apiRes = await axios.get(
        `${apis.Yt}/joy/mp3?url=${encodeURIComponent(ytLink)}`
      );

      const data = apiRes.data?.data;
      const title = data?.title || "Joy Song";
      const dl =
        data?.url ||
        data?.downloadUrl ||
        data?.link;

      if (!dl) {
        await bot.deleteMessage(chatId, loadingMsg.message_id);
        return bot.sendMessage(chatId, "❌ Download link pai nai.");
      }

      // 📥 Download temporary file
      const filePath = path.join(__dirname, `temp_${Date.now()}.mp3`);
      const response = await axios.get(dl, { responseType: "arraybuffer" });
      fs.writeFileSync(filePath, response.data);

      await bot.deleteMessage(chatId, loadingMsg.message_id);

      // 🔥 Clean filename (invalid char remove)
      const cleanTitle = title.replace(/[\\/:*?"<>|]/g, "");

      // 🎵 Send Audio with real song name
      await bot.sendAudio(
        chatId,
        fs.createReadStream(filePath),
        {
          caption: `🎵 ${title}\n✅ MP3 Ready`
        },
        {
          filename: `${cleanTitle}.mp3`,
          contentType: "audio/mpeg"
        }
      );

      // 🗑 Delete temp file
      fs.unlinkSync(filePath);

    } catch (err) {
      console.error(err);
      return bot.sendMessage(chatId, "❌ MP3 Download Failed.");
    }
  }
};