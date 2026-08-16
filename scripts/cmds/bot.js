const axios = require("axios");

module.exports = {
  config: {
    name: "bot",
    aliases: ["sim"],
    usePrefix: false,
    role: 0,
    author: "JOY AHMED",
    description: "AI Chat Reply System"
  },

  onStart: async function ({ bot, chatId, userId, event, args }) {
    const usermsg = args.join(" ") || "";

    // 👉 greeting
    if (!usermsg) {
      const greetings = [
        "আহ শুনা আমার তোমার অলিতে গলিতে উম্মাহ😇😘",
        "কি গো সোনা আমাকে ডাকছ কেনো",
        "বার বার আমাকে ডাকস কেন😡",
        "আহ শোনা আমার আমাকে এতো ডাকতাছো কেনো আসো বুকে আশো🥱",
        "হুম জান তোমার অইখানে উম্মমাহ😷😘",
        "আসসালামু আলাইকুম বলেন আপনার জন্য কি করতে পারি",
        "আমাকে এতো না ডেকে বস জয়কে একটা গফ দে 🙄"
      ];

      const msgText = greetings[Math.floor(Math.random() * greetings.length)];

      const sent = await bot.sendMessage(chatId, `${msgText}`, {
        reply_to_message_id: event.messageID
      });

      global.globalHandleReply.push({
        messageID: sent.message_id,
        author: userId,
        handleReply: this.handleReply.bind(this)
      });

      return;
    }

    // 👉 AI response
    try {
      const apis = await axios.get(
        "https://raw.githubusercontent.com/JUBAED-AHMED-JOY/Joy/main/api.json"
      );

      const apiurl = apis.data.api;

      const res = await axios.get(
        `${apiurl}/sim?type=ask&ask=${encodeURIComponent(usermsg)}`
      );

      const reply = res.data.data?.msg || "🤖 I don't understand.";

      const sent = await bot.sendMessage(
        chatId,
        `${reply}`,
        {
          reply_to_message_id: event.messageID
        }
      );

      global.globalHandleReply.push({
        messageID: sent.message_id,
        author: userId,
        handleReply: this.handleReply.bind(this)
      });

    } catch (err) {
      console.log("❌ Bot error:", err.message);
      bot.sendMessage(chatId, "❌ Bot API error");
    }
  },

  handleReply: async function ({ bot, event, handleReply }) {
    const chatId = event.threadId;
    const userId = event.senderID;
    const text = event.body;

    if (userId !== handleReply.author) return;

    try {
      const apis = await axios.get(
        "https://raw.githubusercontent.com/MOHAMMAD-NAYAN-07/Nayan/main/api.json"
      );

      const apiurl = apis.data.api;

      const res = await axios.get(
        `${apiurl}/sim?type=ask&ask=${encodeURIComponent(text)}`
      );

      const reply = res.data.data?.msg || "🤖 I don't understand.";

      const sent = await bot.sendMessage(chatId, `${reply}`, {
        reply_to_message_id: event.messageID
      });

      global.globalHandleReply.push({
        messageID: sent.message_id,
        author: userId,
        handleReply: this.handleReply.bind(this)
      });

    } catch (err) {
      console.log("❌ Reply error:", err.message);
      bot.sendMessage(chatId, "❌ Error continuing chat");
    }
  }
};
