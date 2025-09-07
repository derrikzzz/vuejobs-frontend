const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const loginAPI = async ({ email, password }) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();
    return {
      token: data.token,
      user: data.user,
    };
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const registerAPI = async ({ name, email, password }) => {
  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Registration failed with status ${response.status}`
      );
    }

    const data = await response.json();
    return {
      token: data.token,
      user: data.user,
    };
  } catch (error) {
    console.error("Error registering:", error);
    throw error;
  }
};

export const fetchMeAPI = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();
    return { user: data.user };
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};
