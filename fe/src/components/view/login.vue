<script>
import axios from "axios";
import isLoggedIn from "@/isLoggedIn";
export default {
  data() {
    return {
      user: {
        image: String,
        userid: String,
        username: "",
        password: "",
      },
      register: false,
    };
  },
  async created() {
    const res = await isLoggedIn();
    if (res) this.$router.push("/home");
  },
  methods: {
    setLogin() {
      this.register = false;
    },
    setRegister() {
      this.register = true;
    },
    async handleSubmit() {
      const userData = {
        username: this.username,
        password: this.password,
      };

      console.log(userData);

      if (this.register) {
        try {
          const response = await axios.post(
            "https://localhost:3000/api/auth/",
            userData,
            {
              withCredentials: true,
            }
          );

          const loginRes = await axios.put(
            "https://localhost:3000/api/auth/",
            userData,
            {
              withCredentials: true,
            }
          );

          this.$router.push("/home");
          location.reload();
        } catch {
          alert("Error registering!");
        }
      } else {
        try {
          const response = await axios.put(
            "https://localhost:3000/api/auth/",
            userData,
            {
              withCredentials: true,
            }
          );

          try {
            const res = await isLoggedIn();
            if (res) this.$router.push("/home");
            location.reload();
          } catch {
            alert("User not logged in!");
          }

          if (response.status === 200) {
            this.$router.push("/home");
            location.reload();
          }
        } catch {
          alert("Wrong username/password!");
        }
      }

      console.log(response);
    },
  },
};
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div class="heading">
      <h3 class="labelonclick" @click="setLogin">Login</h3>
      <h3>/</h3>
      <h3 class="labelonclick" @click="setRegister">Register</h3>
    </div>
    <br />
    <div class="form-group">
      <input
        type="text"
        class="form-input"
        id="username"
        placeholder="Username"
        v-model="username"
      />
    </div>
    <div class="form-group">
      <input
        type="password"
        class="form-input"
        id="password"
        placeholder="Password"
        v-model="password"
      />
    </div>
    <button
      v-if="register"
      type="submit"
      class="btn btn-primary btn-blackwhite"
    >
      Register
    </button>
    <button v-else type="submit" class="btn btn-primary btn-blackwhite">
      Login
    </button>
  </form>
</template>

<style scoped>
.labelonclick:hover {
  cursor: pointer;
}

.heading {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
}

.postform {
  padding: 1rem 0 0.8rem 0;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  width: 100%;
}

form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  justify-items: center;
  align-items: center;
  align-content: center;
  gap: 0.5rem;
}

.form-group {
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
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

.form-input {
  border: none;
  width: 100%;
}

input:focus {
  outline: none;
}

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
</style>
