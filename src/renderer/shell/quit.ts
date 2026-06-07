// SPDX-FileCopyrightText: 2026 Nathaniel "Hectate" Mitchell
//
// SPDX-License-Identifier: MIT
import { CommandModel } from "@renderer/shell/commandModel";

export const quitCommands: CommandModel = {
    help: ["Closes the client."],
    function: quitClient,
};

function quitClient() {
    window.close();
}
