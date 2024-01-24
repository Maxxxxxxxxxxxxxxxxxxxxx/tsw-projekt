<script>
import axios, { toFormData } from "axios";
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
    const date = new Date().toLocaleDateString();
    return {
      posts: [],
      postsPreview: [],
      loaded: false,
      user: {},
      loggedIn: false,
      start: date,
      renderPosts: true,
    };
  },
  watch: {
    start: function (n, o) {
      this.rerenderPosts();
    },
  },
  async mounted() {
    const startDated = new Date(this.start);
    const startTimestamp = startDated.getTime();

    try {
      const res = await axios.get("https://localhost:3000/api/posts/", {
        withCredentials: true,
      });

      res.data.sort((a, b) => b.dateposted - a.dateposted);

      this.posts = res.data;

      if (startTimestamp) {
        this.postsPreview = res.data.filter(
          (e) => e.dateposted > startTimestamp
        );
      } else {
        this.postsPreview = res.data;
      }

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
  methods: {
    randomKey() {
      return Math.floor(Math.random() * 278000000000000);
    },
    async rerenderPosts() {
      const startDated = new Date(this.start);
      const startTimestamp = startDated.getTime();

      this.postsPreview = this.posts.filter((e) => {
        const timestamp = new Date(e.dateposted).getTime();
        return timestamp > startTimestamp;
      });

      this.renderPosts = false;
      await this.$nextTick();
      this.renderPosts = true;
    },
  },
};
</script>

<template>
  <div class="main-container">
    <div class="container-l feed" v-if="loaded">
      <PostForm v-if="loggedIn" />
      <LoginTo :prompt="'Log in to post'" v-else />
      <div class="date-pick" v-if="loggedIn">
        <input class="date-pick-input" type="date" v-model="start" />
        <!-- <input class="date-pick-input" type="date" v-model="time.end" /> -->
      </div>
      <PostCard
        v-for="item in postsPreview"
        :key="randomKey"
        :data="item"
        v-if="renderPosts"
      />
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

.date-pick {
  display: flex;
  flex-direction: row;
  gap: 0.8rem;
  margin-bottom: 1rem;
}

.date-pick-input {
  border: none;
}
</style>
