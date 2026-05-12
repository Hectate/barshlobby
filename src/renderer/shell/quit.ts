// SPDX-FileCopyrightText: 2026 Nathaniel "Hectate" Mitchell
//
// SPDX-License-Identifier: MIT
import { commandModel } from "@renderer/shell/commandModel";

export const quitCommands: commandModel = {
    help: ["Closes the client."],
    function: quitClient,
};

function quitClient() {
    window.close();
}
