module.exports = {
    config: {
        name: "welcome",
        description: "Send welcome message when a new member joins",
        role: 0 // সকল member/ইভেন্ট trigger করবে
    },

    handleEvent: async function({ event, api }) {
        const msg = event.msg;
        const chatId = msg.chat.id;

        // শুধুমাত্র নতুন সদস্য join হলে
        if (!msg.new_chat_members || msg.new_chat_members.length === 0) return;

        try {
            for (const user of msg.new_chat_members) {
                let name = user.first_name || "New member";

                let welcomeMsg = `🎉 Welcome, ${name}!\n\nHope you enjoy in this group.`;

                // Send welcome message
                await api.sendMessage(chatId, welcomeMsg, {
                    reply_to_message_id: msg.message_id
                });
            }
        } catch (err) {
            console.error("WELCOME EVENT ERROR:", err);
            await api.sendMessage(chatId, "❌ Failed to send welcome message");
        }
    }
};