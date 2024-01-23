<script>
import axios from "axios";
import PostCard from "../ui/postCard.vue";
import PostForm from "../ui/postForm.vue";
import isLoggedIn from "@/isLoggedIn";
import LoginTo from "../ui/loginTo.vue";

export default {
  components: {
    PostCard,
    PostForm,
    LoginTo,
  },
  data() {
    return {
      postsData: [],
      loaded: false,
      user: {},
      loggedIn: false,
    };
  },
  async mounted() {
    try {
      const res = await axios.get("https://localhost:3000/api/posts");
      this.postsData = res.data;

      const auth = await isLoggedIn();

      if (auth) {
        this.user = auth;
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
      }

      console.log(this.postsData);
      this.loaded = true;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
};
</script>

<template>
  <div class="main-container">
    <div class="container-l feed" v-if="loaded">
      <PostForm v-if="loggedIn" />
      <LoginTo :prompt="'Log in to post'" v-else />
      <PostCard v-for="item in postsData" :key="item.postid" :data="item" />
    </div>
    <div class="container-l feed" v-else>Loading...</div>
  </div>
</template>

<style scoped>
.feed {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  align-items: center;
  margin: auto;
  width: 50%;
}
</style>
