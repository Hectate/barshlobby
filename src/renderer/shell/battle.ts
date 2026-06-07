// SPDX-FileCopyrightText: 2026 Nathaniel "Hectate" Mitchell
//
// SPDX-License-Identifier: MIT
import { CommandModel } from "@renderer/shell/commandModel";

export const battleCommands: CommandModel = {
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
