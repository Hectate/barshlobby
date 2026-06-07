<!--
SPDX-FileCopyrightText: 2025 The BAR Lobby Authors

SPDX-License-Identifier: MIT
-->

<template>
    <div v-if="settingsStore.isInitialized" id="wrapper" class="flex-col flex-grow fullheight">
        <Transition>
            <InitialSetup v-if="state === 'initial-setup'" @complete="onInitialSetupDone" />
            <Terminal v-else></Terminal>
        </Transition>
    </div>
</template>

<script lang="ts" setup>
import { ref, Ref } from "vue";
import { settingsStore } from "./store/settings.store";
import InitialSetup from "@renderer/components/misc/InitialSetup.vue";
import Terminal from "@renderer/shell/Terminal.vue";

const state: Ref<"initial-setup" | "default"> = ref("initial-setup");

function onInitialSetupDone() {
    state.value = "default";
}
</script>

<style lang="scss" scoped>
.wrapper {
    overflow: hidden;
}
</style>
