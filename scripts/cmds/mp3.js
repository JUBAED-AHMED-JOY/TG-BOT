const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const { downloadVideo } = require('joy-video-downloader'); // JOY downloader

module.exports = {
    config: {
        name: "mp3",
        version: "1.0.0",
        author: "Joy Ahmed",
        role: 0,          // Everyone
        prefix: true,
        usePrefix: true,
        cooldown: 5,
        description: "Convert video to MP3 from URL or replied video",
        category: "media"
    },

    onStart: async function({ bot, chatId, args, msg }) {
        const downloadFolder = path.join(__dirname, "JOY");
        if (!fs.existsSync(downloadFolder)) fs.mkdirSync(downloadFolder);

        const waitMsg = await bot.sendMessage(chatId, "⏳ Processing your MP3 request...");

        try {
            let audioUrl;

            // 1️⃣ Reply to Telegram video
            if (msg.reply_to_message && msg.reply_to_message.video) {
                const file = await bot.getFile(msg.reply_to_message.video.file_id);
                audioUrl = `https://api.telegram.org/file/bot${bot.token}/${file.file_path}`;
            } 
            // 2️⃣ URL argument
            else if (args.length > 0) {
                const url = args[0];
                const data = await downloadVideo(url); // JOY downloader
                if (!data || !data.audio) throw new Error("Failed to fetch audio from URL");
                audioUrl = data.audio;
            } else {
                throw new Error("No video or URL provided");
            }

            // 3️⃣ Download MP3
            const mp3Path = path.join(downloadFolder, `JOY_${Date.now()}.mp3`);
            const response = await fetch(audioUrl);
            const buffer = await response.buffer();
            fs.writeFileSync(mp3Path, buffer);

            // 4️⃣ Telegram 50MB limit check
            const stats = fs.statSync(mp3Path);
            const fileSizeMB = stats.size / 1024 / 1024;
            if (fileSizeMB > 50) {
                await bot.deleteMessage(chatId, waitMsg.message_id);
                fs.unlinkSync(mp3Path);
                return bot.sendMessage(chatId, `❌ File too big (${fileSizeMB.toFixed(2)} MB). Cannot send via Telegram.\nDownload directly: ${audioUrl}`);
            }

            // 5️⃣ Send MP3
            await bot.deleteMessage(chatId, waitMsg.message_id);
            await bot.sendAudio(chatId, mp3Path, {}, { filename: path.basename(mp3Path) });

            // 6️⃣ Cleanup
            fs.unlinkSync(mp3Path);

        } catch (err) {
            console.error("MP3 Error:", err.message);
            await bot.deleteMessage(chatId, waitMsg.message_id);
            bot.sendMessage(chatId, `❌ Error: ${err.message}\nUsage: reply to a video with /mp3 or /mp3 <video URL>`);
        }
    },
};