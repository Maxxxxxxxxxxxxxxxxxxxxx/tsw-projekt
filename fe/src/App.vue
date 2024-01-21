<script>
import PostCard from "./components/ui/postCard.vue";
import Feed from "./components/view/feed.vue";
import Navbar from "./components/layout/navbar.vue";
import Login from "./components/view/login.vue";
import NotFound from "./components/view/notFound.vue";
import Profile from "./components/view/profile.vue";

export default {
  components: {
    PostCard,
    Feed,
    Navbar,
    Login,
    Profile,
    NotFound,
  },
};
</script>

<template>
  <Navbar />
  <br />
  <router-view></router-view>
</template>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 1rem;
}

#app {
  width: 100%;
  height: 100%;
  display: flex important!;
  flex-direction: column;
  justify-content: center;
}
</style>
