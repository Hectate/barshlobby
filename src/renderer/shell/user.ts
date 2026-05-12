// SPDX-FileCopyrightText: 2026 Nathaniel "Hectate" Mitchell
//
// SPDX-License-Identifier: MIT
import { commandModel } from "@renderer/shell/commandModel";

export const userCommands: commandModel = {
    help: ["Commands related to the current user"],
    subcommands: {
        auth: {
            help: ["Open authentication request with a Tachyon server"],
        },
        deauth: {
            help: ["Submit deauthentication to the connected Tachyon server"],
        },
        status: {
            help: ["Display current user status"],
            flags: {
                v: "verbose mode",
            },
        },
    },
};
