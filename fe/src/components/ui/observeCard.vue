<script>
import Avatar from "./avatar.vue";
export default {
  components: {
    Avatar,
  },
  data() {
    return {
      user: {},
      loaded: false,
      isObserved: false,
    };
  },
};
</script>

<template>
  <div class="usercard" v-if="loaded">
    <Avatar />
    {{ this.data.username }}
    <button class="btn-blackwhite" v-if="isObserved">Observe</button>
  </div>
</template>

<style scoped>
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
