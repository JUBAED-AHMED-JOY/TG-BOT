const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: 'help',
    version: '2.1',
    author: 'Joy',
    cooldown: 3,
    role: 0,
    description: 'Display all commands or get info about a specific command',
    category: 'info',
    usePrefix: true
  },

  onStart: async function ({ bot, chatId, args }) {
    try {
      const config = require('../../config.json');
      const commandsDir = path.join(__dirname, '.');
      const files = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));

      const categories = {};
      const commandsList = {};

      for (const file of files) {
        try {
          delete require.cache[require.resolve(path.join(commandsDir, file))];
          const cmd = require(path.join(commandsDir, file));
          if (cmd.config && cmd.config.name) {
            const category = cmd.config.category || 'Uncategorized';
            if (!categories[category]) categories[category] = [];
            categories[category].push(cmd.config.name);
            commandsList[cmd.config.name.toLowerCase()] = cmd.config;
          }
        } catch (e) {}
      }

      if (args && args.length > 0 && args[0]) {
        const commandName = args[0].toLowerCase();
        const cmdConfig = commandsList[commandName];

        if (!cmdConfig) {
          return bot.sendMessage(chatId, `❌ Command '${commandName}' not found.`, {
            reply_markup: { inline_keyboard: [[{ text: "JOY AHMED", url: "https://t.me/JOY_AHMED_88" }]] }
          });
        }

        const roleText = cmdConfig.role === 2 ? 'Bot Admin' : cmdConfig.role === 1 ? 'Group Admin' : 'Everyone';

        let response = `╔═══ COMMAND INFO ═══╗\n\n`;
        response += `📌 Name: ${cmdConfig.name}\n`;
        response += `📝 Description: ${cmdConfig.description || 'No description'}\n`;
        response += `👤 Author: ${cmdConfig.author || 'Unknown'}\n`;
        response += `📂 Category: ${cmdConfig.category || 'Uncategorized'}\n`;
        response += `🛡️ Role: ${roleText}\n`;
        response += `⏱️ Cooldown: ${cmdConfig.cooldown || 0}s\n`;
        response += `💡 Usage: ${config.prefix}${cmdConfig.name}\n`;
        response += `\n╚═══════════════════╝`;

        return bot.sendMessage(chatId, response, {
          reply_markup: { inline_keyboard: [[{ text: "JOY AHMED", url: "https://t.me/JOY_AHMED_88" }]] }
        });
      } else {
        let helpMsg = `╔════════════════════╗\n`;
        helpMsg += `   🍉 JOY BOT 🍉\n`;
        helpMsg += `╚════════════════════╝\n\n`;

        const sortedCategories = Object.keys(categories).sort();
        for (const category of sortedCategories) {
          helpMsg += `\n╭─ ${category.toUpperCase()} ─╮\n`;
          const cmds = categories[category].sort();
          for (let i = 0; i < cmds.length; i += 3) {
            const row = cmds.slice(i, i + 3).map(c => `• ${c}`).join(' ');
            helpMsg += `│ ${row}\n`;
          }
          helpMsg += `╰${'─'.repeat(category.length + 4)}╯\n`;
        }

        const totalCommands = Object.keys(commandsList).length;
        helpMsg += `\n╭─ BOT INFO ─╮\n`;
        helpMsg += `│ 📜 Total: ${totalCommands} commands\n`;
        helpMsg += `│ 💡 Usage: ${config.prefix}help <cmd>\n`;
        helpMsg += `│ 👑 Created by: Joy Ahmed\n`;
        helpMsg += `│ 🌐 Telegram: t.me/JOY_AHMED_88\n`;
        helpMsg += `╰──────────────╯`;

        return bot.sendMessage(chatId, helpMsg, {
          reply_markup: { inline_keyboard: [[{ text: "JOY AHMED", url: "https://t.me/JOY_AHMED_88" }]] }
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