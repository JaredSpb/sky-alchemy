import './assets/main.less'

import { createApp, shallowReactive } from 'vue'
import App from './App.vue'

import i18n from './lib/i18n.js';

const app = createApp(App)
app.config.globalProperties.i18n = shallowReactive(i18n);
i18n.backRef(app.config.globalProperties.i18n);

app.mount('#app')

