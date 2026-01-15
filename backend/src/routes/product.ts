import {Hono} from "hono";
import { ProductController } from "../controllers/product.controller";

const product = new Hono();

product.post("/", ProductController.createProduct);

product.get("/", ProductController.getProducts);

product.get("/:id", ProductController.getProductById);

product.put("/:id", ProductController.updateProduct);

product.delete("/:id", ProductController.deleteProduct);

export default product;