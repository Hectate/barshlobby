// SPDX-FileCopyrightText: 2026 Nathaniel "Hectate" Mitchell
//
// SPDX-License-Identifier: MIT
import { commandModel } from "@renderer/shell/commandModel";
import { outputError } from "@renderer/shell/error";
import { chatStore, chat } from "@renderer/store/chat.store";
import { lobbyStore } from "@renderer/store/lobby.store";
import { shell } from "@renderer/store/shell.store";
import { me } from "@renderer/store/me.store";

export const chatCommands: commandModel = {
    help: ["Commands related to chat messaging"],
    subcommands: {
        send: {
            help: [
                "Sends a chat message to the destination",
                "There are 3 possible destinations; a user, a lobby, or a party.",
                "If you are not in a party or lobby, those types will fail if you send to them.",
                "Usage   | chat.send [flags] [userID] [message]",
                "Example | chat.send -l Can we enable Legion?",
                "Example | chat.send -u 123 Do you have time for 1v1?",
            ],
            function: sendCommand,
            flags: {
                l: "Send to Lobby",
                p: "Send to Party",
                u: "Send to User",
            },
        },
        reply: {
            help: [
                "Sends a message to the most recently active channel",
                "Uses whatever chat channel (direct message, lobby, party) you last received a message at from the server.",
                "Note that this is also aliased as just 're' so you do not have to use 'chat.reply' every time.",
                "Usage   | chat.reply [message]",
                "Example | chat.reply But I don't want to play Glitters!",
            ],
            function: replyCommand,
        },
    },
};

function sendCommand(args: string[]) {
    const flags = {
        l: false,
        p: false,
        u: false,
    };
    //default behavior
    if (args.length === 1 || args[1][0] !== "-") {
        shell.parseCommand("help chat.send (auto-aliased)");
    } else if (args[1][0] === "-") {
        for (const char of args[1]) {
            if (char in flags) flags[char] = true;
        }
    }
    if (Number(flags.l) + Number(flags.p) + Number(flags.u) !== 1) {
        outputError("Exactly one flag must be provided for chat.send commands.");
        return;
    }
    if (flags.l) {
        if (!lobbyStore.activeLobby) {
            outputError("You are not in a lobby.");
        } else {
            const payload = args.slice(2).join(" ");
            chat.requestSend({ target: { type: "lobby" }, message: payload });
        }
    }
    if (flags.p) {
        if (!me.partyId) {
            outputError("You are not in a party.");
        } else {
            const payload = args.slice(2).join(" ");
            chat.requestSend({ target: { type: "party" }, message: payload });
        }
    }
    if (flags.u) {
        const user = args[2];
        const payload = args.slice(3).join(" ");
        chat.requestSend({ target: { type: "player", userId: user }, message: payload });
    }
}

function replyCommand(args: string[]) {
    shell.output(["This will be implemented once I start taking note of which channel last hit."]);
}
