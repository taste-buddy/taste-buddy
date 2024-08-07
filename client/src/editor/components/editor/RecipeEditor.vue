<!--
  - Copyright (c) 2023-2024 Josef Müller.
  -->

<template>
    <IonCard>
        <div class="recipe-image-wrapper">
            <IonImg :src="recipe?.props?.imgUrl" alt="Header Image" class="recipe-image"/>
        </div>
        <IonCardHeader>
            <IonCardTitle>Edit general information</IonCardTitle>

            <IonGrid class="w100">
                <IonRow>
                    <IonCol size="12" size-md="6">
                        <IonRow>
                            <IonInput :maxlength="100" :value="mutableRecipe.getName()" color="primary"
                                      label="Recipe name"
                                      label-placement="stacked" type="text"
                                      @focusout.capture="mutableRecipe.setName($event.target.value ?? '')"/>
                            <IonInput v-model="mutableRecipe.props.imgUrl" label="Image URL"
                                      label-placement="stacked" type="url"/>
                        </IonRow>
                        <IonRow>
                            <!-- <IonChip v-if="mutableRecipe.props.date">
                                <IonIcon :icon="calendar"/>
                                <IonLabel>{{ formatDate(mutableRecipe.props.date) }}</IonLabel>
                            </IonChip> -->
                            <Duration :duration="mutableRecipe.getDuration()" always-show/>
                        </IonRow>
                    </IonCol>
                    <IonCol size="12" size-md="6">
                        <!-- Add tag to the list -->
                        <DropDownSearch :items="allTags" :reset-after="true" label="Tag" placeholder="e.g. vegan"
                                        @select-item="mutableRecipe.addTag($event)">
                            <template #item="{ filteredItem }">
                                <IonChip class="tag">
                                    <IonLabel>{{ filteredItem }}</IonLabel>
                                </IonChip>
                            </template>
                        </DropDownSearch>

                        <IonChip v-for="(tag, tagIndex) in mutableRecipe.getTags()" :key="tagIndex">
                            <IonLabel>{{ tag }}</IonLabel>
                            <IonIcon :icon="closeCircleOutline"
                                     @click="(mutableRecipe.props?.tags ?? []).splice(tagIndex, 1)"/>
                        </IonChip>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonCardHeader>

        <IonCardContent>
            <IonTextarea :counter="true"
                         :rows="4"
                         :spellcheck="true" :value="mutableRecipe.getDescription()"
                         label="Description"
                         label-placement="stacked"
                         placeholder="e.g. The best recipe in Germany" wrap="soft"
                         @keyup.enter="mutableRecipe.setDescription($event.target.value ?? '')"
                         @ion-blur="mutableRecipe.setDescription($event.target.value ?? '')"/>
            <IonInput label="Add author" label-placement="stacked"
                      placeholder="e.g. John Doe"
                      type="text"
                      @keydown.enter="mutableRecipe.addAuthor($event.target.value)"/>
            <IonChip v-for="(author, authorIndex) in (mutableRecipe.src.authors ?? [])"
                     :key="authorIndex"
                     class="recipe-author">
                <IonLabel>{{ author.name }}</IonLabel>
                <IonIcon :icon="closeCircleOutline"
                         @click="(mutableRecipe.src.authors ?? []).splice(authorIndex, 1)"/>
            </IonChip>
            <IonInput v-model="mutableRecipe.src.url" label="Source URL"
                      label-placement="stacked" type="url"/>
            <!-- <ItemList :horizontal="true" :items="mutableRecipe.getRecipeIngredients()"/> -->
        </IonCardContent>
    </IonCard>

    <IonCard>
        <IonCardHeader>
            <IonCardTitle>Add Items</IonCardTitle>
        </IonCardHeader>

        <IonCardContent>
            <template v-if="itemToEdit">
                <IonChip color="medium">{{ itemToEdit.getId() }}</IonChip>
                <div class="item-edit">
                    <IonInput :value="itemToEdit.ingredient.getName()" class="item-attribute"
                              label="Item Name" label-placement="stacked" placeholder="e.g., Tomatoes" type="text"
                              @focusin="updateName($event.target.value)"
                              @focusout="updateName($event.target.value)"
                              @keydown.enter="updateName($event.target.value)"/>
                    <IonInput v-model="itemToEdit.quantity" class="item-attribute" label="Quantity"
                              label-placement="stacked"
                              placeholder="e.g., 2"
                              type="number"/>
                    <IonInput v-model="itemToEdit.unit" class="item-attribute" label="Unit" label-placement="stacked"
                              placeholder="e.g., kg"
                              type="text"/>
                </div>
            </template>

            <IonList>
                <IngredientComponent
                    v-for="(recipeItem, itemIndex) in (Array.from<RecipeIngredient>(recipe?.ingredients) ?? [])"
                    :key="`${itemIndex} - ${recipeItem.getId()}` ?? ''" :ingredient="recipeItem"
                    quantity-position="start" @click="editItem(recipeItem)"/>
            </IonList>
        </IonCardContent>
        <IonButton color="success" fill="outline" shape="round" size="small"
                   @click="addItemToRecipe">
            <IonIcon slot="start" :icon="add"/>
            Add Item
        </IonButton>
    </IonCard>

    <!-- Steps -->
    <div class="w100 center">
        <IonButton color="success" fill="outline" shape="round" size="small" @click="addStep(-1)">
            <IonIcon slot="start" :icon="add"/>
            Add Step
        </IonButton>
    </div>
    <template v-for="(step, stepIndex) in mutableRecipe.steps" :key="stepIndex">
        <IonCard class="step-editor">
            <IonCardHeader>
                <IonCardTitle>
                    Step {{ stepIndex + 1 }}
                </IonCardTitle>
            </IonCardHeader>

            <IonButton color="danger" fill="outline" shape="round" size="small" @click="removeStep(stepIndex)">
                <IonIcon slot="start" :icon="remove"/>
                Remove Step
            </IonButton>

            <IonCardContent>
                <IonTextarea :counter="true"
                             :spellcheck="true" :value="step.getDescription()"
                             label="Description"
                             label-placement="stacked"
                             placeholder="e.g. Mix the ingredients together" wrap="soft"
                             @keyup.enter="step.setDescription($event.target.value ?? '')"
                             @ion-blur="step.setDescription($event.target.value ?? '')"/>

                <IonGrid>
                    <IonRow>
                        <IonCol size="3">
                            <IonInput v-model.number="step.duration" inputmode="numeric"
                                      label="Preparation time (minutes)"
                                      label-placement="stacked"
                                      max="2400" min="1" type="number"/>

                        </IonCol>
                        <IonCol size="3">
                            <IonInput v-model.number="step.temperature" inputmode="numeric" label="Temperature (°C)"
                                      label-placement="stacked"
                                      max="1000" min="-50" type="number"/>

                        </IonCol>
                        <IonCol size="6">
                            <IonInput v-model.trim="step.imgUrl" :placeholder="`e.g. https://source.unsplash.com/`"
                                      label="Image URL"
                                      label-placement="stacked" type="url"/>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonCardContent>
        </IonCard>

        <!-- Steps -->
        <div class="w100 center">
            <IonButton color="success" fill="outline" shape="round" size="small" @click="addStep(stepIndex)">
                <IonIcon slot="start" :icon="add"/>
                Add Step
            </IonButton>
        </div>
    </template>

    <!-- JSON Textarea -->
    <IonCard v-show="showJSON">
        <IonCardHeader>
            <IonCardTitle>JSON</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
            <IonTextarea :value="recipeAsJSON" auto-grow class="recipe-json"
                         label="Recipe as JSON" label-placement="stacked" wrap="soft"/>
        </IonCardContent>
        <IonButton color="success" fill="outline" shape="round"
                   @click="saveRecipeFromJSON()">
            <IonIcon slot="start" :icon="save"/>
            Update Recipe (JSON)
        </IonButton>
    </IonCard>

    <IonButton color="success" fill="outline" shape="round"
               @click="saveRecipe()">
        <IonIcon slot="start" :icon="save"/>
        Save Recipe
    </IonButton>
    <IonButton color="danger" fill="outline" shape="round"
               @click="deleteRecipe()">
        <IonIcon slot="start" :icon="trash"/>
        Delete Recipe
    </IonButton>
    <IonButton color="medium" fill="outline" shape="round" @click="showJSON = !showJSON">
        <IonIcon slot="start" :icon="information"/>
        Show JSON
    </IonButton>
</template>

<script lang="ts" setup>
import { IngredientComponent, Recipe, RecipeIngredient } from '@/shared';
import { useRecipeEditorStore } from '@/editor/storage';
import {
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonChip,
    IonCol,
    IonGrid,
    IonIcon,
    IonImg,
    IonInput,
    IonLabel,
    IonList,
    IonRow,
    IonTextarea,
    useIonRouter
} from '@ionic/vue';
import { computed, PropType, ref, toRefs, watch } from 'vue';
import { add, closeCircleOutline, information, remove, save, trash } from 'ionicons/icons';
import { MutableRecipe } from '@/editor/models/recipe';
import DropDownSearch from '@/shared/components/utility/DropDownSearch.vue';
import { findMostSimilarItem } from '@/editor/parser/utils.ts';
import { logDebug } from '@/shared/utils/logging.ts';
import { newIngredientFromName } from '@/editor/models/ingredient.ts';
import Duration from '@/shared/components/time/Duration.vue';

const MODULE = 'editor.components.editor.RecipeEditor.'

const props = defineProps({
    recipe: {
        type: Object as PropType<MutableRecipe>, required: true,
    },
});
const { recipe } = toRefs(props)

const router = useIonRouter();
const recipeStore = useRecipeEditorStore();

const mutableRecipe = ref<MutableRecipe>(recipe.value)
// update recipe and steps when prop changes
watch(recipe, (newRecipe: MutableRecipe) => {
    mutableRecipe.value = newRecipe
}, { immediate: true })

/**
 * Save recipe to the Backend API
 */
const saveRecipe = () => mutableRecipe?.value?.save()

/**
 * Delete recipe from the Backend API
 * Redirect to SavedRecipes
 */
const deleteRecipe = () => mutableRecipe?.value?.delete().then(() => {
    router.push({ name: 'Home' })
})

/**
 * Add a step to the recipe
 * @param stepIndex index of the step to add after
 */
const addStep = (stepIndex: number) => mutableRecipe.value?.addStep(undefined, stepIndex)


/**
 * Remove a step from the recipe
 * @param stepIndex index of the step to remove
 */
const removeStep = (stepIndex: number) => mutableRecipe.value?.removeStep(stepIndex)

/* Select an item from the list to edit */
const itemToEdit = ref<RecipeIngredient | undefined>(newIngredientFromName(''))

/**
 * Add an item to a step
 */
const addItemToRecipe = () => {
    mutableRecipe?.value?.putRecipeIngredient(itemToEdit.value)
    itemToEdit.value = newIngredientFromName('')
}

/**
 * Remove an item from a step
 * @param stepIndex index of the step to remove the item from
 * @param itemIndex index of the item to remove
 */
const removeItem = (stepIndex: number, itemIndex: number) => mutableRecipe.value?.steps[stepIndex].items.splice(itemIndex, 1);

/**
 * Edit the item
 */
const editItem = (recipeItem: RecipeIngredient) => itemToEdit.value = recipeItem

/**
 * Get all tags from the store
 */
const allTags = computed<string[]>(() => recipeStore.getTags);

const updateName = (name: string) => {
    const fName = MODULE + 'updateName'
    logDebug(fName, name)

    // check if there is an item to edit
    if (!itemToEdit.value) {
        logDebug(fName, 'no item to edit')
        return
    }

    // find the most similar item
    const item = findMostSimilarItem(name)
    if (!item) {
        logDebug(fName, 'no similar item found')
        return
    }
    logDebug(fName, `most similar item: ${item.getName()}`)

    logDebug(fName, `updating item ${itemToEdit.value.getName()} to ${item.getName()}
        and recipe ${mutableRecipe.value.getName()}`)
    itemToEdit.value = itemToEdit.value?.updateItem(item)
    logDebug(fName, itemToEdit.value)
    mutableRecipe.value.putRecipeIngredient(itemToEdit.value)
}

/* JSON */
const recipeAsJSON = ref('')
const showJSON = ref(false)
watch(mutableRecipe, (newRecipe: MutableRecipe) => {
    recipeAsJSON.value = JSON.stringify(newRecipe, null, 2)
}, { immediate: true })

const saveRecipeFromJSON = async () => {
    mutableRecipe.value = await Recipe.fromJSON(recipeAsJSON.value) as MutableRecipe
}
</script>

<style scoped>
.recipe-image-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
}

.recipe-image::part(image) {
    max-width: 400px;
    height: auto;
    border-radius: var(--border-radius);
}

ion-textarea {
    width: 100%;
    max-height: 40vh;
    overflow-y: scroll;
}

ion-card {
    box-shadow: var(--box-shadow);
    border-radius: var(--border-radius);
}

ion-avatar.recipe-preview-img {
    --size: 140px;
}

.tags-editor {
    margin: 10px;
    max-width: fit-content;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}

.step-editor {
    width: 100%;
    margin-bottom: 10px;
    padding-bottom: 5px;
}

.items-editor {
    margin: 10px;
    max-width: fit-content;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}

.item-editor {
    margin: var(--margin);
    padding: var(--padding);
    border-radius: var(--border-radius);
    border: var(--border);
}

@media screen and (max-width: 600px) {
    .tags-editor {
        flex-direction: column;
    }

    .items-editor {
        flex-direction: column;
    }
}

ion-button {
    margin-left: 10px;
    margin-right: 10px;
}

.item-edit {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.item-attribute {
    width: 30%;
}
</style>
