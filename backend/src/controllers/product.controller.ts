import { Context } from "hono";
import { ProductService } from "../services/product.service";

const parseId = (c: Context) => {
    const id = Number(c.req.param("id"));
    if (Number.isNaN(id) || id <= 0) {
        throw new Error("invalid id");
    }
    return id;
};


export const ProductController = {
    createProduct: async (c: Context) => {
        try {
            const body = await c.req.json();
            const product = await ProductService.createProduct(body);
            return c.json(product, 201)
        } catch (err: any) {
            if (err.type === "validation") {
                return c.json(
                    {
                        message: "validation error",
                        errors: err.errors,
                    },
                    400
                );
            }

            if (err.type === "duplicate") {
                return c.json(
                    {
                        message: err.message || "sku already exists",
                    },
                    409
                );
            }

            console.error(err);
            return c.json({ message: "internal server error" }, 500);
        }
    },

    getProducts: async (c: Context) => {
        try {
            const products = await ProductService.getProducts();
            return c.json(products);
        } catch (err) {
            console.error(err);
            return c.json({ message: "internal server error" }, 500);
        }
    },

    getProductById: async (c: Context) => {
        try {
            const id = parseId(c);
            const product = await ProductService.getProductById(id);

            if (!product) {
                return c.json({ message: "product not found" }, 404);
            }

            return c.json(product);
        } catch (err) {
            console.error(err);
            return c.json({ message: "invalid id" }, 400);
        }
    },

    updateProduct: async (c: Context) => {
        try {
            const id = parseId(c);
            const body = await c.req.json();

            const updated = await ProductService.updateProduct(id, body);
            return c.json(updated);
        } catch (err: any) {
            if (err.type === "validation") {
                return c.json(
                    {
                        message: "validation error",
                        errors: err.errors,
                    },
                    400
                );
            }

            if (err.type === "duplicate") {
                return c.json(
                    {
                        message: err.message || "sku is already exists",
                    },
                    409
                );
            }

            if (err.code === "P2025") {
                return c.json({ message: "product not found" }, 404);
            }

            console.error(err);
            return c.json({ message: "internal server error" }, 500)
        }
    },

    deleteProduct: async (c: Context) => {
        try {
            const id = parseId(c);

            const deleted = await ProductService.deleteProduct(id);
            return c.json(deleted);
        } catch (err: any) {
            if (err.code === "P2025") {
                return c.json({ message: "product not found" }, 404);
            }

            console.error(err);
            return c.json({ message: "internal server error" }, 500);
        }
    },
};