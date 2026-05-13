// SPDX-FileCopyrightText: 2026 Nathaniel "Hectate" Mitchell
//
// SPDX-License-Identifier: MIT
import { commandModel } from "@renderer/shell/commandModel";
import { shell } from "@renderer/store/shell.store";

export const echoCommands: commandModel = {
    help: ["Simple command to echo inputs after vars have been replaced."],
    function: echoCommand,
};

function echoCommand(args: string[]) {
    shell.output([args.join(" ")]);
}
