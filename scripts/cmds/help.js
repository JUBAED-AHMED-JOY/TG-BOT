const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: 'help',
    version: '2.5',
    author: 'Joy',
    cooldown: 3,
    role: 0,
    description: 'Interactive help menu with buttons',
    category: 'info',
    usePrefix: true
  },

  onStart: async function ({ bot, chatId, args }) {
    try {
      const config = require('../../config.json');
      const commandsDir = path.join(__dirname, '.');
      const files = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));

      const commandsList = [];

      for (const file of files) {
        try {
          delete require.cache[require.resolve(path.join(commandsDir, file))];
          const cmd = require(path.join(commandsDir, file));
          if (cmd.config && cmd.config.name) {
            commandsList.push(cmd.config);
          }
        } catch (e) {}
      }

      const formatCommand = (index, cmd) => {
        const roleText = cmd.role === 2 ? 'Bot Admin' : cmd.role === 1 ? 'Group Admin' : 'Everyone';
        const aliases = cmd.aliases && cmd.aliases.length ? cmd.aliases.join(', ') : 'None';
        const author = cmd.author || 'Unknown';
        return `**${index}. /${cmd.name}**
📌 Description: ${cmd.description || 'No description'}
👤 Role: ✅ ${roleText}
📝 Aliases: ${aliases}
👑 Author: ${author}\n`;
      };

      if (args && args.length > 0 && args[0]) {
        // Single command info
        const commandName = args[0].toLowerCase();
        const cmdConfig = commandsList.find(c => c.name.toLowerCase() === commandName);

        if (!cmdConfig) {
          return bot.sendMessage(chatId, `❌ Command '${commandName}' not found.`, {
            reply_markup: { inline_keyboard: [[{ text: "JOY AHMED", url: "https://t.me/JOY_AHMED_88" }]] }
          });
        }

        const roleText = cmdConfig.role === 2 ? 'Bot Admin' : cmdConfig.role === 1 ? 'Group Admin' : 'Everyone';
        const aliases = cmdConfig.aliases && cmdConfig.aliases.length ? cmdConfig.aliases.join(', ') : 'None';
        const author = cmdConfig.author || 'Unknown';

        const response = `📜 **Command Info**
/${cmdConfig.name}
📌 Description: ${cmdConfig.description || 'No description'}
👤 Role: ✅ ${roleText}
📝 Aliases: ${aliases}
👑 Author: ${author}
💡 Usage: ${config.prefix}${cmdConfig.name}`;

        return bot.sendMessage(chatId, response, {
          parse_mode: 'Markdown',
          reply_markup: { inline_keyboard: [[{ text: "JOY AHMED", url: "https://t.me/JOY_AHMED_88" }]] }
        });
      } else {
        // Paginated list
        const pageSize = 5;
        const totalPages = Math.ceil(commandsList.length / pageSize);

        const sendPage = (page = 1) => {
          const start = (page - 1) * pageSize;
          const end = start + pageSize;
          const pageCommands = commandsList.slice(start, end);

          let msgText = `📜 **Help Menu (Page ${page}/${totalPages})**\n\n`;
          pageCommands.forEach((cmd, i) => {
            msgText += formatCommand(start + i + 1, cmd);
          });
          msgText += `💡 Use buttons below to navigate pages.`;

          const buttons = [];
          if (page > 1) buttons.push({ text: '⬅️ Prev', callback_data: `help_page_${page-1}` });
          if (page < totalPages) buttons.push({ text: 'Next ➡️', callback_data: `help_page_${page+1}` });

          bot.sendMessage(chatId, msgText, {
            parse_mode: 'Markdown',
            reply_markup: { inline_keyboard: [buttons, [{ text: "JOY AHMED", url: "https://t.me/JOY_AHMED_88" }]] }
          });
        };

        sendPage();

        bot.on('callback_query', async (query) => {
          if (!query.data.startsWith('help_page_')) return;
          const page = parseInt(query.data.split('_').pop());
          if (!page || page < 1) return;

          const start = (page - 1) * pageSize;
          const end = start + pageSize;
          const pageCommands = commandsList.slice(start, end);

          let msgText = `📜 **Help Menu (Page ${page}/${totalPages})**\n\n`;
          pageCommands.forEach((cmd, i) => {
            msgText += formatCommand(start + i + 1, cmd);
          });
          msgText += `💡 Use buttons below to navigate pages.`;

          const buttons = [];
          if (page > 1) buttons.push({ text: '⬅️ Prev', callback_data: `help_page_${page-1}` });
          if (page < totalPages) buttons.push({ text: 'Next ➡️', callback_data: `help_page_${page+1}` });

          bot.editMessageText(msgText, {
            chat_id: query.message.chat.id,
            message_id: query.message.message_id,
            parse_mode: 'Markdown',
            reply_markup: { inline_keyboard: [buttons, [{ text: "JOY AHMED", url: "https://t.me/JOY_AHMED_88" }]] }
          });

          bot.answerCallbackQuery(query.id);
        });
      }
    } catch (error) {
      console.error('Help error:', error);
      return bot.sendMessage(chatId, `❌ Error: ${error.message}`, {
        reply_markup: { inline_keyboard: [[{ text: "JOY AHMED", url: "https://t.me/JOY_AHMED_88" }]] }
      });
    }
  }
};
