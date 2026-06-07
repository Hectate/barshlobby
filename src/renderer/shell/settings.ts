// SPDX-FileCopyrightText: 2026 Nathaniel "Hectate" Mitchell
//
// SPDX-License-Identifier: MIT
import { CommandModel } from "@renderer/shell/commandModel";
import { shell, shellStore } from "@renderer/store/shell.store";
import { outputError } from "@renderer/shell/error";
import { settingsStore } from "@renderer/store/settings.store";

export const settingsCommands: CommandModel = {
    help: ["Client-wide settings"],
    function: unknownCommand,
    subcommands: {
        server: {
            help: [
                "Configure your list of saved Tachyon servers",
                "If you want reference an existing saved server, you can run 'settings.server -l' to retrieve the index of all saved servers first.",
                "Flags are required for this command. Incompatible flags will result in an error.",
                "Usage: settings.server -[flags] [hostname/ip/index]",
                "Example: settings.server -as my.tachyon.server:1234",
            ],
            flags: {
                a: "Add server to your server list. (incompatible with -d)",
                d: "Delete server from your server list. (incompatible with -a, -s)",
                s: "Set a specific server as your current server. (incompatible with -d)",
                l: "List all saved servers. (incompatible with all other flags)",
            },
            function: serverCommand,
        },
        verbose: {
            help: [
                "Enable/Disable verbose commands mode.",
                "Commands that are aliased (as shortcuts) will be hidden from the history unless this is enabled.",
                "If you would like to see the conversion of a command-as-typed into how the shell finally interpreted it, enable this.",
                "Usage: settings.verbose [on/off]",
                "Example: settings.verbose on",
            ],
            function: verboseCommand,
        },
        prompt: {
            help: [
                "Settings for the displayed prompt",
                "Allows you to customize the prompt to display more or less information.",
                "Info in the prompt will be updated in realtime if it changes.",
                "Note; not all settings are currently implemented. If no flags are provided, the default (-uh) will be set.",
                "Usage: settings.prompt [flags]",
                "Example: settings.prompt -uht",
            ],
            flags: {
                h: "Display connected host name or IP",
                u: "Display active username",
                i: "Display active user ID if known",
                l: "Display active lobby ID if known",
                p: "Display active party ID if known",
                m: "Display matchmaking status if known",
                t: "Display current system time",
            },
            function: promptCommand,
        },
    },
};

// If user sends an unknown settings command, or just "settings" we respond with the help info for this section.
function unknownCommand(args: string[]) {
    shell.parseCommand("help settings (auto-alias)");
}
function serverCommand(args: string[]) {
    const flags = {
        a: false,
        d: false,
        s: false,
        l: false,
    };
    //default behavior
    if (args.length === 1 || args[1][0] !== "-") {
        shell.output([`The current lobby server is: ${settingsStore.lobbyServer}`, "To do more, this command requires one or more flags, see help information below."]);
        shell.parseCommand("help settings.server (auto-alias)", true);
        return;
    } else if (args[1][0] === "-") {
        for (const char of args[1]) {
            if (char in flags) flags[char] = true;
        }
    }
    if (!validateServerFlags(flags)) {
        outputError(`Incompatible flags provided. See 'help ${args[0]} for more information.`);
        return;
    }
    // We now only have compatible flags and can handle them individually as appropriate.
    if (flags.s) {
        settingsStore.lobbyServer = args[2];
        shell.output([`Lobby server set to ${args[2]}. Please remember to 'user.auth' with any new server.`], { level: "info" });
    }
    if (flags.a) {
        if (settingsStore.customServerList.includes(args[2]) || defaultServers.includes(args[2])) {
            shell.output([`Lobby server ${args[2]} is already in the list.`], { level: "warn" });
        } else {
            settingsStore.customServerList.push(args[2]);
            shell.output([`Custom lobby server ${args[2]} added to list.`], { level: "info" });
        }
    }
    if (flags.d) {
        const i: number = settingsStore.customServerList.findIndex((element) => element == args[2]);
        if (i < 0) outputError(`Unable to delete server ${args[2]}`);
        else {
            settingsStore.customServerList.splice(i, 1);
            shell.output([`Custom lobby server ${args[2]} removed.`]);
        }
    }
    if (flags.l) {
        shell.clearIndices();
        const arr: string[] = [];
        arr.push(...defaultServers);
        arr.push(...settingsStore.customServerList);
        shell.output([`List of known servers:`]);
        arr.forEach((element, index) => {
            shell.addIndex(index.toString(), element);
            shell.output([`#${index} | ${element}`]);
        });
    }
}
function promptCommand(args: string[]) {
    shell.output(["This is currently unimplemented."]);
}
function verboseCommand(args: string[]) {
    if (args[1] === "on") {
        shellStore.verboseCommands = true;
        shell.output(["Verbose commands mode enabled."]);
    } else if (args[1] === "off") {
        shellStore.verboseCommands = false;
        shell.output(["Verbose commands mode disabled."]);
    } else {
        shell.output([`Verbose commands mode is currently ${shellStore.verboseCommands ? "enabled" : "disabled"}.`]);
    }
}
function validateServerFlags(flags: { a: boolean; d: boolean; s: boolean; l: boolean }): boolean {
    if (flags.d && (flags.a || flags.s || flags.l)) return false;
    if (flags.l && (flags.a || flags.s)) return false;
    return true;
}

export const defaultServers: string[] = ["wss://server4.beyondallreason.info", "wss://server5.beyondallreason.info", "wss://lobby-server-dev.beyondallreason.dev", "ws://localhost:4000"];
