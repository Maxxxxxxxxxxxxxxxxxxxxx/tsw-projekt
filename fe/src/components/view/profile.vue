<script>
import axios from "axios";
import PostCard from "../ui/postCard.vue";
import Avatar from "../ui/avatar.vue";

export default {
  components: {
    PostCard,
    Avatar,
  },
  data() {
    return {
      data: [],
      postsData: [],
      loaded: false,
    };
  },
  mounted() {
    axios
      .get("https://localhost:3000/api/users")
      .then((res) => {
        console.log(res.data);
        console.log(this.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  },
};
</script>

<template>
  <div class="container-l profile" v-if="loaded">
    <div class="profile-left">
      {{ data.username }}
    </div>
    <div class="profile-right">
      <Avatar />
    </div>
  </div>
  <div class="posts" v-if="loaded">
    <PostCard v-for="item in postsData" :key="item.postid" :data="item" />
  </div>
  <div class="container-l profile" v-else>Loading...</div>
</template>

<style scoped>
.profile {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: space-between;
  align-items: center;
}
</style>
