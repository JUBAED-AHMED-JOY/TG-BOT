module.exports = {
  config: {
    name: "groupinfo",
    aliases: ["grpinfo"],
    version: "1.0.1",
    author: "Joy",
    description: "Get detailed group information",
    category: "group",
    cooldown: 5,
    role: 0,
    usePrefix: true
  },

  onStart: async function ({ bot, chatId, msg }) {
    try {
      // Check if this is a group
      if (!msg.chat || msg.chat.type === "private") {
        return bot.sendMessage(chatId, "❌ This command can only be used in groups.", {
          reply_to_message_id: msg.message_id
        });
      }

      // Fetch chat info
      const chat = await bot.getChat(chatId);
      const memberCount = await bot.getChatMembersCount(chatId).catch(() => 0);
      const admins = await bot.getChatAdministrators(chatId).catch(() => []);

      const escapeMarkdown = (text) => {
        if (!text) return "";
        return text
          .replace(/_/g, "\\_")
          .replace(/\*/g, "\\*")
          .replace(/\[/g, "\\[")
          .replace(/]/g, "\\]")
          .replace(/\(/g, "\\(")
          .replace(/\)/g, "\\)")
          .replace(/~/g, "\\~")
          .replace(/`/g, "\\`")
          .replace(/>/g, "\\>")
          .replace(/#/g, "\\#")
          .replace(/\+/g, "\\+")
          .replace(/-/g, "\\-")
          .replace(/=/g, "\\=")
          .replace(/\|/g, "\\|")
          .replace(/\{/g, "\\{")
          .replace(/\}/g, "\\}")
          .replace(/\./g, "\\.")
          .replace(/!/g, "\\!");
      };

      const adminList = admins.length > 0 
        ? admins.map(admin => {
            const username = admin.user.username 
              ? `@${escapeMarkdown(admin.user.username)}`
              : escapeMarkdown(admin.user.first_name || "Unknown");
            return `\\- ${username}`;
          }).join("\n")
        : "No admins found";

      const groupInfo = `👥 *Group Info:*\n` +
                        `\\- *Name:* ${escapeMarkdown(chat.title || "Unnamed Group")}\n` +
                        `\\- *Members:* ${memberCount}\n` +
                        `\\- *Admins:*\n${adminList}`;

      // Send info with photo if exists
      if (chat.photo && (chat.photo.big_file_id || chat.photo.small_file_id)) {
        const fileId = chat.photo.big_file_id || chat.photo.small_file_id;
        await bot.sendPhoto(chatId, fileId, {
          caption: groupInfo,
          parse_mode: "MarkdownV2",
          reply_to_message_id: msg.message_id
        });
      } else {
        await bot.sendMessage(chatId, groupInfo, {
          parse_mode: "MarkdownV2",
          reply_to_message_id: msg.message_id
        });
      }

    } catch (err) {
      console.error("GroupInfo Error:", err);
      return bot.sendMessage(chatId, "❌ Could not fetch group info.", {
        reply_to_message_id: msg.message_id
      });
    }
  }
};