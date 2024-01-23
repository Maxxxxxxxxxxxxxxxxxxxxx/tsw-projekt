<script>
export default {
  props: {
    prompt: String,
  },
};
</script>

<template>
  <router-link class="btn-blackwhite" :to="{ name: 'login' }">
    {{ prompt }}
  </router-link>
</template>

<style scoped>
.btn-blackwhite {
  border-radius: 0.9rem;
  min-width: 1.5rem;
  font-weight: bolder;
  background-color: black;
  color: white;
  border: 3px black solid;
  width: 10rem;
}

.btn-blackwhite:hover {
  background-color: white;
  color: black;
}

a {
  text-decoration: none;
}
</style>
