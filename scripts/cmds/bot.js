const axios = require("axios");

module.exports = {
    config: {
        name: "bot",
        aliases: [],
        version: "5.1.0",
        author: "JOY",
        role: 0,
        cooldown: 2,
        description: "No-prefix AI chat bot (reply + direct question)",
        category: "chat",
        usePrefix: false
    },

    onStart: async function ({ bot, chatId, msg, api }) {
        try {
            const githubApiUrl =
                "https://raw.githubusercontent.com/JUBAED-AHMED-JOY/Joy/main/api.json";

            const randomResponses = [
                "😔 কোনো উত্তর পাওয়া যায়নি",
                "⚠️ একটু পর আবার চেষ্টা করো",
                "🤖 আমি বুঝতে পারিনি"
            ];

            // ===== GET API URL =====
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

            // ===== CALL AI API =====
            async function callApi(params = {}) {
                const apiUrl = await getApiUrl();
                if (!apiUrl) return null;

                try {
                    const res = await axios.get(`${apiUrl}/sim`, { params });
                    return res.data;
                } catch {
                    return null;
                }
            }

            const text = (msg.text || "").trim();
            if (!text) return;

            const lower = text.toLowerCase();

            // ===== ONLY "bot" =====
            if (lower === "bot") {
                return api.sendMessage(
                    "🤖 বলো আমি শুনছি তো 😊",
                    chatId
                );
            }

            // ===== HELP =====
            if (lower === "help") {
                return api.sendMessage(
`🤖 BOT HELP

• bot → trigger
• যেকোন প্রশ্ন → AI reply
• teach প্রশ্ন - উত্তর
• keyinfo প্রশ্ন

No prefix needed ✅`,
                    chatId
                );
            }

            // ===== TEACH =====
            if (lower.startsWith("teach ")) {
                const content = text.slice(6).trim();
                const [ask, ans] = content.split(" - ");

                if (!ask || !ans)
                    return api.sendMessage(
                        "❌ Format: teach প্রশ্ন - উত্তর",
                        chatId
                    );

                const apiUrl = await getApiUrl();
                if (!apiUrl)
                    return api.sendMessage("❌ API পাওয়া যায়নি", chatId);

                try {
                    await axios.get(`${apiUrl}/sim`, {
                        params: { teach: `${ask}|${ans}` }
                    });

                    return api.sendMessage(
`✅ Teach Added!

ASK: ${ask}
ANS: ${ans}`,
                        chatId
                    );
                } catch {
                    return api.sendMessage(
                        "⚠️ Teach পাঠানো যায়নি",
                        chatId
                    );
                }
            }

            // ===== KEYINFO =====
            if (lower.startsWith("keyinfo ")) {
                const ask = text.slice(8).trim();
                if (!ask)
                    return api.sendMessage(
                        "❌ Format: keyinfo প্রশ্ন",
                        chatId
                    );

                try {
                    const apiUrl = await getApiUrl();
                    const res = await axios.get(`${apiUrl}/sim`, {
                        params: { list: "" }
                    });

                    const data = res.data;
                    if (!Array.isArray(data))
                        return api.sendMessage("❌ Data পাওয়া যায়নি", chatId);

                    const found = data.find(
                        i => i.ask?.toLowerCase() === ask.toLowerCase()
                    );

                    if (!found)
                        return api.sendMessage(
                            `❌ "${ask}" এর কোনো উত্তর নাই`,
                            chatId
                        );

                    const list =
                        found.answer
                            ?.map((a, i) => `${i + 1}. ${a}`)
                            .join("\n") || "❌ Empty";

                    return api.sendMessage(
`📚 ${ask}

${list}`,
                        chatId
                    );
                } catch {
                    return api.sendMessage(
                        "⚠️ Keyinfo error",
                        chatId
                    );
                }
            }

            // ===== NORMAL AI CHAT =====
            const res = await callApi({ text });

            const reply =
                res?.response ||
                res?.answer ||
                res?.data?.msg ||
                randomResponses[
                    Math.floor(Math.random() * randomResponses.length)
                ];

            return api.sendMessage(reply, chatId);

        } catch (err) {
            console.error(err);
            api.sendMessage("❌ Bot error হয়েছে", chatId);
        }
    }
};