import React, { useEffect, useState } from "react";
import { productApi } from "../../api/productApi";
import type { Product } from "../../types/product";
import ProductDashboard from "./ProductDashboard";
import ProductCreate from "./ProductCreate";
import ProductUpdate from "./ProductUpdate";

type View = "dashboard" | "create" | "update";

type Props = {
  goDashboard: () => void;
};

const ProductPage: React.FC<Props> = ({ goDashboard }) => {
  const [view, setView] = useState<View>("dashboard");
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productApi.list();
      setProducts(data);
    } catch (err: any) {
      alert(err.message || "failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const backToDashboard = async () => {
    await loadProducts();
    setView("dashboard");
    setSelected(null);
  };

  if (view === "create") {
    return (
      <ProductCreate
        onCreated={backToDashboard}
        onCancel={backToDashboard}
      />
    );
  }

  if (view === "update" && selected) {
    return (
      <ProductUpdate
        product={selected}
        onUpdated={backToDashboard}
        onCancel={backToDashboard}
      />
    );
  }

  return (
    <div>
      <button onClick={goDashboard} style={{ marginBottom: 10 }}>
        back main dashboard
      </button>

      <ProductDashboard
        products={products}
        loading={loading}
        onCreateClick={() => setView("create")}
        onUpdateClick={(p) => {
          setSelected(p);
          setView("update");
        }}
      />
    </div>
  );
};

export default ProductPage;