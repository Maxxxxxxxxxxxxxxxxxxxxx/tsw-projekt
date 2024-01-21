<script>
import Logo from "../ui/logo.vue";
export default {
  components: {
    Logo,
  },
};
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light">
    <Logo class="navbar-left" />

    <div class="navbar-buttons" role="group" aria-label="Basic example">
      <a href="/">
        <button type="button" class="btn btn-outline-primary btn-navbar">
          <i class="bi bi-house"></i>
        </button>
      </a>
      <a href="/profile">
        <button type="button" class="btn btn-outline-primary btn-navbar">
          <i class="bi bi-person"></i>
        </button>
      </a>
      <button type="button" class="btn btn-outline-primary btn-navbar">
        <i class="bi bi-plus-lg"></i>
      </button>
    </div>

    <div class="navbar-right"></div>
    <!-- <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button> -->
  </nav>
</template>

<style scoped>
.navbar {
  justify-content: space-between;
  padding: 0;
}

a {
  background-color: none;
  background: none;
}

.navbar-left {
  flex: 1 1 0%;
}

.navbar-right {
  flex: 1 1 0%;
}

.navbar-buttons {
  display: flex;
  gap: 0.4rem;
}

.btn-navbar {
  border: none;
  border-radius: 15%;
  width: 4rem;
  height: 4rem;
  font-size: 2rem;
  color: black;
}

.btn-navbar:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
