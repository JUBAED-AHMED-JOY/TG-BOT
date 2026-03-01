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
    name: "youtube",
    version: "9.1.0",
    credits: "Joy",
    role: 0,
    category: "media",
    description: "YouTube Audio / Video Downloader",
    cooldown: 5
  },

  onStart: async function ({ bot, chatId, args, msg }) {

    if (args.length < 2) {
      return bot.sendMessage(
        chatId,
        "⚠️ Use: /youtube audio/video song name",
        { reply_to_message_id: msg.message_id }
      );
    }

    const apis = await getAPI();
    if (!apis || !apis.Yt) {
      return bot.sendMessage(chatId, "❌ API load fail.");
    }

    const type = args[0].toLowerCase(); // audio or video
    args.shift();

    if (type !== "audio" && type !== "video") {
      return bot.sendMessage(chatId, "⚠️ First word must be audio or video.");
    }

    let query = args.join(" ");
    let ytLink = query;

    try {

      // 🔎 Search if not link
      if (!query.includes("youtu")) {
        const search = await yts(query);
        if (!search.videos.length) {
          return bot.sendMessage(chatId, "❌ Song not found.");
        }
        ytLink = search.videos[0].url;
      }

      const loadingMsg = await bot.sendMessage(chatId, "⏳ Downloading...");

      const endpoint = type === "audio" ? "mp3" : "mp4";

      const apiRes = await axios.get(
        `${apis.Yt}/joy/${endpoint}?url=${encodeURIComponent(ytLink)}`
      );

      const data = apiRes.data?.data || apiRes.data;
      const title = data?.title || "Unknown Title";
      const dl =
        data?.url ||
        data?.downloadUrl ||
        data?.link;

      if (!dl) {
        await bot.deleteMessage(chatId, loadingMsg.message_id);
        return bot.sendMessage(chatId, "❌ Download link not found.");
      }

      const ext = type === "audio" ? "mp3" : "mp4";
      const filePath = path.join(__dirname, `temp_${Date.now()}.${ext}`);

      const file = await axios.get(dl, { responseType: "arraybuffer" });
      fs.writeFileSync(filePath, file.data);

      await bot.deleteMessage(chatId, loadingMsg.message_id);

      const cleanTitle = title.replace(/[\\/:*?"<>|]/g, "");

      if (type === "audio") {

        await bot.sendAudio(
          chatId,
          fs.createReadStream(filePath),
          {
            caption: `🎵 ${title}\n✅ AUDIO Ready`
          },
          {
            filename: `${cleanTitle}.mp3`,
            contentType: "audio/mpeg"
          }
        );

      } else {

        await bot.sendVideo(
          chatId,
          fs.createReadStream(filePath),
          {
            caption: `🎬 ${title}\n✅ VIDEO Ready`
          },
          {
            filename: `${cleanTitle}.mp4`,
            contentType: "video/mp4"
          }
        );

      }

      fs.unlinkSync(filePath);

    } catch (err) {
      console.error(err);
      return bot.sendMessage(chatId, "❌ Download Failed.");
    }
  }
};