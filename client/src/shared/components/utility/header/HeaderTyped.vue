<!--
  - Copyright (c) 2023-2024 Josef Müller.
  -->

<template>
    <div>
        <h2 class="subheader">
            {{ smallText }}
        </h2>
        <h1 class="big-header">
            {{ bigText[0] }}
            <span v-if="bigText.length > 1" class="header-msg-highlight">{{ typedText }}</span>
        </h1>
    </div>
</template>

<script lang="ts" setup>
import { Ref, ref, toRefs, watch } from 'vue';

const props = defineProps({
    smallText: {
        type: String,
        required: false
    },
    bigText: {
        type: Array as () => string[],
        required: true
    },
    speed: {
        type: Number,
        required: false,
        default: 150
    }
});

const { bigText, speed } = toRefs(props);

const emit = defineEmits(['finish']);

const interval = ref<number>(-1);
const typedText = ref('');
const typedTextIndex = ref(0);

const typeText = (text: string, typedText: Ref<string>, typedTextIndex: Ref<number>): boolean => {
    if (text.length <= typedTextIndex.value) {
        return false;
    }
    typedText.value += text.charAt(typedTextIndex.value++);
    return true;
};

const startTyping = () => {
    if (interval.value !== -1) {
        clearInterval(interval.value);
    }
    typedText.value = '';
    typedTextIndex.value = 0;
    interval.value = setInterval(() => {
        if (!typeText(bigText.value[1] ?? '', typedText, typedTextIndex)) {
            emit('finish');
            clearInterval(interval.value);
        }
    }, speed.value);
};

watch(bigText, () => {
    startTyping();
    return () => {
        if (interval.value !== -1) {
            clearInterval(interval.value);
        }
    };
}, { immediate: true });
</script>

<style scoped>
.header-msg-highlight {
    color: var(--ion-color-primary);
    font-weight: var(--font-weight-bolder);
}

.big-header {
    font-size: var(--font-size-large);
    font-weight: var(--font-weight-bold);
    margin: 0 0 10px;
}
</style>
