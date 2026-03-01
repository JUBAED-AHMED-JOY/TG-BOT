module.exports = {
  config: {
    name: "user",
    aliases: ["usr"],
    version: "1.0.0",
    credits: "Joy", // Author
    permission: 1,  // 0=Everyone, 1=Group Admin, 2=Bot Owner
    description: "Ban or Unban a user in the group",
    category: "moderation",
    usages: "user ban/revoke (reply to user)",
    prefix: false
  },

  onStart: async ({ bot, event, args }) => {
    const chatId = event.threadID;
    const senderId = event.senderID;

    // Check if the command is used in a group
    if (!event.isGroup) {
      return bot.sendMessage(chatId, "❌ This command can only be used in groups.");
    }

    // Check if user is group admin
    const admins = await bot.getChatAdministrators(chatId);
    const isAdmin = admins.some(a => a.user.id === senderId);
    if (!isAdmin) {
      return bot.sendMessage(chatId, "⚠️ Only group admins can use this command.");
    }

    // Reply to a user
    if (!event.msg.reply_to_message) {
      return bot.sendMessage(chatId, "⚠️ Please reply to the user's message you want to ban/unban.");
    }

    const targetUser = event.msg.reply_to_message.from.id;
    const action = args[0]?.toLowerCase();

    if (!action || !["ban", "unban"].includes(action)) {
      return bot.sendMessage(chatId, "⚠️ Invalid action. Use `ban` or `unban`.");
    }

    try {
      let userDataPath = "./userData.json";
      let userData = require(userDataPath);

      if (!userData[chatId]) userData[chatId] = {};

      if (action === "ban") {
        userData[chatId][targetUser] = true;
        fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));
        return bot.sendMessage(chatId, `✅ User has been banned.`, { reply_to_message_id: event.msg.message_id });
      } else if (action === "unban") {
        delete userData[chatId][targetUser];
        fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));
        return bot.sendMessage(chatId, `✅ User has been unbanned.`, { reply_to_message_id: event.msg.message_id });
      }
    } catch (err) {
      console.error(err);
      return bot.sendMessage(chatId, `❌ Error: ${err.message}`, { reply_to_message_id: event.msg.message_id });
    }
  }
};