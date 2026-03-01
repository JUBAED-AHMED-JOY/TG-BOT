module.exports = {
    config: {
        name: "left",
        description: "Notify when a member leaves the group",
        role: 0 // সকল event trigger করবে
    },

    handleEvent: async function({ event, api }) {
        const msg = event.msg;
        const chatId = msg.chat.id;

        // শুধুমাত্র member left হলে
        if (!msg.left_chat_member) return;

        try {
            const user = msg.left_chat_member;
            const name = user.first_name || "A member";

            const leaveMsg = `😢 ${name} has left the group.`;

            await api.sendMessage(chatId, leaveMsg, {
                reply_to_message_id: msg.message_id
            });
        } catch (err) {
            console.error("LEFT EVENT ERROR:", err);
            await api.sendMessage(chatId, "❌ Failed to send leave notification");
        }
    }
};