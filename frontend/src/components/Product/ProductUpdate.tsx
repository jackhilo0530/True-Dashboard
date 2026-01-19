const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";
import React from "react";
import type { Product } from "../../types/product";

type Props = {
    product: Product;
    onUpdated: () => void;
    onCancel: () => void;
};

const ProductUpdate: React.FC<Props> = ({ product, onUpdated, onCancel }) => {
    const [error, setError] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);

    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
    const [pickedFile, setPickedFile] = React.useState<File | null>(null);

    const getAuthHeaders = () => {
        const token = localStorage.getItem("token");
        return {
            "Authorization": token ? `Bearer ${token}` : "",
        };
    };

    // if product changes (switching rows), clear preview
    React.useEffect(() => {
        setPreviewUrl(null);
        setPickedFile(null);
        setError(null);
    }, [product?.id]);

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] ?? null;
        setPickedFile(f);

        if (!f) {
            setPreviewUrl(null);
            return;
        }

        const url = URL.createObjectURL(f);
        setPreviewUrl(url);
    };

    // cleanup object url
    React.useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const form = e.currentTarget;
            const fd = new FormData(form);

            // if user did not pick a new image, do not send img field
            if (!pickedFile || pickedFile.size === 0) {
                fd.delete("imgFile");
            }

            const res = await fetch(`${API_BASE}/api/product/${product.id}`, {
                method: "PUT", // or "PATCH" if your backend uses patch
                body: fd,
                headers: getAuthHeaders(),
                // do not set content-type manually for formdata
            });

            const contentType = res.headers.get("content-type") || "";
            const payload = contentType.includes("application/json")
                ? await res.json().catch(() => null)
                : await res.text().catch(() => "");

            if (!res.ok) {
                const msg =
                    typeof payload === "string"
                        ? payload
                        : payload?.message || "failed to update product";
                setError(msg);
                return;
            }

            form.reset();
            setPreviewUrl(null);
            setPickedFile(null);
            onUpdated?.();
        } catch (err: any) {
            setError(err?.message ?? "unexpected error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 520 }}>
            <h2>update product</h2>

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
                            <input type="text" name="name" defaultValue={product.name} required />
                        </label>
                    </div>

                    <div>
                        <label>
                            description
                            <input name="description" defaultValue={product.description ?? ""} />
                        </label>
                    </div>

                    <div>
                        <label>
                            price
                            <input
                                type="number"
                                name="price"
                                step="0.01"
                                min="0"
                                defaultValue={String(product.price)}
                                required
                            />
                        </label>
                    </div>

                    <div>
                        <label>
                            sku
                            <input type="text" name="sku" defaultValue={product.sku} required />
                        </label>
                    </div>

                    <div>
                        <label>
                            stock
                            <input
                                type="number"
                                name="stock"
                                step="1"
                                min="0"
                                defaultValue={String(product.stock)}
                                required
                            />
                        </label>
                    </div>

                    <div>
                        <label>
                            status
                            <select name="status" defaultValue={product.status} required>
                                <option value="draft">draft</option>
                                <option value="active">active</option>
                                <option value="blocked">blocked</option>
                            </select>
                        </label>
                    </div>

                    <div style={{ marginTop: 10, marginBottom: 12 }}>
                        <div style={{ marginBottom: 8 }}>image</div>

                        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
                            <div>
                                <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>current</div>
                                {product.imgUrl ? (
                                    <img
                                        src={`${API_BASE}${product.imgUrl}`}
                                        alt="current"
                                        style={{
                                            width: 120,
                                            height: 120,
                                            objectFit: "cover",
                                            border: "1px solid #ccc",
                                            borderRadius: 6,
                                        }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            width: 120,
                                            height: 120,
                                            display: "grid",
                                            placeItems: "center",
                                            border: "1px solid #ccc",
                                            borderRadius: 6,
                                            opacity: 0.7,
                                        }}
                                    >
                                        no image
                                    </div>
                                )}
                            </div>

                            <div>
                                <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>new preview</div>
                                {previewUrl ? (
                                    <img
                                        src={previewUrl}
                                        alt="new preview"
                                        style={{
                                            width: 120,
                                            height: 120,
                                            objectFit: "cover",
                                            border: "1px solid #ccc",
                                            borderRadius: 6,
                                        }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            width: 120,
                                            height: 120,
                                            display: "grid",
                                            placeItems: "center",
                                            border: "1px solid #ccc",
                                            borderRadius: 6,
                                            opacity: 0.7,
                                        }}
                                    >
                                        unchanged
                                    </div>
                                )}
                            </div>
                        </div>

                        <input name="img" type="file" accept="image/*" onChange={onFileChange} />
                        <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
                            leave empty to keep current image
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: 8 }}>
                        <button type="submit">{loading ? "updating..." : "update"}</button>
                        <button type="button" onClick={onCancel}>
                            cancel
                        </button>
                    </div>
                </fieldset>
            </form>
        </div>
    );
};

export default ProductUpdate;