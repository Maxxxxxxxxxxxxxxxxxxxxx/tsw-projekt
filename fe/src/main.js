import "./assets/main.css";
import "bootstrap/dist/css/bootstrap.css";

import { createApp } from "vue";
import App from "./App.vue";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle";
import { createRouter, createWebHistory } from "vue-router";
import vueCookie from "vue-cookies";

import Feed from "./components/view/feed.vue";
import Login from "./components/view/login.vue";
import Thread from "./components/view/thread.vue";
import Profile from "@/components/view/profile.vue";
import Cite from "@/components/view/cite.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/home", component: Feed },
    { path: "/login", component: Login, name: "login" },
    { path: "/thread/:postid", component: Thread, name: "thread" },
    { path: "/profile/:userid", component: Profile, name: "profile" },
    { path: "/cite/:postid", component: Cite, name: "cite" },
  ],
});

const app = createApp(App).use(bootstrap).use(router).use(vueCookie);

app.mount("#app");
