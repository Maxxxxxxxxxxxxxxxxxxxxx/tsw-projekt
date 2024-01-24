<script>
import isLoggedIn from "@/isLoggedIn";
import Avatar from "@/components/ui/avatar.vue";
import PostCard from "@/components/ui/postCard.vue";
import axios from "axios";

export default {
  components: {
    Avatar,
    PostCard,
  },
  data() {
    return {
      user: {},
      citedPost: {},
      loggedIn: false,
      loaded: false,
      content: "",
    };
  },
  methods: {
    async handleSubmit() {
      console.log(this.content);
      try {
        if (this.content) {
          await axios.post(
            `https://localhost:3000/api/posts/?cite=${this.$route.params.postid}`,
            {
              content: this.content,
            },
            { withCredentials: true }
          );

          this.$router.push(`/home`);
          // location.reload();
        } else {
          alert("Post cannot be empty!");
        }
      } catch (e) {
        console.error(e);
        alert("Error processing request");
      }
    },
  },
  async created() {
    const user = await isLoggedIn();
    this.user = user;

    const cited = await axios.get(
      `https://localhost:3000/api/posts/single/${this.$route.params.postid}`
    );

    console.log("cited", cited);

    this.citedPost = cited.data[0];
    this.loaded = true;

    // axios.get("https://localhost:3000/api/users").then((res) => {
    //   if (res.status === 200) {
    //     this.user = res.data;
    //     this.loggedIn = true;
    //   }
    // });
  },
};
</script>

<template>
  <div class="main-view">
    <h4 v-if="loaded">Citing {{ this.citedPost.username }}'s post</h4>
    <PostCard :data="citedPost" v-if="loaded" />
    <form @submit.prevent="handleSubmit" class="postform">
      <Avatar :image="user.image" />
      <input
        v-model="content"
        class="form-control form-control-sm"
        type="text"
        placeholder="Write something..."
      />
      <button type="submit" class="btn btn-primary btn-blackwhite">Post</button>
    </form>
  </div>
</template>

<style scoped>
.postform {
  padding: 1rem 0 0.8rem 0;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  width: 100%;
}

.form-control {
  flex: 3;
  border: none;
  box-sizing: border-box;
  resize: none;
  overflow-y: hidden;
  transition: height 0.3s ease;
  word-wrap: break-word;
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

.cite-btn {
  display: none;
}
</style>
