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
      opData: {},
      replies: [],
      loaded: false,
    };
  },
  async mounted() {
    const id = this.$route.params.postid;

    const repliesRes = await axios.get(
      `https://localhost:3000/api/posts/${id}`
    );

    const dataWithParsedDate = repliesRes.data.map((postData) => {
      const date = new Date(postData.dateposted);
      return { ...postData, dateposted: date.toLocaleString() };
    });

    this.replies = dataWithParsedDate;

    const threadRes = await axios.get(
      `https://localhost:3000/api/posts/single/${id}`
    );

    const threadParsed = threadRes.data.map((postData) => {
      const date = new Date(postData.dateposted);
      return { ...postData, dateposted: date.toLocaleString() };
    });

    this.opData = threadParsed[0];

    console.log("opdata", this.opData);
    console.log("replies", this.replies);

    this.loaded = true;
  },
};
</script>

<template>
  <div class="main-container">
    <div class="container-l thread" v-if="loaded">
      <PostCard :data="opData" />
      <PostForm />
      <PostCard v-for="item in replies" :key="item.postid" :data="item" />
    </div>
    <div class="container-l thread" v-else>Loading...</div>
  </div>
</template>

<style scoped>
.thread {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  align-items: center;
  margin: auto;
  width: 50%;
}
</style>
