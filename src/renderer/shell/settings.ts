// SPDX-FileCopyrightText: 2026 Nathaniel "Hectate" Mitchell
//
// SPDX-License-Identifier: MIT
import { commandModel } from "@renderer/shell/commandModel";
import { shell } from "@renderer/store/shell.store";

export const settingsCommands: commandModel = {
    help: ["Client-wide settings"],
    function: unknownCommand,
    subcommands: {
        server: {
            help: [
                "Configure your list of saved Tachyon servers",
                "Usage: settings.server -[flags] [hostname/ip/index]",
                "If you want reference an existing saved server, you can run 'settings.server -l' to retrieve the index of all saved servers first.",
                "Incompatible flags are set in sequential order. For example, '-ad' will be a Delete Server operation, not Add Server.",
                "Available flags:",
            ],
            flags: {
                a: "Add server to your server list. (incompatible with -d)",
                d: "Delete server from your server list. (incompatible with -a, -s)",
                s: "Set a specific server as your current server. (incompatible with -d)",
                l: "List all saved servers with indices shown.",
                i: "Index mode: The hostname will be assumed to be a valid index from your existing server list. (incompatible with -a)",
            },
            function: serverCommand,
        },
        assets: {
            help: ["Set the path for storage of asset files"],
            function: assetsCommand,
        },
        state: {
            help: ["Set the path for storage of state files"],
            function: stateCommand,
        },
        prompt: {
            help: ["Settings for the system prompt"],
            flags: {
                v: "Verbose mode",
                h: "Display connected host name or IP",
                u: "Display active username",
                i: "Display active user ID if known",
                l: "Display active lobby ID if known",
                p: "Display active party ID if known",
                m: "Display matchmaking status if known",
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
    console.log("servercommand");
}
function assetsCommand(args: string[]) {}
function stateCommand(args: string[]) {}
function promptCommand(args: string[]) {}
