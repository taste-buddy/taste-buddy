<!--
  - Copyright (c) 2023 Josef Müller.
  -->

<template>
    <ul v-if="items.length > 0" :class="['item-list', {'horizontal': horizontal}]">
        <li v-for="(item, itemIndex) in mappedItems" :key="itemIndex" class="item">
            <ItemComponent :item="item" :quantity-position="quantityPosition"/>
        </li>
    </ul>
</template>

<script lang="ts" setup>
import { computed, PropType, toRefs } from 'vue';
import { Item, ItemComponent, RecipeItem } from '@/shared';

const props = defineProps({
    items: {
        type: Array as PropType<(RecipeItem[] | Item[])>, required: true,
    }, showLimit: {
        type: Number, required: false, default: 30
    }, type: {
        type: Array as PropType<string[]>, required: false
    }, horizontal: {
        type: Boolean, required: false, default: false
    }, quantityPosition: {
        type: String as PropType<'start' | 'end'>, required: false, default: 'end'
    }, enableEmit: {
        type: Boolean, required: false, default: false
    }
})
const {items, type, showLimit} = toRefs(props);

const mappedItems = computed<Item[]>(() => {
    const mappedItems = items.value
        .slice(0, showLimit.value)
    if (!type?.value) {
        return mappedItems
    }
    return mappedItems.filter((item: Item) => type.value?.includes(item.type))
})
</script>

<style scoped>
ul.item-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
    overflow-y: scroll;
}

ul.item-list.horizontal {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    overflow-x: scroll;
}

li.item {
    margin-right: var(--margin-small);
}
</style>