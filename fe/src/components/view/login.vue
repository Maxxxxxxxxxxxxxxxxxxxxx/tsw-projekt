<script>
import Avatar from "../ui/avatar.vue";
export default {
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
  <form>
    <div class="form-group">
      <label for="exampleInputEmail1">Email address</label>
      <input
        type="email"
        class="form-control"
        id="exampleInputEmail1"
        aria-describedby="emailHelp"
        placeholder="Enter email"
      />
      <small id="emailHelp" class="form-text text-muted"
        >We'll never share your email with anyone else.</small
      >
    </div>
    <div class="form-group">
      <label for="exampleInputPassword1">Password</label>
      <input
        type="password"
        class="form-control"
        id="exampleInputPassword1"
        placeholder="Password"
      />
    </div>
    <div class="form-group form-check">
      <input type="checkbox" class="form-check-input" id="exampleCheck1" />
      <label class="form-check-label" for="exampleCheck1">Check me out</label>
    </div>
    <button type="submit" class="btn btn-primary">Submit</button>
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
