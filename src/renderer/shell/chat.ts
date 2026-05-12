// SPDX-FileCopyrightText: 2026 Nathaniel "Hectate" Mitchell
//
// SPDX-License-Identifier: MIT
import { commandModel } from "@renderer/shell/commandModel";

export const chatCommands: commandModel = {
    help: ["Commands related to chat messaging"],
    subcommands: {
        send: {
            help: ["Sends a chat message to the destination"],
        },
    },
};
