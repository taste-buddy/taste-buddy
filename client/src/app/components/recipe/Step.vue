<!--
  - Copyright (c) 2023-2024 Josef Müller.
  -->

<template>
    <div class="recipe-step-wrapper">
        <template v-if="step.type === STEP_TYPES.STEP">
            <h4 v-if="stepIndex >= 0" class="recipe-step-index">
                <span class="recipe-step-index-step"
                >{{ $t("Recipe.Step") }} {{ stepIndex + 1 }}</span
                >
                <span v-if="amountSteps > 0" class="recipe-step-index-max">
                    / {{ amountSteps }}</span
                >
            </h4>
        </template>
        <template v-else-if="step.type === STEP_TYPES.HEADER">
            <h4>
                <span v-html="step?.descriptionToHtml('item-highlight')"/>
            </h4>
        </template>
        <IonCard v-if="!noContent">
            <IonImg v-if="step?.imgUrl" :src="step.imgUrl"/>
            <IonCardContent>
                <Duration
                    :duration="step?.duration"
                    :timer-key="recipeId"
                />
                <Temperature :temperature="step?.temperature"/>
                <!-- <IonItem v-if="recipeItems.length > 0" lines="none">
                            <ItemList :items="recipeItems" horizontal quantity-position="start"/>
                        </IonItem> -->
                <!-- Show the description here of the step if it is not a header -->
                <IonItem
                    v-if="step.type !== STEP_TYPES.HEADER"
                    class="recipe-step-desc"
                    lines="none"
                >
                    <div v-html="step?.descriptionToHtml('item-highlight')"/>
                </IonItem>
            </IonCardContent>
        </IonCard>
    </div>
</template>

<script lang="ts" setup>
import { IonCard, IonCardContent, IonImg, IonItem } from '@ionic/vue';
import { PropType, toRefs } from 'vue';
import { RecipeStep, STEP_TYPES } from '@/shared';
import Temperature from '@/shared/components/recipe/chip/Temperature.vue';
import Duration from '@/shared/components/time/Duration.vue';

const props = defineProps({
    step: {
        type: Object as PropType<RecipeStep>,
        required: true,
    },
    stepIndex: {
        type: Number,
        required: false,
        default: -1,
    },
    amountSteps: {
        type: Number,
        required: false,
        default: -1,
    },
    recipeId: {
        type: String,
        required: false,
    },
    noContent: {
        type: Boolean,
        required: false,
        default: false,
    },
});

const { step, recipeId } = toRefs(props);
</script>

<style>
.item-highlight {
    font-weight: bold;
    color: var(--ion-color-primary);
}
</style>

<style scoped>
.recipe-step-index {
    font-size: var(--font-size-small);
    font-weight: var(--font-weight-bold);
}

.recipe-step-index-max {
    font-size: var(--font-size-smaller);
    font-weight: var(--font-weight-normal);
}

.recipe-step-desc {
    --background: none;
}
</style>
