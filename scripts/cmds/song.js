const axios = require("axios");
const yts = require("yt-search");
const fs = require("fs-extra");
const path = require("path");
const { downloadVideo } = require("joy-video-downloader");

module.exports = {
  config: {
    name: "song",
    aliases: [],
    usePrefix: true,
    role: 0,
    author: "JOY AHMED",
    description: "Download MP3 using joy-video-downloader"
  },

  onStart: async function ({ bot, chatId, event, args }) {
    if (!args.length) {
      return bot.sendMessage(chatId, "⚠️ গানের নাম অথবা ইউটিউব লিঙ্ক দাও।", {
        reply_to_message_id: event.messageID
      });
    }

    let query = args.join(" ");
    let ytLink = query;

    try {
      // 🔍 YouTube search
      if (!ytLink.includes("youtu")) {
        const search = await yts(query);
        if (!search.videos.length) {
          return bot.sendMessage(chatId, "❌ গানটি খুঁজে পাওয়া যায়নি।", {
            reply_to_message_id: event.messageID
          });
        }
        ytLink = search.videos[0].url;
      }

      // ⏳ loading message
      const loadingMsg = await bot.sendMessage(chatId, "⏳ গানটি প্রসেসিং হচ্ছে...", {
        reply_to_message_id: event.messageID
      });

      // 📁 cache folder
      const cacheDir = path.resolve(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

      const filePath = path.join(cacheDir, `song_${Date.now()}.mp3`);

      // 🎵 download
      const data = await downloadVideo(ytLink, filePath);

      if (!data || !data.filePath) {
        await bot.deleteMessage(chatId, loadingMsg.message_id);
        return bot.sendMessage(chatId, "❌ গানটি ডাউনলোড করা সম্ভব হয়নি!", {
          reply_to_message_id: event.messageID
        });
      }

      const title = data.title || "Unknown";

      // 🧹 remove loading msg
      await bot.deleteMessage(chatId, loadingMsg.message_id);

      // 🎧 send audio
      await bot.sendAudio(chatId, fs.createReadStream(data.filePath), {
        caption: `🎵 গান: ${title}\n✅ ডাউনলোড সম্পন্ন।`,
        reply_to_message_id: event.messageID
      });

      // 🗑️ delete file
      if (fs.existsSync(data.filePath)) fs.unlinkSync(data.filePath);

    } catch (error) {
      console.error("SONG ERROR:", error.message);

      return bot.sendMessage(chatId, "❌ ডাউনলোড করার সময় সমস্যা হয়েছে!", {
        reply_to_message_id: event.messageID
      });
    }
  }
};
