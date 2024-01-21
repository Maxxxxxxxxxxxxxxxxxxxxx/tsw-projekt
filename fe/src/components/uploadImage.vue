<template>
  <h1>Image Upload</h1>
  <div>
    <h1>File Upload</h1>
    <form @submit.prevent="uploadFile" enctype="multipart/form-data">
      <input type="file" ref="fileInput" accept="image/*" />
      <button type="submit">Upload</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  methods: {
    async uploadFile() {
      const fileInput = this.$refs.fileInput;
      const formData = new FormData();

      if (fileInput.files.length > 0) {
        formData.append("image", fileInput.files[0]);

        try {
          const response = await axios.post(
            "https://localhost:3000/api/static/upload",
            formData
          );
          console.log(response.data);
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      } else {
        console.warn("No file selected.");
      }
    },
  },
  data() {},
};
</script>
