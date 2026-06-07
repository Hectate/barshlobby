<!--
SPDX-FileCopyrightText: 2026 Nathaniel "Hectate" Mitchell

SPDX-License-Identifier: MIT
-->

<template>
    <div class="scroll-container">
        <span style="white-space: pre-wrap">{{ logo }}</span
        ><br />
        <div v-for="(item, index) in shellStore.history" :key="index">
            <span style="white-space: pre" :style="{ color: item.color.fgColor, 'background-color': item.color.bgColor }">{{
                item.message
            }}</span
            ><br />
        </div>
        <div class="flex-row" ref="shell-input">
            <div>
                <div v-for="item in shellStore.prompt" :key="item">
                    <span>{{ item }}</span>
                </div>
            </div>
            <div class="fullwidth">
                <input
                    v-model="command"
                    autofocus
                    type="text"
                    @keydown.enter="submitCommand"
                    @keydown.tab="autoComplete"
                    @input="onInputChange"
                    class="mark fullwidth"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch, useTemplateRef, onMounted } from "vue";
import { shellStore, shell } from "@renderer/store/shell.store";
import { infosStore } from "@renderer/store/infos.store";

const shellinput = useTemplateRef("shell-input");
const command = ref("");

// prettier-ignore
var logo =
` _______   ______  _______              __
|       \\ /      \\|       \\            |  \\
| ▓▓▓▓▓▓▓\\  ▓▓▓▓▓▓\\ ▓▓▓▓▓▓▓\\    _______| ▓▓____
| ▓▓__/ ▓▓ ▓▓__| ▓▓ ▓▓__| ▓▓   /       \\ ▓▓    \\
| ▓▓    ▓▓ ▓▓    ▓▓ ▓▓    ▓▓  |  ▓▓▓▓▓▓▓ ▓▓▓▓▓▓▓\\
| ▓▓▓▓▓▓▓\\ ▓▓▓▓▓▓▓▓ ▓▓▓▓▓▓▓\\   \\▓▓    \\| ▓▓  | ▓▓
| ▓▓__/ ▓▓ ▓▓  | ▓▓ ▓▓  | ▓▓__ _\\▓▓▓▓▓▓\\ ▓▓  | ▓▓
| ▓▓    ▓▓ ▓▓  | ▓▓ ▓▓  | ▓▓  \\       ▓▓ ▓▓  | ▓▓
 \\▓▓▓▓▓▓▓ \\▓▓   \\▓▓\\▓▓   \\▓▓\\▓▓\\▓▓▓▓▓▓▓ \\▓▓   \\▓▓`;

function submitCommand() {
    if (command.value.length === 0) return;
    shell.parseCommand(command.value);
    command.value = "";
}
function autoComplete() {
    console.log(`autocomplete submitted for ${command.value}`);
}
function onInputChange() {
    if (command.value.length > 0) {
        // This works but it's disabled until I decide how to display it.
        //shell.suggestCommand(command.value);
    }
}

watch(
    shellStore.history,
    () => {
        shellinput.value?.scrollIntoView(true);
    },
    { flush: "post" }
);

onMounted(() => {
    shell.output(`Welcome to BAR.sh Lobby version ${infosStore.lobby.version}. Type 'help' and press Enter to view available commands.`);
});
</script>

<style lang="scss" scoped>
.mark {
    border-bottom: 1px solid;
    border-color: white;
    background-color: darkslategray;
}
span {
    font-family: monospace;
}
</style>
