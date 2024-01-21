import "./assets/main.css";
import "bootstrap/dist/css/bootstrap.css";

import { createApp } from "vue";
import App from "./App.vue";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle";
import { createRouter, createWebHistory } from "vue-router";

import Feed from "./components/view/feed.vue";
import Login from "./components/view/login.vue";
import Thread from "./components/view/thread.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/home", component: Feed },
    { path: "/login", component: Login },
    { path: "/thread/:postid", component: Thread, name: "thread" },
  ],
});

const app = createApp(App).use(bootstrap).use(router);

app.mount("#app");
