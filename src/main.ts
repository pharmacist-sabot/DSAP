// src/main.ts
import { createPinia } from 'pinia';
import { createApp } from 'vue';

// biome-ignore lint/correctness/noUnresolvedImports: Vue SFC components export a default component at build time.
import App from './App.vue';
import { router } from './router';
import './assets/main.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
