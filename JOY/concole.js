const gradient = require('gradient-string');
const moment = require('moment');
const path = require('path');

function time() {
    return moment().format("HH:mm:ss");
}

console.log(gradient.morning(`
╔══════════════════════════════════════╗
        JOY COMMAND & EVENT MONITOR
╚══════════════════════════════════════╝
`));

const Module = require('module');
const originalRequire = Module.prototype.require;

Module.prototype.require = function (modulePath) {

    const exported = originalRequire.apply(this, arguments);

    try {
        const fullPath = Module._resolveFilename(modulePath, this);

        // ================= COMMAND MONITOR =================
        if (fullPath.includes(path.join('scripts', 'cmds'))) {
            if (exported && typeof exported.onStart === "function") {

                const originalOnStart = exported.onStart;

                exported.onStart = async function (...args) {
                    const cmdName = exported.config?.name || path.basename(fullPath);
                    const start = Date.now();

                    console.log(
                        gradient.fruit(`[${time()}] 🚀 COMMAND RUN → ${cmdName}`)
                    );

                    try {
                        const result = await originalOnStart.apply(this, args);
                        const end = Date.now();

                        console.log(
                            gradient.morning(`[${time()}] ✅ COMMAND SUCCESS → ${cmdName} (${end - start}ms)`)
                        );

                        return result;

                    } catch (err) {
                        console.log(
                            gradient.passion(`[${time()}] ❌ COMMAND FAIL → ${cmdName}\n   Error: ${err.message}`)
                        );
                        throw err;
                    }
                };
            }
        }

        // ================= EVENT MONITOR =================
        if (fullPath.includes(path.join('scripts', 'events'))) {
            if (exported && typeof exported.handleEvent === "function") {

                const originalHandle = exported.handleEvent;

                exported.handleEvent = async function (...args) {
                    const eventName = path.basename(fullPath);
                    const start = Date.now();

                    console.log(
                        gradient.atlas(`[${time()}] ⚡ EVENT RUN → ${eventName}`)
                    );

                    try {
                        const result = await originalHandle.apply(this, args);
                        const end = Date.now();

                        console.log(
                            gradient.cristal(`[${time()}] ✅ EVENT SUCCESS → ${eventName} (${end - start}ms)`)
                        );

                        return result;

                    } catch (err) {
                        console.log(
                            gradient.rainbow(`[${time()}] ❌ EVENT FAIL → ${eventName}\n   Error: ${err.message}`)
                        );
                        throw err;
                    }
                };
            }
        }

    } catch (e) {
        // ignore errors in require resolve
    }

    return exported;
};

// ===== GLOBAL ERROR CATCH =====
process.on('unhandledRejection', (err) => {
    console.log(
        gradient.cristal(`[${time()}] 💥 UNHANDLED PROMISE:\n${err?.stack || err}`)
    );
});

process.on('uncaughtException', (err) => {
    console.log(
        gradient.morning(`[${time()}] 💀 UNCAUGHT EXCEPTION:\n${err?.stack || err}`)
    );
});