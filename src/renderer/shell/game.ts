// SPDX-FileCopyrightText: 2026 Nathaniel "Hectate" Mitchell
//
// SPDX-License-Identifier: MIT
import { commandModel } from "@renderer/shell/commandModel";

export const gameCommands: commandModel = {
    help: ["Commands related to game files"],
    subcommands: {
        download: {
            help: ["Attempt to download a game to your current assets directory"],
        },
        list: {
            help: ["Displays a list of installed games in the current assets directory"],
        },
        available: {
            help: ["Displays a list of available game versions to download"],
        },
    },
};
