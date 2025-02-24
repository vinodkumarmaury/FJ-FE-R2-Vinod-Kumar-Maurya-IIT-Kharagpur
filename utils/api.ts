// Add these interfaces at the top of the file
interface Profile {
  name: string;
  email: string;
  username: string;
  totalRides: number;
  phoneNumber: string;
  address: string;
  preferences: {
    rideSharing: boolean;
    paymentSplitting: boolean;
  };
}

interface RideShare {
  rideId: string;
  participants: string[];
  splitType: 'equal' | 'custom';
  customSplits?: { [userId: string]: number };
}

interface RideDetails {
  id: string;
  pickup: string;
  destination: string;
  date: string;
  fare: number;
  driver: {
    name: string;
    rating: number;
    photo: string;
  };
  isShared: boolean;
  participants?: {
    name: string;
    contribution: number;
  }[];
}

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

export const initiateRideSharing = async (rideShare: RideShare) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        rideId: rideShare.rideId,
        splitDetails: rideShare.participants.map(p => ({
          userId: p,
          amount: rideShare.splitType === 'equal' 
            ? 100 / rideShare.participants.length 
            : rideShare.customSplits?.[p] || 0
        }))
      });
    }, 500);
  });
};

export const getRideHistory = async (): Promise<{ data: { rides: RideDetails[] } }> => {
  // Enhanced mock data with driver details and sharing information
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          rides: [
            {
              id: "1",
              pickup: "Location A",
              destination: "Location B",
              date: "2025-02-20",
              fare: 25,
              driver: {
                name: "John Smith",
                rating: 4.8,
                photo: "driver1.jpg"
              },
              isShared: true,
              participants: [
                { name: "User 1", contribution: 12.5 },
                { name: "User 2", contribution: 12.5 }
              ]
            },
            {
              id: "2",
              pickup: "Location C",
              destination: "Location D",
              date: "2025-02-18",
              fare: 30,
              driver: {
                name: "Jane Doe",
                rating: 4.9,
                photo: "driver2.jpg"
              },
              isShared: false
            }
          ]
        }
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

export const updateProfile = async (profile: Profile): Promise<{ success: true, profile: Profile }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        profile: {
          ...profile,
          totalRides: profile.totalRides + 1 // Increment total rides
        }
      });
    }, 500);
  });
};
