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

    // image
    const [imgPreviewUrl, setImgPreviewUrl] = React.useState<string | null>(null);
    const [pickedImgFile, setPickedImgFile] = React.useState<File | null>(null);

    // pdf
    const [pickedPdfFile, setPickedPdfFile] = React.useState<File | null>(null);

    const getAuthHeaders = (): Record<string, string> => {
        const token = localStorage.getItem("token");
        if (!token) return {};
        return { Authorization: `Bearer ${token}` };
    };
    // if product changes (switching rows), clear previews
    React.useEffect(() => {
        setImgPreviewUrl(null);
        setPickedImgFile(null);
        setPickedPdfFile(null);
        setError(null);
    }, [product?.id]);

    const onImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] ?? null;
        setPickedImgFile(f);

        if (!f) {
            setImgPreviewUrl(null);
            return;
        }

        const url = URL.createObjectURL(f);
        setImgPreviewUrl(url);
    };

    const onPdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] ?? null;
        setPickedPdfFile(f);
    };

    // cleanup object url
    React.useEffect(() => {
        return () => {
            if (imgPreviewUrl) URL.revokeObjectURL(imgPreviewUrl);
        };
    }, [imgPreviewUrl]);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const form = e.currentTarget;
            const fd = new FormData(form);

            // important: if user did not pick new image/pdf, do not send those fields
            if (!pickedImgFile || pickedImgFile.size === 0) {
                fd.delete("imgFile");
            }
            if (!pickedPdfFile || pickedPdfFile.size === 0) {
                fd.delete("pdfFile");
            }

            const res = await fetch(`${API_BASE}/api/product/${product.id}`, {
                method: "PUT", // or patch if your backend uses patch
                body: fd,
                headers: getAuthHeaders(),
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
            setImgPreviewUrl(null);
            setPickedImgFile(null);
            setPickedPdfFile(null);
            onUpdated?.();
        } catch (err: any) {
            setError(err?.message ?? "unexpected error");
        } finally {
            setLoading(false);
        }
    };

    const currentPdfUrl = product.pdfUrl ? `${API_BASE}${product.pdfUrl}` : null;

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

                    {/* image */}
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
                                {imgPreviewUrl ? (
                                    <img
                                        src={imgPreviewUrl}
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

                        {/* important: name must match what backend expects and what we fd.delete(...) */}
                        <input name="imgFile" type="file" accept="image/*" onChange={onImgChange} />
                        <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
                            leave empty to keep current image
                        </div>
                    </div>

                    {/* pdf */}
                    <div style={{ marginTop: 10, marginBottom: 12 }}>
                        <div style={{ marginBottom: 8 }}>pdf</div>

                        <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>current</div>
                        {currentPdfUrl ? (
                            <a href={currentPdfUrl} target="_blank" rel="noreferrer">
                                view current pdf
                            </a>
                        ) : (
                            <div style={{ opacity: 0.7 }}>no pdf</div>
                        )}

                        <div style={{ marginTop: 8 }}>
                            <input
                                name="pdfFile"
                                type="file"
                                accept="application/pdf,.pdf"
                                onChange={onPdfChange}
                            />
                        </div>

                        {pickedPdfFile ? (
                            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
                                new pdf: {pickedPdfFile.name}
                            </div>
                        ) : (
                            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
                                leave empty to keep current pdf
                            </div>
                        )}
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