<script>
import isLoggedIn from "@/isLoggedIn";
import Avatar from "./avatar.vue";
import axios from "axios";

export default {
  components: {
    Avatar,
  },
  data() {
    return {
      user: {},
      loggedIn: false,
      loaded: false,
      content: "",
    };
  },
  methods: {
    async handleSubmit() {
      console.log(this.content);
      if (this.content) {
        await axios.post(
          "https://localhost:3000/api/posts/",
          {
            content: this.content,
          },
          { withCredentials: true }
        );

        location.reload();
      } else {
        alert("Post cannot be empty!");
      }
    },
  },
  async created() {
    const user = await isLoggedIn();
    this.user = user;

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
  <form @submit.prevent="handleSubmit" class="postform">
    <Avatar :image="user.image" />
    <input
      v-model="content"
      class="form-control form-control-sm"
      type="text"
      placeholder="Start a thread..."
    />
    <button type="submit" class="btn btn-primary btn-blackwhite">Post</button>
  </form>
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
</style>
