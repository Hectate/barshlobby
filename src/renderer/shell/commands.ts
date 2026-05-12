// SPDX-FileCopyrightText: 2026 Nathaniel "Hectate" Mitchell
//
// SPDX-License-Identifier: MIT

import { quitCommands } from "@renderer/shell/quit";
import { userCommands } from "@renderer/shell/user";
import { settingsCommands } from "@renderer/shell/settings";
import { engineCommands } from "@renderer/shell/engine";
import { gameCommands } from "@renderer/shell/game";
import { mapCommands } from "@renderer/shell/map";
import { battleCommands } from "@renderer/shell/battle";
import { lobbyCommands } from "@renderer/shell/lobby";
import { chatCommands } from "@renderer/shell/chat";

export const commands = {
    help: [
        "Barsh is a client for Beyond All Reason (BAR). It is designed to act like a OS shell (SH) environment, without a GUI.",
        'Below is a list of commands that can be used to control barsh. You can get more information about with "help [command]" and "help [command].[subcommand]',
        'Command syntax is "[command].[subcommand] -[flags] [arguments]". For example, "settings.server -a your.tachyon.server"',
        'Also available are "vars" that can be used as variables in commands, you may type "help vars" to get more information about them.',
    ],
    quit: quitCommands,
    user: userCommands,
    settings: settingsCommands,
    engine: engineCommands,
    game: gameCommands,
    map: mapCommands,
    battle: battleCommands,
    lobby: lobbyCommands,
    chat: chatCommands,
};
