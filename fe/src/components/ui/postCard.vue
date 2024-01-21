<script>
import Avatar from "./avatar.vue";
export default {
  components: {
    Avatar,
  },
  props: {
    data: {
      userid: String,
      dateposted: String,
      content: String,
      username: String,
      postid: String,
      replied: Number,
    },
  },
};
</script>

<template>
  <div class="card">
    <div class="card-body">
      <div class="card-upper">
        <div class="card-userwrapper">
          <Avatar />
          <h5 class="card-title">{{ data.username }}</h5>
        </div>
        <h8 class="card-dateposted text-muted">
          {{ data.dateposted }}
        </h8>
      </div>
      <p class="card-text">
        {{ data.content }}
      </p>
      <div class="card-lower">
        <a href="#" class="card-btn">
          <i class="bi bi-arrow-repeat"></i>
        </a>
        <router-link
          :to="{ name: 'thread', params: { postid: data.postid } }"
          class="card-btn"
        >
          <i class="bi bi-chat"></i>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-userwrapper {
  display: flex;
  flex-direction: row;
  align-content: center;
  align-items: center;
  gap: 1rem;
}

.card-title {
  margin-bottom: 0;
}

.card-lower {
  display: flex;
}

.card-btn {
  color: black;
  font-weight: bolder;
  padding: 0.6rem;
}

.card-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 15%;
}

.card {
  border: none;
  border-top: 1px solid rgba(0, 0, 0, 0.15);
  width: 100%;
}

.card-title {
  font-size: 1rem;
  font-weight: bolder;
}

.card-body {
  padding: 0.5rem 0 0.5rem 0;
}

.card-upper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card-dateposted {
  font-size: 0.7rem;
  text-align: center;
}
</style>
