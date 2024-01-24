<script>
import isLoggedIn from "@/isLoggedIn";
import Avatar from "./avatar.vue";
import LoginTo from "./loginTo.vue";
import axios from "axios";

export default {
  components: {
    Avatar,
    LoginTo,
  },
  data() {
    return {
      content: "",
      user: {
        image: String,
        userid: String,
      },
      loggedIn: false,
      loaded: false,
    };
  },
  async created() {
    try {
      const res = await isLoggedIn();
      this.user = {
        image: res.image,
        userid: res.userid,
      };

      this.loggedIn = true;
    } catch {
      this.loggedIn = false;
    } finally {
      this.loaded = true;
    }
  },
  methods: {
    async handleSubmit() {
      const opid = this.$route.params.postid;

      if (!this.content) {
        alert("Write something!");
        return;
      }

      try {
        await axios.post(
          `https://localhost:3000/api/posts/reply?op=${opid}`,
          { content: this.content },
          {
            withCredentials: true,
          }
        );

        location.reload();
      } catch (e) {
        console.log(e);
        alert("Error creating reply!");
      }
    },
  },
};
</script>

<template>
  <form
    v-if="loggedIn"
    @submit.prevent="handleSubmit"
    action=""
    class="postform replyform"
  >
    <Avatar :image="user.image" />
    <input
      class="form-control form-control-sm"
      type="text"
      placeholder="Reply..."
      v-model="this.content"
    />
    <button type="submit" class="btn btn-primary btn-blackwhite">Post</button>
  </form>
  <div class="postform-signedout" v-else>
    <!-- <router-link class="" :to="{ name: 'login' }">
      Log in to reply
    </router-link> -->
    <LoginTo :prompt="'Log in to reply'" />
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

.postform-signedout {
  margin-top: 0.5rem;
  margin-bottom: 1rem;
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
