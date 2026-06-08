// SPDX-FileCopyrightText: 2026 Nathaniel "Hectate" Mitchell
//
// SPDX-License-Identifier: MIT

export const shellColors: { [k: string]: ShellColor } = {
    WHITE: { bgColor: "#000", fgColor: "#FFF" },
    RED: { bgColor: "#000", fgColor: "rgb(255, 105, 105)" },
    YELLOW: { bgColor: "#000", fgColor: "rgb(255, 255, 107)" },
    BLUE: { bgColor: "#000", fgColor: "rgb(134, 134, 255)" },
    GREEN: { bgColor: "#000", fgColor: "rgb(104, 255, 104)" },
    INVERT: { bgColor: "#FFF", fgColor: "#000" },
    HIGHLIGHT: { bgColor: "#525252", fgColor: "#FFF" },
};

export type ShellColor = {
    bgColor: string;
    fgColor: string;
};
