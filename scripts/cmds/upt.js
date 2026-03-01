const os = require("os");
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

module.exports = {
    config: {
        name: "upt",
        aliases: ["uptime", "system", "status"],
        version: "1.2",
        author: "Joy",
        role: 0,
        cooldown: 5,
        description: "Show bot uptime and system status",
        category: "system",
        usePrefix: true
    },

    onStart: async function ({ bot, chatId }) {
        try {
            // ================= UPTIME =================
            const uptime = process.uptime();
            const hours = Math.floor(uptime / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            const seconds = Math.floor(uptime % 60);
            const uptimeStr = `${hours}h ${minutes}m ${seconds}s`;

            // ================= RAM =================
            const totalRAM = os.totalmem() / 1024 / 1024 / 1024;
            const usedRAM = (os.totalmem() - os.freemem()) / 1024 / 1024 / 1024;

            // ================= CPU =================
            const cpus = os.cpus();
            const cpuModel = cpus[0].model;
            const cpuCores = cpus.length;

            // ================= SYSTEM =================
            const nodeVersion = process.version;
            const platform = os.platform();
            const arch = os.arch();

            // ================= DISK =================
            let diskUsage = "Unavailable";
            try {
                const df = execSync("df -h /").toString().split("\n")[1].split(/\s+/);
                diskUsage = `${df[2]} used / ${df[1]} total`;
            } catch {
                diskUsage = "Not supported";
            }

            // ================= GROUP COUNT =================
            let groupCount = 0;
            try {
                const groupsPath = path.join(process.cwd(), "chatGroups.json");
                if (fs.existsSync(groupsPath)) {
                    const groups = JSON.parse(fs.readFileSync(groupsPath));
                    groupCount = groups.length;
                }
            } catch {}

            // ================= MESSAGE =================
            const msg =
`📊 BOT & SYSTEM STATUS

⏰ Uptime        : ${uptimeStr}
👥 Total Groups : ${groupCount}

💾 RAM           : ${usedRAM.toFixed(2)}GB / ${totalRAM.toFixed(2)}GB
🖥 CPU           : ${cpuModel}
🔢 CPU Cores    : ${cpuCores}

🧠 Node.js      : ${nodeVersion}
🖧 Platform     : ${platform} (${arch})
💽 Disk         : ${diskUsage}
`;

            bot.sendMessage(chatId, msg);

        } catch (err) {
            console.error("Upt error:", err);
            bot.sendMessage(chatId, "❌ Failed to get system info.");
        }
    }
};