// SPDX-FileCopyrightText: 2025 Nathaniel "Hectate" Mitchell
//
// SPDX-License-Identifier: MIT
import { commands } from "@renderer/shell/commands";
import { reactive } from "vue";
import { outputError } from "@renderer/shell/error";
import { UserId, PartyId, LobbyId } from "tachyon-protocol/types";
import { responseModel } from "@renderer/shell/responseModel";
import { ShellColor, shellColors } from "@renderer/store/shellColors";
import { PromptModel } from "@renderer/shell/promptModel";

type channel = {
    type?: "party" | "lobby" | "player";
    userId?: UserId;
    partyId?: PartyId;
    lobbyId?: LobbyId;
};

export const shellStore: {
    isInitialized: boolean;
    log: string[];
    history: responseModel[];
    prompt: string[];
    suggestions: string[];
    vars: Map<string, string>;
    indices: Map<string, string>;
    lastChannel: channel;
    verboseCommands: boolean;
    promptState: boolean;
    promptOptions?: PromptModel;
} = reactive({
    isInitialized: false,
    log: [],
    history: [],
    prompt: ["BAR.sh-$"],
    suggestions: [],
    vars: new Map(),
    indices: new Map(),
    lastChannel: {},
    verboseCommands: false,
    promptState: false,
    promptOptions: undefined,
});

// TODO: Tachyon features still need hooking up, and we need to handle incoming events that should be
// displayed to the user (e.g. chat messages, lobby votes, etc).
// TODO: custom vars should probably be saved as a settings instead of lost on close.
// TODO: Figure out how to make console text wrap, be highlight/copy-able
// TODO: Replays
// TODO: Replace userIDs with displaynames, with IDs also displayed.
// TODO: Make command parsing less brittle. There should be a dedicated command parser and then the command functions only need to consume the output, not the raw strings/args.
// This will give us the benefit of being able to construct commands as a new Object without using string concatenation too, for aliases.
// TODO: Include alias identifier in the command object so that nested aliases are hidden properly, not just the first level.
const defaultVars = ["lobby", "self", "party"];

export async function initShellStore() {
    initializeCommands();
    initializeVars();
    shellStore.isInitialized = true;
}

/**
 * Print a message to the terminal view.
 * @param value A string or array of strings to be printed
 * @param options Can change the color of the output, either with a level property or specific color property (which will override any level setting)
 */
function output(value: string | string[], options?: { level?: "error" | "warn" | "info" | "command" | "prompt"; color?: ShellColor }) {
    const messages = typeof value === "string" ? [value] : value;
    let color: ShellColor = shellColors.WHITE;
    if (options?.color) {
        color = options.color;
    } else {
        if (options?.level === "error") {
            color = shellColors.RED;
        }
        if (options?.level === "warn") {
            color = shellColors.YELLOW;
        }
        if (options?.level === "info") {
            color = shellColors.BLUE;
        }
    }
    for (const s of messages) {
        shellStore.history.push({ message: s, color });
    }
}

function parseCommand(input: string, alias?: boolean) {
    const modified = insertVars(input, 0);
    shellStore.log.push(modified);
    if (shellStore.verboseCommands || !alias) {
        output(shellStore.prompt.join("") + " " + modified);
    }
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
        if (shellStore.promptState) {
            handlePrompt(target[0].toLowerCase());
            return;
        } else {
            if (target.length === 1) {
                commands[target[0]].function(args);
                if ("prompts" in commands[target[0]]) {
                    shellStore.promptState = true;
                    shellStore.promptOptions = commands[target[0]].prompts;
                }
                return;
            } else {
                commands[target[0]].subcommands[target[1]].function(args);
                if ("prompts" in commands[target[0]].subcommands[target[1]]) {
                    shellStore.promptState = true;
                    shellStore.promptOptions = commands[target[0]].subcommands[target[1]].prompts;
                }
                return;
            }
        }
    } catch (error) {
        outputError(`Invalid function call for command ${args.join(" ")}`);
        console.log(error);
        return;
    }
}

function handlePrompt(response: string) {
    try {
        if (response === "") {
            response = shellStore.promptOptions!.default;
        }
        shellStore.promptOptions?.options[response]();
        shellStore.promptState = false;
    } catch (error) {
        console.log(error);
        outputError(`Invalid response ${response}`);
    }
}

function suggestCommand(input: string) {
    const arr: string[] = [];
    if (shellStore.promptState) {
        for (const key in shellStore.promptOptions?.options) {
            arr.push(key);
        }
    } else {
        for (const key in commands) {
            if (key.startsWith(input.toLowerCase())) {
                arr.push(key);
            }
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
        output(commands.help);
        for (const key in commands) {
            if (key == "help") {
                output(`* help - This help message`, { level: "info" });
            } else {
                if (!commands[key].hidden) {
                    output(`* ${key} - ${commands[key].help[0]}`, { level: "info" }); //The first help index should always be a short summary, so we display that only for the basic help command.
                }
            }
        }
        return;
    }
    if (args[1].toLowerCase() == "help") {
        output("There is no recursive help (this statement is a paradox).", { color: shellColors.INVERT });
        return;
    }
    const target = args[1].split(".");
    try {
        if (target.length > 1) {
            output(commands[target[0]].subcommands[target[1]].help);
            for (const key in commands[target[0]].subcommands[target[1]].flags) {
                const item = commands[target[0]].subcommands[target[1]].flags[key];
                output(` -${key} : ${item}`, { level: "info" });
            }
        } else {
            output(commands[target[0]].help);
            for (const key in commands[target[0]].subcommands) {
                const item = commands[target[0]].subcommands[key];
                output(`* ${key} - ${item.help[0]}`, { level: "info" });
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
