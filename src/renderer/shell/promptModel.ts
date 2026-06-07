// SPDX-FileCopyrightText: 2026 Nathaniel "Hectate" Mitchell
//
// SPDX-License-Identifier: MIT

// Each key corresponds to a function that will be called if the user responds with that key (e.g. 'y')
// One element will always be default (e.g. user presses Enter on blank)
//

export type PromptModel = {
    default: string;
    prompts: { [key: string]: () => void };
};
