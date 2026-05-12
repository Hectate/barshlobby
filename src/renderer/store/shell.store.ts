// SPDX-FileCopyrightText: 2025 Nathaniel "Hectate" Mitchell
//
// SPDX-License-Identifier: MIT
import { commands } from "@renderer/shell/commands";
import { reactive } from "vue";
import { outputError } from "@renderer/shell/error";

export const shellStore: {
    isInitialized: boolean;
    log: string[];
    history: string[];
    prompt: string[];
    suggestions: string[];
    vars: Map<string, string>;
} = reactive({
    isInitialized: false,
    log: [],
    history: [],
    prompt: ["BAR.sh-$"],
    suggestions: [],
    vars: new Map(),
});

const defaultVars = ["lobby", "self", "party", "server"];

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
    shellStore.log.push(input);
    shellStore.history.push(shellStore.prompt.join("") + " " + input);
    const args = input.split(" ");
    if (args[0].toLowerCase() === "help") {
        handleHelpRequest(args);
    } else {
        //TODO: replace all variables before pushing them into this next function
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
                shellStore.history.push(`* ${key} - ${commands[key].help[0]}`); //The first help index should always be a short summary, so we display that only for the basic help command.
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
};
