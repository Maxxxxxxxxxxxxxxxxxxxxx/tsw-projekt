<script>
import isLoggedIn from "@/isLoggedIn";
import axios from "axios";

export default {
  methods: {
    async uploadFile() {
      const fileInput = this.$refs.fileInput;
      const formData = new FormData();

      if (fileInput.files.length > 0) {
        formData.append("image", fileInput.files[0]);

        try {
          const userRes = await isLoggedIn();
          const userid = userRes.userid;

          const response = await axios.post(
            "https://localhost:3000/api/static/upload",
            formData,
            { withCredentials: true }
          );

          const updateUserImage = await axios.put(
            `https://localhost:3000/api/users/profile/${userid}`,
            { image: response.data },
            { withCredentials: true }
          );

          location.reload();
        } catch (error) {
          console.error("Error updating profile picture");
        }
      } else {
        console.warn("No file selected.");
      }
    },
  },
  data() {},
};
</script>

<template>
  <div class="upload">
    <form
      class="upload-form"
      @submit.prevent="uploadFile"
      enctype="multipart/form-data"
    >
      <input
        class="form-control"
        type="file"
        ref="fileInput"
        accept="image/*"
      />
      <button class="btn-blackwhite" type="submit">Upload</button>
    </form>
  </div>
</template>

<style scoped></style>
