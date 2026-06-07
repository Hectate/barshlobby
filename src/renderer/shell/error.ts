// SPDX-FileCopyrightText: 2025 Nathaniel "Hectate" Mitchell
//
// SPDX-License-Identifier: MIT

// Error/Warning responses for shell printing
// This is separated out so we can format consistently.

import { shell } from "@renderer/store/shell.store";

export function outputError(value: string): void {
    shell.output(["------ERROR------", value, "-----------------"], { level: "error" });
}
