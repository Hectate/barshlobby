// SPDX-FileCopyrightText: 2026 Nathaniel "Hectate" Mitchell
//
// SPDX-License-Identifier: MIT
import { commandModel } from "@renderer/shell/commandModel";

export const mapCommands: commandModel = {
    help: ["Commands related to map files"],
    subcommands: {
        download: {
            help: ["Attempts to download a map to your assets directory"],
        },
        list: {
            help: ["Generate a list of known maps"],
            flags: {
                v: "Verbose mode",
                d: "Display only maps already downloaded",
            },
        },
        display: {
            help: ["Displays information about a specific map"],
            flags: {
                i: "Display the image map",
                h: "Display the height map",
                m: "Display the metal map",
                v: "Verbose mode",
            },
        },
    },
};
