// SPDX-FileCopyrightText: 2026 Nathaniel "Hectate" Mitchell
//
// SPDX-License-Identifier: MIT

export type commandModel = {
    help: string[]; //Primary command group help strings
    function?: (args: string[]) => void; //Top level function, frequently help messages trigger
    subcommands?: {
        //subcommand names are the keys below
        [key: string]: {
            help: string[]; //Subcommand help strings
            function?: (args: string[]) => void; //Function for subcommand execution
            flags?: {
                [key: string]: string; //Flags are the keys, the values are their descriptive help text.
            };
        };
    };
};
