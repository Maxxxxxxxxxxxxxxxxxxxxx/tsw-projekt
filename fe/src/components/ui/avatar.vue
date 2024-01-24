<template>
  <div class="avatar" v-if="parsed">
    <img class="avatar-image" :src="image" />
  </div>
</template>

<script>
export default {
  props: {
    userid: String,
    image: {
      type: String,
      default: "/avatar.svg", // Set a default value for the image source
    },
  },
  data() {
    return {
      parsed: true,
    };
  },
  created() {},
};
</script>

<style scoped>
.avatar-image {
  min-width: 0px;
  min-height: 0px;
  height: 100%;
  width: 100%;
}

.avatar {
  border-radius: 100%;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  width: 2.3rem;
  height: 2.3rem;
  border: 1px rgba(0, 0, 0, 0.125) solid;
  overflow: hidden;
}
</style>
