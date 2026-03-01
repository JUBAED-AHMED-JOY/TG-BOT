const axios = require("axios");

module.exports = {
    config: {
        name: "rndm",
        description: "Fetch video by name",
        usage: "/rndm <name>",
        author: "Joy Ahmed",
        role: 0,
        cooldown: 5,
        usePrefix: true
    },

    onStart: async ({ bot, chatId, args, message }) => {
        try {
            const name = args[0];
            if (!name) return message.reply("❌ Please provide a video name. Example: /rndm joy");

            // Call your API to get random video by name
            const res = await axios.get(`https://joy-random-api-404-hqkv.vercel.app/random?name=${encodeURIComponent(name)}`);

            if (!res.data || !res.data.url) {
                return message.reply(`❌ No video found with name: ${name}`);
            }

            // Send video to chat
            await bot.sendVideo(chatId, res.data.url, { caption: `🎬 ${res.data.name}` });

        } catch (err) {
            console.error("❌ Video command error:", err);
            message.reply("❌ An error occurred while fetching the video.");
        }
    }
};