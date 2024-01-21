<script>
import axios from "axios";
import PostCard from "../ui/postCard.vue";
import PostForm from "../ui/postForm.vue";

export default {
  components: {
    PostCard,
    PostForm,
  },
  data() {
    return {
      postsData: [],
      loaded: false,
    };
  },
  mounted() {
    axios
      .get("https://localhost:3000/api/posts")
      .then((res) => {
        // Transform unix timestamps to human-readable date
        const dataWithParsedDate = res.data.map((postData) => {
          const date = new Date(postData.dateposted);
          return { ...postData, dateposted: date.toLocaleString() };
        });

        this.postsData = dataWithParsedDate;
        this.loaded = true;

        console.log(this.postsData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  },
};
</script>

<template>
  <div class="main-container">
    <div class="container-l feed" v-if="loaded">
      <PostForm />
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
