const axios = require("axios");

module.exports = {
  config: {
    name: "teach",
    aliases: ["শিখাও"],
    usePrefix: true,
    role: 0,
    author: "JOY AHMED",
    description: "Teach AI new question-answer pair (/teach Question - Answer)"
  },

  onStart: async function ({ bot, chatId, userId, event, args }) {
    const text = args.join(" ").trim();

    if (!text.includes("-")) {
      return bot.sendMessage(
        chatId,
        "❌ ভুল ফরম্যাট!\nসঠিক ফরম্যাট: `/teach Question - Answer`",
        { reply_to_message_id: event.messageID }
      );
    }

    const [ask, ans] = text.split("-").map(t => t.trim());

    if (!ask || !ans) {
      return bot.sendMessage(
        chatId,
        "❌ প্রশ্ন বা উত্তর খালি হতে পারবে না!\nউদাহরণ: `/teach How are you? - আমি ভালো আছি`",
        { reply_to_message_id: event.messageID }
      );
    }

    try {
      // API URL fetch
      const apis = await axios.get(
        "https://raw.githubusercontent.com/JUBAED-AHMED-JOY/Joy/main/api.json"
      );
      const apiurl = apis.data.api;

      // Teach API call
      const res = await axios.get(
        `${apiurl}/sim?type=teach&ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}`
      );

      // ✅ Success check now based on msg text
      const msg = res.data.msg && res.data.msg.toLowerCase().includes("successfully") 
        ? `✅ Successfully taught AI!\nQ: ${ask}\nA: ${ans}` 
        : `❌ Teach failed!\nAPI Response: ${JSON.stringify(res.data)}`;

      await bot.sendMessage(chatId, msg, { reply_to_message_id: event.messageID });

    } catch (err) {
      console.log("❌ Teach command error:", err.message);
      bot.sendMessage(chatId, "❌ API error while teaching AI", { reply_to_message_id: event.messageID });
    }
  }
};
