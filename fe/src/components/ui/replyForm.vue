<script>
import Avatar from "./avatar.vue";
export default {
  components: {
    Avatar,
  },
  data() {
    return {
      user: {
        image: String,
        userid: String,
      },
      loggedIn: false,
    };
  },
  mounted() {
    axios.get("https://localhost:3000/api/users").then((res) => {
      if (res.status === 200) {
        this.user = res.data;
        this.loggedIn = true;
      }
    });
  },
};
</script>

<template>
  <form :v-if="loggedIn" action="" class="postform">
    <Avatar />
    <input
      :v-if="loggedIn"
      class="form-control form-control-sm"
      type="text"
      placeholder="Start a thread..."
    />
    <button type="button" class="btn btn-primary btn-submitPost">Post</button>
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

.btn-submitPost {
  border-radius: 0.9rem;
  min-width: 1.5rem;
  font-weight: bolder;
  background-color: black;
  color: white;
  border: 3px black solid;
}

.btn-submitPost:hover {
  background-color: white;
  color: black;
}
</style>
