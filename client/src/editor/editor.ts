/*
 * Copyright (c) 2023-2024 Josef Müller.
 */

// Ionic
import { IonicVue } from '@ionic/vue';

// Vue + App
import { createApp } from 'vue'
import App from '@/editor/App.vue'

// Router
import { createTasteBuddyRouter } from '@/editor/router';

// Store
import { createPinia } from 'pinia';

// Styles
/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Custom variables */
import '@/shared/theme/colors.css';
import '@/shared/theme/global.css';
import '@/shared/theme/ionic.css'
import '@/shared/theme/layout.css';
import '@/shared/theme/font.css';
import '@/shared/theme/links.css';

/* Icons */
import 'ionicons/icons';
/* Initialize internalisation */
import { i18n } from '@/shared/locales/i18n';

// Initializations

/* Initialize store */
const pinia = createPinia()

/* Initialize router */
const router = createTasteBuddyRouter();

/* Initialize app */
const app = createApp(App)
    .use(IonicVue)
    .use(pinia)
    .use(router)
    .use(i18n)

router.isReady().then(() => {
    app.mount('#tastebuddy');
});
