// SPDX-FileCopyrightText: 2026 Nathaniel "Hectate" Mitchell
//
// SPDX-License-Identifier: MIT
import { CommandModel } from "@renderer/shell/commandModel";

export const lobbyCommands: CommandModel = {
    help: ["Commands related to multiplayer online lobbies"],
    subcommands: {
        join: {
            help: ["Attempts to join the specified lobby"],
        },
        leave: {
            help: ["Leaves a lobby that the client is currently in"],
        },
        list: {
            help: ["Displays a list of multiplayer lobbies from the tachyon server"],
            flags: {},
        },
    },
};
