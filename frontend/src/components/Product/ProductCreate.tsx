const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";
import React, { useState } from "react";

type Props = {
  onCreated: () => void;
  onCancel: () => void;
};

const ProductCreate: React.FC<Props> = ({ onCreated, onCancel }) => {
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // optional: image preview
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const fd = new FormData(form);

    // validate file field
    const img = fd.get("imgFile");
    if (!img || !(img instanceof File) || img.size === 0) {
      setError("image file is required");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/product`, {
        method: "POST",
        body: fd,
        // do NOT set content-type for formdata
      })
      
      // read response safely (json or text)
      const contentType = res.headers.get("content-type") || "";
      const payload = contentType.includes("application/json")
        ? await res.json().catch(() => null)
        : await res.text().catch(() => "");

      if (!res.ok) {
        const msg =
          typeof payload === "string"
            ? payload
            : payload?.message || "failed to create product";
        setError(msg);
        return;
      }

      // success
      console.log("created:", payload);

      form.reset();
      setPreviewUrl(null);
      onCreated?.();
    } catch (err: any) {
      setError(err?.message ?? "unexpected error");
    } finally {
      setLoading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
  };

  return (
    <div style={{ maxWidth: 520 }}>
      <h2>create product</h2>

      {error && (
        <div style={{ padding: 12, marginBottom: 12, border: "1px solid #ccc" }}>
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} encType="multipart/form-data">
        <fieldset disabled={loading} style={{ border: "none", padding: 0, margin: 0 }}>
          <div>
            <label>
              name
              <input type="text" name="name" required />
            </label>
          </div>

          <div>
            <label>
              description
              <input name="description" />
            </label>
          </div>

          <div>
            <label>
              price
              <input type="number" name="price" step="0.01" min="0" required />
            </label>
          </div>

          <div>
            <label>
              sku
              <input type="text" name="sku" required />
            </label>
          </div>

          <div>
            <label>
              stock
              <input type="number" name="stock" step="1" min="0" required />
            </label>
          </div>

          <div>
            <label>
              status
              <select name="status" defaultValue="draft" required>
                <option value="draft">draft</option>
                <option value="active">active</option>
                <option value="blocked">blocked</option>
              </select>
            </label>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>
              image
              <input
                name="imgFile"
                type="file"
                accept="image/*"
                required
                onChange={onFileChange}
              />
            </label>
          </div>

          {previewUrl && (
            <div style={{ marginBottom: 12 }}>
              <img
                src={previewUrl}
                alt="preview"
                style={{ width: 160, height: 160, objectFit: "cover", border: "1px solid #ccc" }}
              />
            </div>
          )}

          <div style={{ display: "flex", gap: 8 }}>
            <button type="submit">
              {loading ? "creating..." : "create"}
            </button>

            <button type="button" onClick={onCancel}>
              cancel
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default ProductCreate;