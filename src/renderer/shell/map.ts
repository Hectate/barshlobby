// SPDX-FileCopyrightText: 2026 Nathaniel "Hectate" Mitchell
//
// SPDX-License-Identifier: MIT
import { CommandModel } from "@renderer/shell/commandModel";
import { db } from "@renderer/store/db";
import { downloadMap } from "@renderer/store/maps.store";

export const mapCommands: CommandModel = {
    help: ["Commands related to map files"],
    subcommands: {
        download: {
            help: ["Attempts to download a map to your assets directory"],
            function: downloadMapCommand,
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

async function downloadMapCommand(args: string[]) {
    const payload = args.slice(1).join(" ");
    await downloadMap(payload);
}
