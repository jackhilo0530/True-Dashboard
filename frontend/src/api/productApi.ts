const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";
import type { Product} from "../types/product";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    authorization: token ? `Bearer ${token}` : "",
  };
};

export const productApi = {
  async list(): Promise<Product[]> {
    const res = await fetch(`${API_BASE }/api/product`, {
      headers: getAuthHeaders(),
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(body.message || "failed to fetch products");
    }

    return body;
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/api/product/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });
    if(!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "failed to delete");
    }
  }

};