const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "removebg",
    version: "1.1.0",
    credits: "Joy",
    role: 0,
    category: "image",
    description: "Remove background from replied photo",
    cooldown: 10
  },

  onStart: async function ({ bot, chatId, msg }) {
    try {

      if (!msg.reply_to_message || !msg.reply_to_message.photo) {
        return bot.sendMessage(
          chatId,
          "❌ You must reply to a photo.",
          { reply_to_message_id: msg.message_id }
        );
      }

      const photoArray = msg.reply_to_message.photo;
      const fileId = photoArray[photoArray.length - 1].file_id;

      const loadingMsg = await bot.sendMessage(chatId, "🖼️ Removing background...");

      // 📥 Get file link from Telegram
      const file = await bot.getFile(fileId);
      const fileUrl = `https://api.telegram.org/file/bot${bot.token}/${file.file_path}`;

      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

      const inputPath = path.join(cacheDir, `photo_${Date.now()}.png`);

      const imageRes = await axios.get(fileUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(inputPath, imageRes.data);

      // 🔐 RemoveBG API Keys
      const KeyApi = [
        "qReKoWSpkMAi2vbi6RUEHctA",
        "ho37vvCUppqTKcyfjbLXnt4t",
        "ytr2ukWQW2YrXV8dshPbA8cE"
      ];

      const formData = new FormData();
      formData.append("size", "auto");
      formData.append("image_file", fs.createReadStream(inputPath));

      const response = await axios({
        method: "post",
        url: "https://api.remove.bg/v1.0/removebg",
        data: formData,
        responseType: "arraybuffer",
        headers: {
          ...formData.getHeaders(),
          "X-Api-Key": KeyApi[Math.floor(Math.random() * KeyApi.length)]
        }
      });

      if (response.status !== 200) {
        await bot.deleteMessage(chatId, loadingMsg.message_id);
        fs.unlinkSync(inputPath);
        return bot.sendMessage(chatId, "❌ RemoveBG failed.");
      }

      // 💾 Save processed image
      fs.writeFileSync(inputPath, response.data);

      await bot.deleteMessage(chatId, loadingMsg.message_id);

      await bot.sendPhoto(
        chatId,
        fs.createReadStream(inputPath),
        {
          caption: "✔️ Successfully removed background ✅"
        }
      );

      fs.unlinkSync(inputPath);

    } catch (err) {
      console.error("RemoveBG Error:", err);
      return bot.sendMessage(chatId, "❌ Server is busy now.");
    }
  }
};