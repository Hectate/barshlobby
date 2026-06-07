// SPDX-FileCopyrightText: 2026 Nathaniel "Hectate" Mitchell
//
// SPDX-License-Identifier: MIT
import { CommandModel } from "@renderer/shell/commandModel";
import { shell } from "@renderer/store/shell.store";
import { outputError } from "@renderer/shell/error";
import { db } from "@renderer/store/db";

export const engineCommands: CommandModel = {
    help: ["Commands related to engine files"],
    subcommands: {
        download: {
            help: ["Attempt to download an engine to your current assets directory"],
        },
        list: {
            help: ["Displays a list of installed engines in the current assets directory", "This is limited to engines compatible with the currently selected game."],
            flags: {
                v: "verbose mode",
            },
        },
        select: {
            help: ["Assign the selected engine for use with offline battles."],
        },
    },
};
