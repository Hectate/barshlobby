// SPDX-FileCopyrightText: 2026 Nathaniel "Hectate" Mitchell
//
// SPDX-License-Identifier: MIT
import { commandModel } from "@renderer/shell/commandModel";
import { shell } from "@renderer/store/shell.store";
import { me, auth } from "@renderer/store/me.store";
import { tachyon } from "@renderer/store/tachyon.store";
import { outputError } from "@renderer/shell/error";

export const userCommands: commandModel = {
    help: [
        "Commands related to the current user",
        "Note that the connection flow to the Tachyon server is user.auth and then user.login after authentication",
        "If your authentication tokens are still valid, you should be able to just user.login directly.",
    ],
    function: unknownCommand,
    subcommands: {
        auth: {
            help: ["Open authentication request with a Tachyon server", "If necessary, this will open the server login page in your web browser."],
            function: authCommand,
        },
        deauth: {
            help: ["Submit deauthentication to the connected Tachyon server"],
            function: deauthCommand,
        },
        login: {
            help: ["Submit a login request to the Tachyon server.", "Remember to auth first."],
            function: loginCommand,
        },
        status: {
            help: ["Display current user status"],
            function: statusCommand,
            flags: {
                v: "Verbose mode",
            },
        },
    },
};

function unknownCommand(args: string[]) {
    shell.parseCommand("help user (auto-alias)", true);
}
async function authCommand(args: string[]) {
    shell.output([`Attempting login to Tachyon server`]);
    await auth.login();
}
async function deauthCommand(args: string[]) {
    shell.output([`Logging out from Tachyon server`]);
    await auth.logout();
}
function statusCommand(args: string[]) {
    const arr: string[] = [];
    arr.push(...[`User Status:`, `Display Name: ${me.displayName}`, `User ID: ${me.userId}`, `Status: ${me.status}`]);
    if (args[1]?.toLowerCase() === "-v") {
        arr.push(...[`Clan ID: ${me.clanId}`, `Party ID: ${me.partyId}`, `Is Authenticated: ${me.isAuthenticated}`]);
    }
    shell.output(arr, { level: "info" });
}

async function loginCommand(args: string[]) {
    try {
        await auth.login();
        await tachyon.connect();
    } catch (e) {
        console.error(e);
        outputError((e as Error).message);
    } finally {
        // Removes the stutter when transitioning to the next page
        // setTimeout(() => {
        //     connecting.value = false;
        // }, 1000);
    }
}
