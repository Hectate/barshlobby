// SPDX-FileCopyrightText: 2026 Nathaniel "Hectate" Mitchell
//
// SPDX-License-Identifier: MIT
import { CommandModel } from "@renderer/shell/commandModel";
import { shell } from "@renderer/store/shell.store";

export const echoCommands: CommandModel = {
    help: ["Simple command to echo inputs after vars have been replaced."],
    function: echoCommand,
};

function echoCommand(args: string[]) {
    shell.output([args.join(" ")]);
}
