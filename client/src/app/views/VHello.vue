<!--
  - Copyright (c) 2023-2024 Josef Müller.
  -->

<template>
    <IonPage>
        <IonContent :fullscreen="true">
            <div class="content-wrapper">
                <div class="content h100">
                    <div class="vertical-center">
                        <HeaderTyped
                            :big-text="welcomeText"
                            :speed="20"
                            small-text="Loading ..."
                            @finish="finished = true"
                        />
                    </div>
                </div>
            </div>
        </IonContent>
    </IonPage>
</template>

<script lang="ts" setup>
import { IonContent, IonPage, useIonRouter } from '@ionic/vue';
import HeaderTyped from '@/shared/components/utility/header/HeaderTyped.vue';
import { computed, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { APP_NAME } from '@/shared';
import { useSharedStore } from '@/shared/storage';

const { t } = useI18n();
const welcomeText = computed(() =>
    t('General.WelcomeText', { appName: APP_NAME }).split(';')
);

const finished = ref(false);
const route = useRoute();
const redirect = computed(() => (route.query.redirect ?? '') as string);

const recipeStore = useSharedStore();
const isLoadingInitialData = computed(() => recipeStore.isLoadingInitial);
const timeout = ref(0);
const router = useIonRouter();
watch(
    [isLoadingInitialData, finished],
    () => {
        if (!isLoadingInitialData.value && finished.value) {
            timeout.value = setTimeout(() => {
                router.replace(redirect.value);
            }, 600);
        }
    },
    { immediate: true }
);

onUnmounted(() => {
    clearTimeout(timeout.value);
});
</script>
