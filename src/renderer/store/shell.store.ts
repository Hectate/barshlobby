// SPDX-FileCopyrightText: 2025 Nathaniel "Hectate" Mitchell
//
// SPDX-License-Identifier: MIT
import { commands } from "@renderer/shell/commands";
import { reactive } from "vue";
import { outputError } from "@renderer/shell/error";
import { UserId, PartyId, LobbyId } from "tachyon-protocol/types";

type channel = {
    type?: "party" | "lobby" | "player";
    userId?: UserId;
    partyId?: PartyId;
    lobbyId?: LobbyId;
};

export const shellStore: {
    isInitialized: boolean;
    log: string[];
    history: string[];
    prompt: string[];
    suggestions: string[];
    vars: Map<string, string>;
    indices: Map<string, string>;
    lastChannel: channel;
} = reactive({
    isInitialized: false,
    log: [],
    history: [],
    prompt: ["BAR.sh-$"],
    suggestions: [],
    vars: new Map(),
    indices: new Map(),
    lastChannel: {},
});

// TODO: Tachyon features still need hooking up, and we need to handle incoming events that should be
// displayed to the user (e.g. chat messages, lobby votes, etc).
// TODO: Make aliases hidable with a setting to reduce verbosity in console.
// Will need both a setting to save as well as a way to identify when commands are not directly from the original string as typed (excluding vars subtitutions)
// TODO: custom vars should probably be saved as a settings instead of lost on close.
// TODO: Figure out how to make console text wrap, be highlight/copy-able, and ideally add colors for readability
// TODO: Replays
// TODO: Change timestamps to be readable values
// TODO: Replace userIDs with displaynames, with IDs also displayed.
const defaultVars = ["lobby", "self", "party"];

export async function initShellStore() {
    initializeCommands();
    initializeVars();
    shellStore.isInitialized = true;
}

function output(value: string[], options?: { level: "error" | "warn" | "info" }) {
    if (options?.level === "error") {
        console.log("error printed");
    }
    if (options?.level === "warn") {
        console.log("warning printed");
    }
    if (options?.level === "info") {
        console.log("info printed");
    }
    shellStore.history.push(...value);
}

function parseCommand(input: string) {
    const modified = insertVars(input, 0);
    shellStore.log.push(modified);
    shellStore.history.push(shellStore.prompt.join("") + " " + modified);
    const args = modified.split(" ");
    if (args[0].toLowerCase() === "help") {
        handleHelpRequest(args);
    } else {
        handleCommandRequest(args);
    }
}

function handleCommandRequest(args: string[]) {
    const target = args[0].split(".");
    try {
        if (target.length === 1) {
            commands[target[0]].function(args);
            return;
        } else {
            commands[target[0]].subcommands[target[1]].function(args);
            return;
        }
    } catch (error) {
        outputError(`Invalid function call for command ${args.join(" ")}`);
        console.log(error);
        return;
    }
}

function suggestCommand(input: string) {
    const arr: string[] = [];
    for (const key in commands) {
        if (key.startsWith(input.toLowerCase())) {
            arr.push(key);
        }
    }
    shellStore.suggestions = arr;
}

/**
 * Recursively edits strings by replacing words starting with : and :# with appropriate vars from the existing list.
 * @param input String to be altered
 * @param depth Current recursion depth. Start at 0 if you are calling this yourself.
 * @returns The new string, up to the current depth.
 */
function insertVars(input: string, depth: number): string {
    let dirty = false;
    let count = depth;
    const maxCount = 5;
    const args: string[] = input.split(" ");
    const out: string[] = Array.from(args);
    for (const i in args) {
        if (args[i][0] === ":") {
            if (args[i][1] === "#") {
                const word = args[i].substring(2);
                if (shellStore.indices.has(word)) {
                    dirty = true;
                    out[i] = shellStore.indices.get(word)!;
                }
            } else {
                const word = args[i].substring(1);
                if (shellStore.vars.has(word)) {
                    dirty = true;
                    out[i] = shellStore.vars.get(word)!;
                }
            }
        }
    }
    if (dirty && !(count >= maxCount)) {
        count++;
        return insertVars(out.join(" "), count);
    } else return out.join(" ");
}

function clearIndices() {
    shellStore.indices.clear();
}
function addIndex(pos: string, value: string) {
    shellStore.indices.set(pos, value);
}
function suggestVariable(input: string) {
    return;
}

function handleHelpRequest(args: string[]) {
    if (args.length === 1) {
        shellStore.history.push(...commands.help);
        for (const key in commands) {
            if (key == "help") {
                shellStore.history.push(`* help - This help message`);
            } else {
                if (!commands[key].hidden) {
                    shellStore.history.push(`* ${key} - ${commands[key].help[0]}`); //The first help index should always be a short summary, so we display that only for the basic help command.
                }
            }
        }
        return;
    }
    if (args[1].toLowerCase() == "help") {
        shellStore.history.push("There is no recursive help (this statement is a paradox).");
        return;
    }
    const target = args[1].split(".");
    try {
        if (target.length > 1) {
            shellStore.history.push(...commands[target[0]].subcommands[target[1]].help);
            for (const key in commands[target[0]].subcommands[target[1]].flags) {
                const item = commands[target[0]].subcommands[target[1]].flags[key];
                shellStore.history.push(` -${key} : ${item}`);
            }
        } else {
            shellStore.history.push(...commands[target[0]].help);
            for (const key in commands[target[0]].subcommands) {
                const item = commands[target[0]].subcommands[key];
                shellStore.history.push(`* ${key} - ${item.help[0]}`);
            }
        }
    } catch {
        return [`Invalid help request, please use 'help' for valid commands that can be used with the help command.`];
    }
}

function initializeCommands() {
    return;
}
function initializeVars() {
    for (const v of defaultVars) {
        shellStore.vars.set(v, "undefined");
    }
}

export const shell = {
    defaultVars,
    parseCommand,
    suggestCommand,
    suggestVariable,
    output,
    clearIndices,
    addIndex,
};
