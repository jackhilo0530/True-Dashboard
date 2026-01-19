const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";
import React from "react";
import type { Product } from "../../types/product";
import { productApi } from "../../api/productApi";

type Props = {
    loading?: boolean;
    onCreateClick: () => void;
    onUpdateClick: (product: Product) => void;
};

const ProductDashboard: React.FC<Props> = ({ loading: loadingProp, onCreateClick, onUpdateClick }) => {
    const [items, setItems] = React.useState<Product[]>([]);
    const [loading, setLoading] = React.useState<boolean>(!!loadingProp);

    const load = React.useCallback(async () => {
        setLoading(true);
        try {
            const list = await productApi.list();
            setItems(list);
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        load();
    }, [load]);

    const onDelete = async (id: number) => {
        if (!confirm("delete this product?")) return;
        await productApi.delete(id);
        // option a: reload from server
        await load();
        // option b: local update (faster)
        // setItems((prev) => prev.filter((p) => p.id !== id));
    };

    return (
        <div style={{ padding: 16 }}>
            <h2>product dashboard</h2>

            <div style={{ marginBottom: 12 }}>
                <button onClick={onCreateClick}>create</button>
            </div>

            {loading && <p>loading...</p>}

            {!loading && items.length > 0 && (
                <table style={{ borderCollapse: "collapse", width: "100%" }}>
                    <thead>
                        <tr>
                            <th style={th}>id</th>
                            <th style={th}>name</th>
                            <th style={th}>image</th>
                            <th style={th}>description</th>
                            <th style={th}>price</th>
                            <th style={th}>sku</th>
                            <th style={th}>stock</th>
                            <th style={th}>status</th>
                            <th style={th}>action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {items.map((p) => (
                            <tr key={p.id}>
                                <td style={td}>{p.id}</td>
                                <td style={td}>{p.name}</td>
                                <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>
                                    {p.imgUrl ? (
                                        <img
                                            src={`${API_BASE}${p.imgUrl}`}
                                            alt={p.name}
                                            style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 6 }}
                                        />
                                    ) : (
                                        <span>-</span>
                                    )}
                                </td>
                                <td style={td}>{p.description}</td>
                                <td style={td}>{p.price}</td>
                                <td style={td}>{p.sku}</td>
                                <td style={td}>{p.stock}</td>
                                <td style={td}>{p.status}</td>
                                <td style={td}>
                                    <button onClick={() => onUpdateClick(p)}>update</button>
                                    <button onClick={() => onDelete(p.id)}>delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {!loading && items.length === 0 && <p>no products</p>}
        </div>
    );
};

const th: React.CSSProperties = { border: "1px solid #ccc", padding: 8 };
const td: React.CSSProperties = { border: "1px solid #ccc", padding: 8 };

export default ProductDashboard;