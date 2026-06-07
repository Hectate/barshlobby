// SPDX-FileCopyrightText: 2026 Nathaniel "Hectate" Mitchell
//
// SPDX-License-Identifier: MIT
import { CommandModel } from "@renderer/shell/commandModel";
import { shell } from "@renderer/store/shell.store";

export const quitCommands: CommandModel = {
    help: ["Closes the client."],
    function: promptQuit,
    prompts: {
        default: "n",
        options: {
            y: quitClient,
            n: cancelQuit,
        },
    },
};

function promptQuit() {
    shell.output("Are you sure? [y/N]");
}

function quitClient() {
    window.close();
}
function cancelQuit() {
    return;
}
