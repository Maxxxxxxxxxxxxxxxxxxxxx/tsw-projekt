export function resetSessionCookie() {
    // Set a new cookie with the same name, path, and an expiration date in the past
    document.cookie = "sessionId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; SameSite=None;";
  }