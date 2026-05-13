// SPDX-FileCopyrightText: 2026 Nathaniel "Hectate" Mitchell
//
// SPDX-License-Identifier: MIT
import { commandModel } from "@renderer/shell/commandModel";
import { outputError } from "@renderer/shell/error";
import { chatStore, chat } from "@renderer/store/chat.store";
import { lobbyStore } from "@renderer/store/lobby.store";
import { shell, shellStore } from "@renderer/store/shell.store";
import { me } from "@renderer/store/me.store";
import { Message } from "@renderer/model/message";

export const chatCommands: commandModel = {
    help: ["Commands related to chat messaging"],
    function: unknownCommand,
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
        list: {
            help: [
                "Prints the chat history for a given channel.",
                "If no arguments are provided, the output will be the most recent channel where a message was received.",
                "Quantity is the max number of chat messages to show.",
                "Usage   | chat.list [flags] [userID] [quantity]",
                "Example | chat.list -l 10",
                "Example | chat.list -u 10 123",
            ],
            function: listCommand,
            flags: {
                l: "Output lobby chat messages",
                p: "Output party chat messages",
                u: "Output user chat messages (requires user ID)",
                v: "Verbose Mode",
            },
        },
    },
};
function unknownCommand(args: string[]) {
    shell.parseCommand("help chat (auto-alias)");
}

function sendCommand(args: string[]) {
    const flags = {
        l: false,
        p: false,
        u: false,
    };
    //default behavior
    if (args.length === 1 || args[1][0] !== "-") {
        shell.parseCommand("help chat.send (auto-aliased)");
        return;
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
    if (args.length === 1) {
        shell.parseCommand("help chat.reply (auto-alias)");
        return;
    }
    if (shellStore.lastChannel.type === undefined) {
        outputError("No available channels to send reply to. (see 'help chat.reply')");
    }
    const payload = args.slice(1).join(" ");
    if (shellStore.lastChannel.type === "lobby") {
        shell.parseCommand(`chat.send -l ${payload}`);
    }
    if (shellStore.lastChannel.type === "party") {
        shell.parseCommand(`chat.send -p ${payload}`);
    }
    if (shellStore.lastChannel.type === "player") {
        shell.parseCommand(`chat.send -u ${shellStore.lastChannel.userId} ${payload}`);
    }
}

function listCommand(args: string[]) {
    if (args[1] === "-v") {
        outputError("You need to include a source flag; l, p, or u. (see 'help chat.list')");
        return;
    }
    const flags = {
        l: false,
        p: false,
        u: false,
        v: false,
        user: <string | undefined>undefined,
    };
    let count: number = 10;
    if (args[1] && args[1][0] === "-") {
        for (const char of args[1]) {
            if (char in flags) flags[char] = true;
        }
    }
    //default behavior for no flags given
    if (args.length === 1 || args[1][0] !== "-") {
        if (shellStore.lastChannel.type === "lobby") {
            flags.l = true;
        } else if (shellStore.lastChannel.type === "party") {
            flags.p = true;
        } else if (shellStore.lastChannel.type === "player") {
            flags.u = true;
            flags.user = shellStore.lastChannel.userId;
        } else {
            //No prior messages.
            outputError("No recent channel to list messages from. (see 'help chat.list')");
            return;
        }
    }
    if (Number(flags.l) + Number(flags.p) + Number(flags.u) !== 1) {
        outputError("Exactly one flag of l, p, or u must be provided for chat.list commands.");
        return;
    }
    const arr: Message[] = [];
    if (flags.l) {
        if (args[2]) count = Number(args[2]);
        arr.push(...chatStore.lobbyChat.slice(-count));
    }
    if (flags.p) {
        if (args[2]) count = Number(args[2]);
        arr.push(...chatStore.partyChat.slice(-count));
    }
    if (flags.u) {
        if (flags.user == undefined && args[2]) flags.user = args[2];
        if (args[3]) count = Number(args[3]);
        else if (args[1] === "-v") count = Number(args[2]);
        if (chatStore.userChats.has(flags.user!)) {
            arr.push(...chatStore.userChats.get(flags.user!)!.slice(-count));
        }
    }
    shell.output([`Last ${count} messages from ${flags.l ? "lobby" : ""}${flags.p ? "party" : ""}${flags.u ? "userID " : ""}${flags.u ? flags.user : ""}`]);
    for (const msg of arr) {
        shell.output([`* User ${msg.source.userId}${flags.v ? "@" + msg.timestamp.toString() : ""}: ${msg.message}`]);
    }
}
