// SPDX-FileCopyrightText: 2026 Nathaniel "Hectate" Mitchell
//
// SPDX-License-Identifier: MIT
import { CommandModel } from "@renderer/shell/commandModel";
import { shell, shellStore } from "@renderer/store/shell.store";
import { outputError } from "@renderer/shell/error";

export const varCommands: CommandModel = {
    help: [
        "Commands related to shell variables.",
        "Variables are a way to quickly re-use known strings using named references, rather than typing them out manually.",
        "For example, typing a lobby ID can be slow and prone to mistakes. Instead, you simply reference the variable with :lobby and Barsh will replace it with the saved ID.",
        "Nested variables are not supported, although they may work? Beware of infinitely nested variables.",
        "Variables are replaced *before* the command is parsed, so it is possible to make command aliases with them.",
        "Undefined variables will be treated as a non-variable string and not be replaced when used.",
        "Barsh automatically creates and updates certain variables during use. You may also define your own, see 'help var.add'.",
        "Indexed variables are created by Barsh when a list is generated in the output. See 'help var.index' for more information.",
        "Syntax | :[var name]",
        "Example | settings.server -s :my_server",
    ],
    function: unknownCommand,
    subcommands: {
        add: {
            help: [
                "Adds a user-defined variable to the list of known vars.",
                "If the name of the variable is the same as a default variable, this will fail.",
                "If the variable name already exists, it will be overwritten. Names are case-sensitive.",
                "Variable names cannot have spaces, nor can they start with a # character.",
                "Usage   | var.add [name] [...string]",
                "Example | var.add gg Good Game!",
            ],
            function: addCommand,
        },
        del: {
            help: [
                "Deletes a user-defined variable from the list of known vars.",
                "If the name of the variable is the same as a default variable, this will fail.",
                "Usage   | var.del [name]",
                "Example | var.del gg",
            ],
            function: delCommand,
        },
        list: {
            help: ["Outputs the of lists known variables", "The default behavior is to display user-defined variables (same as -u flag)", "Usage   | var.list [flags]", "Example | var.list -v"],
            function: listCommand,
            flags: {
                v: "Verbose mode (same as -idu)",
                i: "Display indexed variables",
                d: "Display Barsh default variables",
                u: "Display user-defined variables",
            },
        },
        index: {
            help: [
                "Information about indexed variables auto-created by Barsh",
                "Indexed variables are automatically generated whenever an indexed list is printed to the output.",
                "Once a new indexed list is printed, any past indexed variables are fully replaced by the new output.",
                "For example, 'lobby.members -l' will print an indexed list of other users in the lobby.",
                "Each entry will have a number representing the index of that item as saved in the index variables.",
                "The syntax to reference an indexed variable is ':#[number]'. For example, ':#10' will return the 10th item from the prior list, if it exists.",
                "Leading zeros are fine but will be ignored.",
            ],
            function: indexCommand,
        },
    },
};

// If user sends an unknown settings command, or just "settings" we respond with the help info for this section.
function unknownCommand(args: string[]) {
    shell.parseCommand("help var (auto-alias)", true);
}
function addCommand(args: string[]) {
    if (validateVarName(args)) {
        const payload = args.slice(2).join(" ");
        shellStore.vars.set(args[1], payload);
    } else return;
}
function delCommand(args: string[]) {
    if (validateVarName(args)) {
        const result: boolean = shellStore.vars.delete(args[1]);
        if (result) shell.output([`Var '${args[1]}' deleted.`], { level: "info" });
        else shell.output([`Var ${args[1]} did not exist.`], { level: "warn" });
    }
    return;
}
function listCommand(args: string[]) {
    const flags = {
        v: false,
        i: false,
        d: false,
        u: false,
    };
    // default behavior
    if (args.length === 1 || args[1][0] !== "-") {
        flags.u = true;
    } else if (args[1][0] === "-") {
        for (const char of args[1]) {
            if (char in flags) flags[char] = true;
        }
    }
    let index: number = 0;
    const arr: string[] = [];
    if (flags.i) {
        shellStore.indices.forEach((value, key) => {
            arr.push(`#${key} | ${value}`);
        });
    }
    if (flags.d || flags.v) {
        shell.clearIndices();
        shellStore.vars.forEach((value, key) => {
            if (shell.defaultVars.includes(key)) {
                arr.push(`#${index} DEFAULT: ${key} | ${value}`);
                shell.addIndex(index.toString(), value);
                index++;
            }
        });
    }
    if (flags.u || flags.v) {
        shell.clearIndices();
        shellStore.vars.forEach((value, key) => {
            if (!shell.defaultVars.includes(key)) {
                arr.push(`#${index} CUSTOM: ${key} | ${value}`);
                shell.addIndex(index.toString(), value);
                index++;
            }
        });
    }
    shell.output(arr);
}
function indexCommand(args: string[]) {
    shell.parseCommand("help var.index (auto-alias)", true);
}

function validateVarName(args: string[]): boolean {
    if (args.length === 1) {
        shell.parseCommand(`help ${args[0]} (auto-alias)`, true);
        return false;
    }
    if (args[1][0] === "#") {
        outputError(`Invalid variable name '${args[1]}'. Use of # at the start of a name is reserved for auto-indexed variables.`);
        return false;
    }
    if (shell.defaultVars.includes(args[1])) {
        outputError(`Invalid variable name '${args[1]}'. Default variable names and command names are reserved. See 'vars.list -d' for reserved default variables.`);
        return false;
    }
    return true;
}
