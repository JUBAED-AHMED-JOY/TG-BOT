module.exports = {
  config: {
    name: "textpro",
    description: "Generate text effects image using Joy Text API",
    author: "JOY",
    role: 0,
    cooldown: 5,
    prefix: true,
    usages: "[effect number] [text]",
    category: "tools"
  },

  //এটাই ব্যবহার হবে command trigger হালে
  onStart: async function({ api, event, args }) {
    const axios = require("axios");
    const fs = require("fs-extra");
    const path = require("path");

    // args validate
    if (!args || args.length < 2) {
      return api.sendMessage(
        "⚠️ ভুল ব্যবহার!\n\nসঠিক ব্যবহার: .textpro <effect number> <text>\nউদাহরণ: .textpro 1 Hello",
        event.threadID,
        event.messageID
      );
    }

    const number = args[0];
    const text = args.slice(1).join(" ");

    try {
      // Joy API call
      const res = await axios.get("https://joy-text-api.onrender.com/joy", {
        params: {
          apikey: "joy",
          number,
          text
        },
        timeout: 15000 // 15 sec
      });

      // response error handling
      if (!res.data || res.data.status !== "success") {
        return api.sendMessage(
          `❌ API এর উত্তর পাওয়া যায়নি বা ভুল: ${res.data?.message || "Unknown error"}`,
          event.threadID,
          event.messageID
        );
      }

      // API থেকে image URL
      const imageURL = res.data.data.effectURL;

      // Temporary file path
      const imagePath = path.join(__dirname, `textpro_${Date.now()}.jpg`);

      // Download image
      const response = await axios.get(imageURL, { responseType: "arraybuffer" });
      await fs.writeFile(imagePath, response.data);

      // Send image back to chat
      await api.sendMessage(
        { body: `🎨 Text Effect: ${text}`, attachment: fs.createReadStream(imagePath) },
        event.threadID,
        () => fs.unlinkSync(imagePath) // file delete after send
      );

    } catch (err) {
      console.error("❌ TextPro onStart Error:", err);
      return api.sendMessage(
        "❌ API call ব্যর্থ হয়েছে, আবার চেষ্টা করুন।",
        event.threadID,
        event.messageID
      );
    }
  }
};