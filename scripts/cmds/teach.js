const axios = require("axios");

module.exports = {
    config: {
        name: "teach",
        aliases: [],
        version: "5.1.0",
        author: "JOY",
        role: 0, // admin only (group admin / owner)
        cooldown: 2,
        description: "Teach AI question & answer",
        category: "admin",
        usePrefix: true
    },

    onStart: async function ({ bot, chatId, msg, args, api }) {
        try {
            const githubApiUrl =
                "https://raw.githubusercontent.com/JUBAED-AHMED-JOY/Joy/main/api.json";

            // ======================
            // LOAD API URL
            // ======================
            async function getApiUrl() {
                try {
                    const res = await axios.get(githubApiUrl, {
                        headers: { "Cache-Control": "no-cache" }
                    });
                    return res.data?.api || null;
                } catch {
                    return null;
                }
            }

            // ======================
            // SEND TEACH
            // ======================
            async function sendTeach(apiUrl, ask, ans) {
                try {
                    const res = await axios.get(`${apiUrl}/sim`, {
                        params: { teach: `${ask}|${ans}` }
                    });
                    return res.data;
                } catch {
                    return null;
                }
            }

            const apiUrl = await getApiUrl();
            if (!apiUrl)
                return api.sendMessage(
                    "❌ API লোড করা যায়নি",
                    chatId,
                    { reply_to_message_id: msg.message_id }
                );

            // ======================
            // CASE 1: Reply দিয়ে teach
            // ======================
            if (msg.reply_to_message) {
                if (args.length === 0) {
                    return api.sendMessage(
                        "❌ Reply দিয়ে teach করতে হলে লিখো:\nteach প্রশ্ন",
                        chatId,
                        { reply_to_message_id: msg.message_id }
                    );
                }

                const ask = args.join(" ").toLowerCase();
                const ans = msg.reply_to_message.text;

                if (!ans)
                    return api.sendMessage(
                        "❌ Reply করা message এ লেখা নেই",
                        chatId
                    );

                const result = await sendTeach(apiUrl, ask, ans);

                if (result) {
                    return api.sendMessage(
                        `✅ Teach Added!\n\n📝 প্রশ্ন: ${ask}\n💡 উত্তর: ${ans}`,
                        chatId
                    );
                }

                return api.sendMessage("⚠️ Teach failed", chatId);
            }

            // ======================
            // CASE 2: Normal teach
            // ======================
            const input = args.join(" ");
            let ask, ans;

            if (input.includes("|")) {
                [ask, ans] = input.split("|").map(t => t.trim());
            } else if (input.includes("-")) {
                [ask, ans] = input.split("-").map(t => t.trim());
            }

            if (!ask || !ans) {
                return api.sendMessage(
                    "❌ ভুল format!\n\n✅ teach প্রশ্ন | উত্তর\n✅ teach প্রশ্ন - উত্তর\n✅ reply দিয়ে: teach প্রশ্ন",
                    chatId,
                    { reply_to_message_id: msg.message_id }
                );
            }

            const result = await sendTeach(apiUrl, ask.toLowerCase(), ans);

            if (result) {
                return api.sendMessage(
                    `✅ Teach Added!\n\n📝 প্রশ্ন: ${ask}\n💡 উত্তর: ${ans}`,
                    chatId
                );
            }

            return api.sendMessage("⚠️ Teach failed", chatId);

        } catch (err) {
            console.error(err);
            api.sendMessage("❌ Teach command error", chatId);
        }
    }
};