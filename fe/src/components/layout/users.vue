<script>
import ObserveCard from "../ui/observeCard.vue";
import LoginTo from "../ui/loginTo.vue";
import axios from "axios";

export default {
  components: {
    ObserveCard,
    LoginTo,
  },
  data() {
    return {
      loaded: false,
      loggedIn: false,
      users: [],
    };
  },
  async created() {
    try {
      const users = await axios.get("https://localhost:3000/api/users/");
      
    } catch {
      this.loggedIn = false;
    } finally {
      this.loaded = true;
    }
  },
};
</script>

<template>
  <div class="users" v-if="loaded">
    <ObserveCard v-if="loggedIn" />
    <LoginTo :prompt="'Log in to see users'" />
  </div>
</template>
