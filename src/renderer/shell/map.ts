// SPDX-FileCopyrightText: 2026 Nathaniel "Hectate" Mitchell
//
// SPDX-License-Identifier: MIT
import { CommandModel } from "@renderer/shell/commandModel";
import { shell } from "@renderer/store/shell.store";
import { downloadMap, getRandomMap, mapsStore } from "@renderer/store/maps.store";
import { db } from "@renderer/store/db";
import { MapData } from "@main/content/maps/map-data";

export const mapCommands: CommandModel = {
    help: ["Commands related to map files"],
    subcommands: {
        download: {
            help: [
                "Download a map to your assets directory",
                "Note that the map name must be exactly correct.",
                "It is recommended to use map.list or map.search to find valid map names.",
                "You can then use the indexed vars to identify the desired map name.",
                "Usage   | map.download [map springName]",
                "Example | map.download AcidicQuarry 5.17",
            ],
            function: downloadCommand,
        },
        list: {
            help: [
                "Generate a random list of known maps",
                "Indexed vars will be created containing the 'SpringName' value for each listed map.",
                "By default, 10 maps are shown, however changing the count value will modify that behavior.",
                "Usage   | map.list [flags] [count]",
                "Example | map.list -d 12",
            ],
            flags: {
                v: "Verbose mode",
                d: "Display only maps already downloaded",
            },
            function: listCommand,
        },
        search: {
            help: [
                "Search for a list of available maps.",
                "There are a number of different flags to filter the results.",
                "The flags will determine what features are selected for inclusion in the results.",
                "The search string will filter the results down to maps with the string in the name.",
                "Note that some of the flag combinations are likely to result in no results.",
                "Usage   | map.search [flags] [search string]",
                "Example | map.search -v island",
            ],
            flags: {
                v: "Verbose mode",
                w: "Include only maps with water",
                d: "Include only maps with deserts",
                s: "Include only maps with space",
            },
            function: searchCommand,
        },
        display: {
            help: ["Displays more information about a specific map"],
            flags: {
                i: "Display the image map",
                h: "Display the height map",
                m: "Display the metal map",
                v: "Verbose mode",
            },
            function: displayCommand,
        },
    },
};

async function downloadCommand(args: string[]) {
    const payload = args.slice(1).join(" ");
    await downloadMap(payload);
}

async function listCommand(args: string[]) {
    const flags = {
        v: false,
        d: false,
    };
    let count = 10;
    if (args.length === 1 || args[1][0] !== "-") {
        if (args[1]) {
            count = isNaN(Number(args[1])) ? 10 : Number(args[1]);
        }
    } else if (args[1][0] === "-") {
        for (const char of args[1]) {
            if (char in flags) flags[char] = true;
        }
        if (args[2]) {
            count = isNaN(Number(args[2])) ? 10 : Number(args[2]);
        }
    }
    const mapArr: (MapData | undefined)[] = [];
    if (flags.d) {
        const arr: string[] = [];
        for (let i = 0; i < count; i++) {
            const mapName = [...mapsStore.availableMapNames][Math.floor(Math.random() * mapsStore.availableMapNames.size)];
            //TODO: This could result in fewer than "count" maps if the same one is picked multiple times.
            if (!arr.includes(mapName)) {
                arr.push(mapName);
            }
        }
        mapArr.push(...(await db.maps.bulkGet(arr)));
    } else {
        for (let i = 0; i < count; i++) {
            const map = await getRandomMap();
            mapArr.push(map);
        }
    }
    const mapData = mapArr.filter((m) => m !== undefined);
    shell.clearIndices();
    shell.output([`Displaying ${count} random maps.`, `Index | Installed | Display Name | Spring Name | Max Player Count`], { level: "info" });
    mapData.forEach((map, index) => {
        shell.addIndex(index.toString(), map.springName);
        shell.output(`#${index} | ${map.isInstalled} | ${map.displayName} (${map.springName}) ${map.playerCountMax}`);
        if (flags.v) {
            shell.output([
                `╠ Author: ${map.author} | Filename: ${map.filename} | Terrain: ${map.terrain} | Wind Min/Max: ${map.windMin}/${map.windMax} | Tidal Strength: ${map.tidalStrength}`,
                `╠ Description: ${map.description}`,
                `╚═════────── · · · ·`,
            ]);
        }
    });
}

function searchCommand(args: string[]) {}

function displayCommand(args: string[]) {}
