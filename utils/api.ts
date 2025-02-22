// Login: Use your Next.js API route as a proxy.
export const login = async (username: string, password: string) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return await response.json();
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem("token"); // Retrieve stored token
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch("/api/auth/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    credentials: "include",
  });

  return await response.json();
};


// Refresh Auth Session: Use your API route.
export const refreshAuthSession = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return null;

  const response = await fetch("/api/auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
    credentials: "include",
  });

  const data = await response.json();
  if (data.accessToken) {
    localStorage.setItem("token", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
  }
  return data;
};

// Registration: Use your API route to register the user.
export const register = async ({
  name,
  username,
  email,
  password,
}: {
  name: string;
  username: string;
  email: string;
  password: string;
}) => {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, username, email, password }),
  });
  return await response.json();
};

// Fetch Profile: Get the current user (by calling getCurrentUser).
export const fetchProfile = async () => {
  return await getCurrentUser();
};

// fetchWithAuth: Helper to make requests with authentication,
// automatically refreshing the token if needed.
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  let token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found. User must log in.");
  }

  // Merge any existing headers with the Authorization header
  const headers = {
    ...((options.headers as Record<string, string>) || {}),
    Authorization: `Bearer ${token}`,
  };

  let response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token expired, try to refresh
    const refreshData = await refreshAuthSession();
    if (refreshData?.accessToken) {
      token = refreshData.accessToken;
      const newHeaders = {
        ...((options.headers as Record<string, string>) || {}),
        Authorization: `Bearer ${token}`,
      };
      response = await fetch(url, {
        ...options,
        headers: newHeaders,
      });
    } else {
      throw new Error("Session expired. Please log in again.");
    }
  }

  return await response.json();
};

// Simulated endpoints below (return dummy data).

export const getRideHistory = async () => {
  // Simulated response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        rides: [
          { pickup: "Location A", destination: "Location B", date: "2025-02-20", fare: 25 },
          { pickup: "Location C", destination: "Location D", date: "2025-02-18", fare: 30 },
        ],
      });
    }, 500);
  });
};

export const processPayment = async (paymentInfo: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: "Payment processed successfully" });
    }, 500);
  });
};

export const submitFeedback = async (feedback: { rating: number; comment: string }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: "Feedback submitted" });
    }, 500);
  });
};

export const getLoyaltyInfo = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ points: 120, discount: 10 });
    }, 500);
  });
};
