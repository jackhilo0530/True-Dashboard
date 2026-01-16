const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
export const signupApi = async (name: string, email: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(body.message || "failed to fetch products");
    }

    return body;
};

export const loginApi = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(body.message || "failed to fetch products");
    }

    return body;
};
