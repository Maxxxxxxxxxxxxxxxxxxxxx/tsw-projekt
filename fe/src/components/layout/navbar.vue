<script>
import Logo from "../ui/logo.vue";
import isLoggedIn from "@/isLoggedIn";
import { resetSessionCookie } from "@/cookies";
export default {
  components: {
    Logo,
  },
  data() {
    return {
      profileHref: "/login",
      userData: {
        username: "",
        userid: "",
      },
      loggedIn: false,
      dataLoaded: false,
    };
  },
  async created() {
    const data = await isLoggedIn();

    if (data) {
      this.userData = data;
      this.loggedIn = true;
      this.dataLoaded = true;
      this.profileHref = `/profile/${data.userid}`;
    } else {
      this.loggedIn = false;
      this.dataLoaded = true;
    }

    console.log("navbar", this.userData, this.loggedIn);
  },
  methods: {
    handleLogout() {
      resetSessionCookie();
      this.userData = {};
      this.loggedIn = false;

      location.reload();
    },
  },
};
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light" v-if="dataLoaded">
    <Logo class="navbar-left" />

    <div class="navbar-buttons" role="group" aria-label="Basic example">
      <a href="/home">
        <button type="button" class="btn btn-outline-primary btn-navbar">
          <i class="bi bi-house"></i>
        </button>
      </a>
      <a :href="profileHref">
        <button type="button" class="btn btn-outline-primary btn-navbar">
          <i class="bi bi-person"></i>
        </button>
      </a>
      <button type="button" class="btn btn-outline-primary btn-navbar">
        <i class="bi bi-plus-lg"></i>
      </button>
    </div>

    <div class="navbar-right">
      <div class="navbar-user" v-if="loggedIn">
        {{ this.userData.username }}
      </div>
      <button class="btn-blackwhite" @click="handleLogout" v-if="loggedIn">
        Log out
      </button>
      <router-link class="btn-blackwhite" :to="{ name: 'login' }" v-else
        >Log in</router-link
      >
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  justify-content: space-between;
  padding: 0;
}

a {
  background-color: none;
  background: none;
  text-decoration: none;
}

.navbar-left {
  flex: 1 1 0%;
}

.navbar-right {
  flex: 1 1 0%;
  display: flex;
  flex-direction: row;
  justify-content: end;
  gap: 1rem;
  align-items: center;
}

.navbar-buttons {
  display: flex;
  gap: 0.4rem;
}

.btn-navbar {
  border: none;
  border-radius: 15%;
  width: 4rem;
  height: 4rem;
  font-size: 2rem;
  color: black;
}

.btn-navbar:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.btn-blackwhite {
  border-radius: 0.9rem;
  min-width: 1.5rem;
  font-weight: bolder;
  background-color: black;
  color: white;
  border: 3px black solid;
}

.btn-blackwhite:hover {
  background-color: white;
  color: black;
}
</style>
