<script>
import axios from "axios";
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
      image: String,
      postid: String,
      replied: Number,
    },
  },
  data() {
    return {
      loaded: false,
      cited: {},
    };
  },
  methods: {
    handleClick() {
      this.$router.push(`/thread/${this.data.postid}`);
    },
    handleRedirect() {
      this.$router.push(`/profile/${this.data.userid}`);
    },
    handleRedirectToCitedPost() {
      this.$router.push(`/thread/${this.cited.postid}`);
    },
    handleRedirectToCite() {
      this.$router.push(`/cite/${this.data.postid}`);
    },
  },
  watch: {
    "$route.params.postid": function (newPostId, old) {
      location.reload();
    },
  },
  async created() {
    const date = new Date(this.data.dateposted);
    this.data.dateposted = date.toLocaleString();

    try {
      const citedRes = await axios.get(
        `https://localhost:3000/api/posts/cited/${this.data.postid}`
      );

      console.log("citedres", citedRes.data);

      this.cited = citedRes.data[0];
    } catch (e) {
      console.error(e);
    }

    this.loaded = true;
  },
};
</script>

<template>
  <div class="card" v-if="loaded">
    <div class="card-body">
      <div class="card-upper">
        <div class="card-userwrapper">
          <Avatar :image="data.image" />
          <h5 @click="handleRedirect" class="card-title">
            {{ data.username }}
          </h5>
          <div
            @click="handleRedirectToCitedPost"
            class="card-cites text-muted"
            v-if="cited"
          >
            Citing {{ this.cited.username }}'s post
          </div>
        </div>
        <div class="card-dateposted text-muted">
          {{ data.dateposted }}
        </div>
      </div>
      <p class="card-text">
        {{ data.content }}
      </p>
      <div class="card-lower">
        <div @click="handleRedirectToCite" class="card-btn cite-btn">
          <i class="bi bi-arrow-repeat"></i>
        </div>
        <div @click="handleClick" class="card-btn">
          <i class="bi bi-chat"></i>
        </div>
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
  cursor: pointer;
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
  cursor: pointer;
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

.card-cites {
  font-size: small;
}
.card-cites:hover {
  cursor: pointer;
  text-decoration: underline;
}
</style>
