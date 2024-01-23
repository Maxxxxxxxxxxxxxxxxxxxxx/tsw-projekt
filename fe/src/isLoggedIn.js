import axios from "axios";

async function isLoggedIn() {
  try {
    const res = await axios.get("https://localhost:3000/api/auth/", {
      withCredentials: true,
    });
    return res.data;
  } catch {
    return false;
  }
}

export default isLoggedIn;

// if (sessionIdExists) {
//   console.log("sessionId cookie is assigned.");
// } else {
//   console.log("sessionId cookie is not assigned.");
// }
