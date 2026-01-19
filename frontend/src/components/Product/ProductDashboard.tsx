const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";
import React from "react";
import type { Product } from "../../types/product";
import {productApi} from "../../api/productApi"

type Props = {
    products: Product[];
    loading: boolean;
    onCreateClick: () => void;
    onUpdateClick: (product: Product) => void;
};

const load = async () => {
    await productApi.list();
}

const onDelete = async(id: number) => {
    if(!confirm("delete this product?")) return;
    await productApi.delete(id);
    await load();
}

const ProductDashboard: React.FC<Props> = ({
    products,
    loading,
    onCreateClick,
    onUpdateClick,
}) => {
    return (
        <div style={{ padding: 16 }}>
            <h2>product dashboard</h2>

            <div style={{ marginBottom: 12 }}>
                <button onClick={onCreateClick}>create</button>
            </div>

            {loading && <p>loading...</p>}
            {/* {(() => { console.log('This is a log inside return'); return null; })()} */}
            {!loading && products.length > 0 && (
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
                        {products.map((p) => (
                            <tr key={p.id}>
                                <td style={td}>{p.id}</td>
                                <td style={td}>{p.name}</td>
                                <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>
                                    {p.imgUrl ? (
                                        <img
                                            src={`${API_BASE}/${p.imgUrl}`}
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
        </div>
    );
};

const th: React.CSSProperties = { border: "1px solid #ccc", padding: 8 };
const td: React.CSSProperties = { border: "1px solid #ccc", padding: 8 };

export default ProductDashboard;