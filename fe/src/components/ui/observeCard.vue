<script>
import axios from "axios";
import Avatar from "./avatar.vue";
import isLoggedIn from "@/isLoggedIn";
export default {
  components: {
    Avatar,
  },
  props: {
    user: {},
    socket: {},
  },
  data() {
    return {
      render: true,
    };
  },
  methods: {
    async handleObserve() {
      const selfData = await isLoggedIn();
      try {
        if (this.user.isObserved) {
          await axios.delete(
            `https://localhost:3000/api/users/follow/${this.user.userid}`,
            { withCredentials: true }
          );

          location.reload();
        } else {
          await axios.post(
            `https://localhost:3000/api/users/follow/${this.user.userid}`,
            {},
            { withCredentials: true }
          );

          this.socket.emit("followed", {
            followerid: selfData.userid,
            followedid: this.user.userid,
            followerUsername: selfData.username,
          });

          location.reload();
        }
      } catch (e) {
        console.error(e);
        alert("An error has occured!");
      }
    },
    handleRedirect() {
      this.$router.push(`/profile/${this.user.userid}`);
    },
  },
};
</script>

<template>
  <div class="usercard" v-if="render">
    <Avatar :image="user.image" />
    <div @click="handleRedirect" class="usercard-label">
      {{ this.user.username }}
    </div>
    <div class="usercard-right">
      <button
        @click="handleObserve"
        class="btn-blackwhite btn-small btn-observed"
        v-if="user.isObserved"
      >
        <i class="bi bi-person-fill-dash"></i>
      </button>
      <button @click="handleObserve" class="btn-blackwhite btn-small" v-else>
        <i class="bi bi-person-fill-add"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
.usercard {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
}

.usercard-label {
  font-size: small;
  font-weight: bold;
}

.usercard-label:hover {
  cursor: pointer;
}

.avatar {
  width: 2.2rem;
  height: 2.2rem;
}
.btn-blackwhite {
  border-radius: 0.9rem;
  min-width: 1.5rem;
  font-weight: bolder;
  background-color: black;
  color: white;
  border: 3px black solid;
}

.btn-small {
  flex: 1;
  max-width: 2rem;
}

.btn-blackwhite:hover {
  background-color: white;
  color: black;
}

.usercard-right {
  display: flex;
  flex-direction: row;
  justify-content: end;
  flex: 2;
}

.btn-observed {
  background-color: white;
  color: black;
}

.btn-observed:hover {
  background-color: black;
  color: white;
}
</style>
