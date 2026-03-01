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
    console.error("API JSON Error:", err.message);
    return null;
  }
}

module.exports = {
  config: {
    name: "video",
    version: "2.1.0",
    credits: "Joy",
    role: 0,
    category: "media",
    description: "Download YouTube Video",
    cooldown: 5
  },

  onStart: async function ({ bot, chatId, args, msg }) {

    if (!args.length) {
      return bot.sendMessage(
        chatId,
        "⚠️ Video name or YouTube link dao.",
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
          return bot.sendMessage(chatId, "❌ Video khuje pai nai.");
        }
        ytLink = search.videos[0].url;
      }

      const loadingMsg = await bot.sendMessage(chatId, "⏳ Downloading video...");

      // 🔥 API Call (mp4 endpoint)
      const apiURL = `${apis.Yt}/joy/mp4?url=${encodeURIComponent(ytLink)}`;
      const apiRes = await axios.get(apiURL);

      const data = apiRes.data?.data || apiRes.data;
      const title = data?.title || "YouTube Video";
      const dl =
        data?.url ||
        data?.downloadUrl ||
        data?.link;

      if (!dl) {
        await bot.deleteMessage(chatId, loadingMsg.message_id);
        return bot.sendMessage(chatId, "❌ Video download link pai nai.");
      }

      // 📦 Temp file path
      const filePath = path.join(__dirname, `video_${Date.now()}.mp4`);

      const videoBuffer = await axios.get(dl, { responseType: "arraybuffer" });
      fs.writeFileSync(filePath, videoBuffer.data);

      await bot.deleteMessage(chatId, loadingMsg.message_id);

      // 🔥 Clean filename
      const cleanTitle = title.replace(/[\\/:*?"<>|]/g, "");

      // 🎬 Send Video with real name
      await bot.sendVideo(
        chatId,
        fs.createReadStream(filePath),
        {
          caption: `🎬 ${title}\n✅ Video Ready`
        },
        {
          filename: `${cleanTitle}.mp4`,
          contentType: "video/mp4"
        }
      );

      fs.unlinkSync(filePath);

    } catch (err) {
      console.error("Video Error:", err);
      return bot.sendMessage(chatId, "❌ MP4 Download Failed.");
    }
  }
};