<script>
import axios from "axios";
import PostCard from "../ui/postCard.vue";
import Avatar from "../ui/avatar.vue";
import NotFound from "./notFound.vue";
import UploadImage from "../uploadImage.vue";
import isLoggedIn from "@/isLoggedIn";

export default {
  components: {
    PostCard,
    Avatar,
    NotFound,
    UploadImage,
  },
  data() {
    return {
      data: {},
      postsData: [],
      loaded: false,
      isAuthorized: false,
    };
  },
  watch: {
    "$route.params.userid": async function (newUserId, old) {
      location.reload();
    },
  },
  async created() {
    // axios
    //   .get("https://localhost:3000/api/users")
    //   .then((res) => {
    //     console.log(res.data);
    //     console.log(this.data);
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching data:", error);
    //   });

    const userid = this.$route.params.userid;

    try {
      const res = await axios.get(
        `https://localhost:3000/api/users/user/${userid}`
      );
      const auth = await isLoggedIn();

      const userTheadsData = await axios.get(
        `https://localhost:3000/api/posts/user/${userid}`
      );

      if (auth.userid === userid) this.isAuthorized = true;
      this.data = res.data;
      this.postsData = userTheadsData.data;
    } catch {
      this.loaded = true;
    } finally {
      this.loaded = true;
    }
  },
  methods: {
    async handleUpdateBio() {
      try {
        const userid = this.$route.params.userid;

        const updateUserBio = await axios.put(
          `https://localhost:3000/api/users/profile/${userid}`,
          { bio: this.data.bio },
          { withCredentials: true }
        );

        location.reload();
      } catch (e) {
        alert("Bio update failed!");
        console.error(e);
      }
    },
  },
};
</script>

<template>
  <div class="container-l main-view" v-if="loaded">
    <div class="profile">
      <div class="profile-left" v-if="data">
        <h3>{{ data.username }}</h3>
        <input
          type="textarea"
          class="profile-bio"
          v-model="data.bio"
          v-if="isAuthorized"
        />
        <button
          class="btn-blackwhite"
          @click="handleUpdateBio"
          v-if="isAuthorized"
        >
          Update bio
        </button>
        <div class="profile-bio" v-else>
          {{ data.bio }}
        </div>
      </div>
      <div class="profile-right" v-if="data">
        <Avatar :image="this.data.image" />
        <UploadImage v-if="isAuthorized" />
      </div>
    </div>
    <div class="posts" v-if="postsData">
      <PostCard v-for="item in postsData" :key="item.postid" :data="item" />
    </div>
  </div>
  <div class="container-l profile" v-else>Loading...</div>
</template>

<style scoped>
.profile {
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.avatar {
  height: 5rem;
  width: 5rem;
}
</style>
