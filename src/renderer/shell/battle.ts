// SPDX-FileCopyrightText: 2026 Nathaniel "Hectate" Mitchell
//
// SPDX-License-Identifier: MIT
import { commandModel } from "@renderer/shell/commandModel";

export const battleCommands: commandModel = {
    help: ["Commands related to offline gameplay"],
    subcommands: {
        start: {
            help: ["Attempts to launch the currently defined battle"],
        },
        teams: {
            help: ["Set the allyteam configuration"],
        },
    },
};
