<script>
import ObserveCard from "../ui/observeCard.vue";
import LoginTo from "../ui/loginTo.vue";
import axios from "axios";
import isLoggedIn from "@/isLoggedIn";
import io from "socket.io-client";

export default {
  components: {
    ObserveCard,
    LoginTo,
  },
  data() {
    return {
      loaded: true,
      loggedIn: false,
      socket: {},
      users: [],
    };
  },
  async created() {
    const selfData = await isLoggedIn();
    if (selfData) this.loggedIn = true;

    this.socket = io("https://localhost:3000/");

    try {
      const usersAll = await axios.get("https://localhost:3000/api/users/all", {
        withCredentials: true,
      });

      const usersFollowed = await axios.get(
        "https://localhost:3000/api/users/me/followed",
        {
          withCredentials: true,
        }
      );

      console.log("users observe cards", usersAll.data);
      console.log("users followed cards", usersFollowed.data);

      const newUsers = [
        usersAll.data
          .filter(
            (userAll) =>
              !usersFollowed.data.find(
                (userFollowed) => userAll.userid == userFollowed.userid
              )
          )
          .map((userAll) => {
            return { ...userAll, isObserved: false };
          }),
        usersFollowed.data.map((userFollowed) => {
          return { ...userFollowed, isObserved: true };
        }),
      ].flat();

      newUsers.sort((a, b) => b.isObserved);
      console.log("merged users", newUsers);

      this.users = newUsers.filter((user) => user.userid != selfData.userid);
    } catch (e) {
      console.error(e);
    } finally {
      this.loaded = true;
    }

    this.socket.on("followed", (followEvent) => {
      console.log(
        `${followEvent.followerid} followed ${followEvent.followedid}`
      );
      if (followEvent.followedid === selfData.userid)
        alert(`${followEvent.followerUsername} followed you!`);
    });
  },
};
</script>

<template>
  <div class="users" v-if="loaded">
    <h5>Users</h5>
    <ObserveCard
      v-for="item in this.users"
      :key="item.userid"
      :user="item"
      :socket="this.socket"
    />
  </div>
</template>

<style scoped>
.users {
  display: flex;
  flex-direction: column;
  width: 15rem;
  height: 90vh;
  position: absolute;
  gap: 1rem;
  overflow-y: scroll;
  padding-right: 1rem;
  border-right: 1px solid rgba(0, 0, 0, 0.15);
}
</style>
