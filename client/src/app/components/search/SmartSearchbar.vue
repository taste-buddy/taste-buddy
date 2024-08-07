<!--
  - Copyright (c) 2024 Josef Müller.
  -->

<template>
    <div :class="['searchbar-wrapper', { 'active': isResultsOpen || isSearchFocus }]">
        <div ref="searchbar">
            <div class="searchbar-blur"/>
            <SearchInput
                v-model:focus="isSearchFocus"
                v-model:input="fullQuery"
                @onClose="closeAll"
                @onFocus="openSearch"
                @search="search"
                @keydown.down="down"/>
            <Transition name="fade-top">
                <div v-if="(fullQuery !== '' && isSearchFocus) || isResultsOpen" class="searchbar-list-wrapper">
                    <div v-if="filteredResults.length > 0" class="searchbar-list">
                        <List :list="[...filteredResults]" load-all no-wrap>
                            <template #element="{ element }: { element: FilteredResult}">
                                <IonItem v-if="element.type === 'recipe'" button
                                         @click="selectRecipe(element.value as Recipe)">
                                    <IonIcon slot="start" :icon="searchOutline"/>
                                    <IonLabel>{{ (element.value as Recipe).getName() }}</IonLabel>
                                </IonItem>
                                <IonItem v-else-if="element.type === 'ingredient'"
                                         button @click="selectIngredient(element.value as Ingredient)">
                                    <IonIcon slot="start" :icon="searchOutline"/>
                                    <IonLabel>{{ (element.value as Ingredient).getName() }}</IonLabel>
                                </IonItem>
                                <IonItem v-else-if="element.type === 'tag'" button
                                         @click="selectTag(element.value as string)">
                                    <IonIcon slot="start" :icon="searchOutline"/>
                                    <IonLabel>{{ element.value }}</IonLabel>
                                </IonItem>
                            </template>
                        </List>
                    </div>
                </div>
            </Transition>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, Transition, watch } from 'vue';
import { IonIcon, IonItem, IonLabel, useIonRouter } from '@ionic/vue';
import { searchOutline } from 'ionicons/icons';
import { Ingredient, List, Recipe } from '@/shared';
import { searchRecipesByQuery } from '@/app/search/search.ts';
import { useRecipeStore } from '@/app/storage';
import { onClickOutside } from '@vueuse/core';
import { RecipeSuggestion } from '@/app/search';
import { storeToRefs } from 'pinia';
import SearchInput from '@/app/components/search/SearchInput.vue';

const recipeStore = useRecipeStore();
const { recipes, ingredients, tags } = storeToRefs(recipeStore);

const isSearchFocus = defineModel('focus', {
    type: Boolean,
    required: true,
});

const emit = defineEmits({
    'search': (value: RecipeSuggestion[]) => value,
    'down': () => true,
});

const down = () => emit('down');

const SEARCHBAR_CONFIG = {
    MAX_ITEMS: 3,
    MAX_TAGS: 3,
    MAX_RECIPES: 3,
    MIN_SAVED_RECIPES: 3,
    MAX_TIME: 60,
    MIN_TIME: 10,
    STEP_TIME: 10,
};

const searchbar = ref(null);
const searchbarInput = ref(null);
const isResultsOpen = ref(false);

const openSearch = () => {
    isSearchFocus.value = true;
};

const closePreferences = () => isSearchFocus.value = false;
const openAll = () => {
    isSearchFocus.value = true;
    isResultsOpen.value = true;
    searchbarInput.value?.focus();
};

const closeAll = () => {
    closePreferences();
    isResultsOpen.value = false;
};

watch(isSearchFocus, (newValue, oldValue) => {
    if (newValue !== oldValue) {
        if (newValue) {
            openAll();
        } else {
            closeAll();
        }
    }
});

onClickOutside(searchbar, () => {
    closeAll();
})

interface FilteredResult {
    type: 'recipe' | 'ingredient' | 'tag';
    value: Recipe | Ingredient | string;
}

const filteredResults = ref<FilteredResult[]>([]);
const filter = (query: string) => {
    if (query === '') {
        return filteredResults.value = [];
    }

    return filteredResults.value = [
        ...recipes.value
            .filter(recipe => recipe.hasName(query))
            .slice(0, SEARCHBAR_CONFIG.MAX_RECIPES)
            .map(recipe => ({
                type: 'recipe',
                value: recipe
            })) as FilteredResult[],
        ...ingredients.value
            .filter(ingredient => ingredient.hasName(query))
            .slice(0, SEARCHBAR_CONFIG.MAX_ITEMS)
            .map(ingredient => ({
                type: 'ingredient',
                value: ingredient
            })) as FilteredResult[],
        ...tags.value
            .filter(tag => tag.toLowerCase().includes(query.toLowerCase()))
            .slice(0, SEARCHBAR_CONFIG.MAX_TAGS)
            .map(tag => ({
                type: 'tag',
                value: tag
            })) as FilteredResult[],
    ]
}

const fullQuery = ref('');
watch(fullQuery, () => {
    filter(fullQuery.value);
    isResultsOpen.value = fullQuery.value !== '';
}, { immediate: true });

const router = useIonRouter()
const selectRecipe = (recipe: Recipe) => {
    router.push(recipe.getRoute());
    closeAll();
}
const selectIngredient = (ingredient: Ingredient) => {
    fullQuery.value = `${ingredient.getName()}`;
};
const selectTag = (tag: string) => {
    fullQuery.value = `${tag}`;
}

const searchedRecipes = ref<RecipeSuggestion[]>([]);
const search = async () => {
    searchedRecipes.value = await searchRecipesByQuery(fullQuery.value);
    closeAll();
    emit('search', searchedRecipes.value);
};
</script>

<style scoped>
.searchbar-wrapper {
    width: 100%;
    height: 100%;
    transition: var(--transition);
}

.searchbar-wrapper.active {
    z-index: 100;
    top: 0;
}

@media (max-width: 768px) {
    .searchbar-wrapper.active {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        padding: var(--margin-page);
        background-color: var(--ion-background-color);
    }
}

.searchbar-blur {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    backdrop-filter: blur(15px);
    mask-image: linear-gradient(180deg, #fff 50%, #0000 90%);
    -webkit-backdrop-filter: blur(15px);
    padding: 10px;
}


.searchbar-search-wrapper.active .searchbar-search {
    cursor: text;
}

@media (max-width: 768px) {
    .searchbar-search::placeholder, .searchbar-search::-webkit-input-placeholder {
        font-size: var(--font-size-smaller);
    }
}

input[type='number'] {
    -moz-appearance: textfield;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.searchbar-list-wrapper {
    position: absolute;
    left: 0;
    z-index: 110;
    width: 100%;
}

.searchbar-list {
    width: 100%;
    max-width: var(--max-width);
    margin: var(--margin-auto);
    max-height: 90vh;
    overflow-y: scroll;
    padding: var(--padding-small);
    background: var(--ion-background-color);
    border-radius: var(--border-radius-strong);
    box-shadow: var(--box-shadow-strong);
}

@media (max-width: 768px) {
    .searchbar-list {
        box-shadow: none;
    }
}
</style>
