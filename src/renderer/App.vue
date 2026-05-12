<!--
SPDX-FileCopyrightText: 2025 The BAR Lobby Authors

SPDX-License-Identifier: MIT
-->

<template>
    <div v-if="settingsStore.isInitialized" id="wrapper" class="flex-col flex-grow fullheight">
        <div class="scroll-container">
            <span style="white-space: pre">{{ logo }}</span
            ><br />
            <div v-for="(item, index) in shellStore.history" :key="index">
                <span style="white-space: pre">{{ item }}</span
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
    </div>
</template>

<script lang="ts" setup>
import { ref, watch, useTemplateRef, onMounted } from "vue";
import { settingsStore } from "./store/settings.store";
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
    console.log(command.value);
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
    shellStore.history.push(
        `Welcome to BAR.sh Lobby version ${infosStore.lobby.version}. Type 'help' and press Enter to view available commands.`
    );
});
</script>

<style lang="scss" scoped>
.view-container {
    flex: auto;
    transition: transform 0.4s ease-out;
    &.translated-right {
        transform: translateX(10%);
    }
}

.wrapper {
    overflow: hidden;
}
.mark {
    border-bottom: 1px solid;
    border-color: white;
    background-color: darkslategray;
}
span {
    font-family: monospace;
}
</style>
