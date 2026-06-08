// SPDX-FileCopyrightText: 2026 Nathaniel "Hectate" Mitchell
//
// SPDX-License-Identifier: MIT
import { CommandModel } from "@renderer/shell/commandModel";
import { outputError } from "@renderer/shell/error";
import { battleActions } from "@renderer/store/battle.store";
import { mapsStore } from "@renderer/store/maps.store";
import { db } from "@renderer/store/db";
import { battleStore } from "@renderer/store/battle.store";

export const battleCommands: CommandModel = {
    help: ["Commands related to offline gameplay"],
    subcommands: {
        start: {
            help: ["Attempts to launch the currently defined battle"],
        },
        teams: {
            help: ["Set the allyteam configuration"],
        },
        quick: {
            help: ["Immediately launches a random battle."],
            function: onQuickBattle,
        },
    },
};

async function onQuickBattle() {
    try {
        const mapName = mapsStore.availableMapNames.values().next().value;
        const map = await db.maps.get(mapName!);
        console.log(mapName);
        battleActions.resetToDefaultBattle(undefined, undefined, map, false);
        battleStore.battleOptions.map = map;
        battleActions.startBattle();
    } catch (error) {
        outputError(String(error));
    }
}
