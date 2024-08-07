<!--
  - Copyright (c) 2023-2024 Josef Müller.
  -->

<template>
    <IonPage>
        <IonContent :fullscreen="true">
            <div class="content-wrapper">
                <div class="content">
                    <div class="content-margin">
                        <Header
                            :big-text="$t('Favorites.Title').split(';')"
                            :small-text="
                                savedRecipes.length +
                                    ' ' +
                                    $t('General.Recipe', savedRecipes.length)
                            "
                        />
                    </div>

                    <div class="content-margin">
                        <template v-if="savedRecipes.length > 0">
                            <IonItem>
                                <IonButton @click="removeSavedRecipes"> Remove all</IonButton>
                            </IonItem>

                            <IonItem>
                                <h2 class="ion-text-center">Stats of saved recipes</h2>
                            </IonItem>
                            <IonItem>
                                <table>
                                    <tr>
                                        <th>Stats</th>
                                        <th>Value</th>
                                    </tr>
                                    <tr v-for="stat in stats" :key="stat.desc">
                                        <td>{{ stat.desc }}</td>
                                        <td>{{ stat.value }}</td>
                                    </tr>
                                </table>
                            </IonItem>

                            <List :list="savedRecipes" list-key="id">
                                <template #element="{ element }">
                                    <RecipePreview :recipe="element as Recipe"/>
                                </template>
                            </List>
                        </template>
                        <template v-else>
                            <TasteBuddyLogo size="small"/>
                            <h2 class="ion-text-center">
                                {{ $t("Favorites.NoRecipesSaved") }}
                            </h2>
                        </template>
                    </div>
                </div>
            </div>
            <FabTimer/>
        </IonContent>
    </IonPage>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { IonButton, IonContent, IonItem, IonPage } from '@ionic/vue';
import { useRecipeStore } from '@/app/storage';
import { Recipe } from '@/shared';
import RecipePreview from '@/app/components/recipe/previews/RecipePreview.vue';
import Header from '@/shared/components/utility/header/Header.vue';
import TasteBuddyLogo from '@/app/components/TasteBuddyLogo.vue';
import List from '@/shared/components/utility/list/List.vue';
import { average } from '@/app/search/util';
import { storeToRefs } from 'pinia';

const recipeStore = useRecipeStore();
const { savedRecipes, savedRecipeStats } = storeToRefs(recipeStore);

const stats = computed<
    {
        desc: string;
        value: string | number;
    }[]
>(() => {
    const formattedStats = [];
    formattedStats.push({
        desc: 'Average amount of ingredients',
        value: average(savedRecipeStats.value.numberOfIngredients),
    });
    // formattedStats.set('Amount Items', [...stats.itemsIds.values()].map((id: string) => items.value[id]))
    formattedStats.push({
        desc: 'Average amount of steps',
        value: average(savedRecipeStats.value.numberOfSteps),
    });
    formattedStats.push({
        desc: 'Average duration',
        value: `${average(savedRecipeStats.value.duration)} min.`,
    });
    return formattedStats;
});

const removeSavedRecipes = () => recipeStore.setSavedRecipes([]);
</script>

<style scoped>
/* Apply a modern font and some basic styling */
table {
    font-family: Arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 20px;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

/* Add some padding and styling to the table headers */
th,
td {
    padding: 12px 15px;
    text-align: left;
}

th {
    background-color: var(--ion-color-primary);
    font-weight: bold;
    border-bottom: 2px solid #ddd;
}

tr {
    transition: all 0.2s ease-in-out;
}

/* Add some hover effect for better interactivity */
tr:hover {
    background-color: var(--ion-color-medium);
}

/* Apply a border radius to the first and last child of the table body */
tbody tr:first-child td {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
}

tbody tr:last-child td {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
}

/* Apply a border to the bottom of the table body */
td {
    border-bottom: 1px solid #ddd;
}

/* Apply media query for responsiveness */
@media (max-width: 768px) {
    table {
        display: block;
        overflow-x: auto;
        white-space: nowrap;
    }

    th,
    td {
        min-width: 150px;
    }
}
</style>
