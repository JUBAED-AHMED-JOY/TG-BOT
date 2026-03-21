const axios = require("axios");
const yts = require("yt-search");
const fs = require("fs-extra");
const path = require("path");
const { downloadVideo } = require("joy-video-downloader");

module.exports = {
  config: {
    name: "video",
    aliases: ["ytvideo"],
    usePrefix: true,
    role: 0,
    author: "Joy",
    description: "Download Video from YouTube or Search",
    category: "media",
    usages: "/video <name / link>",
    cooldown: 10
  },

  onStart: async function ({ bot, chatId, event, args }) {
    if (!args.length) {
      return bot.sendMessage(chatId, "⚠️ ভিডিওর নাম বা লিঙ্ক দিন।", {
        reply_to_message_id: event.messageID
      });
    }

    let query = args.join(" ");
    let videoLink = query;

    try {
      // 🔍 YouTube search
      if (!videoLink.includes("youtu")) {
        const search = await yts(query);
        if (!search || !search.videos.length) {
          return bot.sendMessage(chatId, "❌ ভিডিও পাওয়া যায়নি!", {
            reply_to_message_id: event.messageID
          });
        }
        videoLink = search.videos[0].url;
      }

      // ⏳ loading message
      const loading = await bot.sendMessage(chatId, "⏳ ভিডিও ডাউনলোড হচ্ছে...", {
        reply_to_message_id: event.messageID
      });

      // 📁 cache folder
      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

      const filePath = path.join(cacheDir, `video_${Date.now()}.mp4`);

      // 🎬 download
      const data = await downloadVideo(videoLink, filePath);

      if (!data || !fs.existsSync(filePath)) {
        await bot.deleteMessage(chatId, loading.message_id);
        return bot.sendMessage(chatId, "❌ ভিডিও ডাউনলোড করা যায়নি!", {
          reply_to_message_id: event.messageID
        });
      }

      // ✅ success
      await bot.deleteMessage(chatId, loading.message_id);

      await bot.sendVideo(chatId, filePath, {
        caption: `🎬 ${data.title || "Video"}`
      });

      // 🧹 delete file
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    } catch (err) {
      console.error("Video error:", err.message);

      bot.sendMessage(chatId, "❌ ভিডিও ডাউনলোড করতে সমস্যা হয়েছে!", {
        reply_to_message_id: event.messageID
      });
    }
  }
};
