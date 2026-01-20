import { Context } from "hono";
import { prisma } from "../db/prisma";
import fs from "fs";
import { writeFile, mkdir } from "node:fs/promises";
import crypto from "crypto";
import path from "path";
import z, { array } from "zod";

const statusEnum = z.enum(["draft", "active", "blocked"]);

const baseProductSchema = {
    name: z.string().min(1, "name is required"),
    description: z.string().optional(),
    price: z.coerce.number().positive("price must be positive"),
    sku: z.string().min(1, "sku is required"),
    stock: z.coerce.number().int().nonnegative("stock must be 0 or more"),
    status: statusEnum,
    imgFile: z.instanceof(File).optional(),
    pdfFile: z.instanceof(File).optional(),
    
};

const createProductSchema = z.object(baseProductSchema);
const updateProductSchema = z.object(baseProductSchema);


const uploadImageToStorage = async (imageBuffer: Buffer, imageName: string) => {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true }, (err) => {
        if (err) throw err;
    });

    const fullPath = path.join(uploadDir, imageName);
    await fs.writeFile(fullPath, imageBuffer, (err2) => {
        if (err2) throw err2;
    });

    return `/uploads/${imageName}`;

};

const uploadPdfToStorage = async (pdfBuffer: Buffer, pdfName: string) => {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, {recursive: true}, (err) => {
        if(err) throw err;
    });

    const fullPath = path.join(uploadDir, pdfName);
    await fs.writeFile(fullPath, pdfBuffer, (err2) => {
        if(err2) throw err2;
    });
    return `/uploads/${pdfName}`;
}

export const ProductService = {

    createProduct: async (data: any) => {
        let formData = new FormData();
        const parsed = createProductSchema.safeParse(data);
        if (!parsed.success) {
            throw { type: "validation", errors: parsed.error.flatten() };
        }

        const existing = await prisma.product.findUnique({
            where: { sku: parsed.data.sku },
        });

        if (existing) {
            throw { type: "duplicate", message: "sku already exists" };
        }

        let imgUrl = "";
        let pdfUrl = "";
        if (parsed.data.imgFile) {
            const arrayBuffer = await parsed.data.imgFile.arrayBuffer();
            const imgBuffer = Buffer.from(arrayBuffer);
            const imgName = crypto.randomUUID() + path.extname(parsed.data.imgFile.name);
            imgUrl = await uploadImageToStorage(imgBuffer, imgName);
        }
        if(parsed.data.pdfFile) {
            const arrayBuffer = await parsed.data.pdfFile.arrayBuffer();
            const pdfBuffer = Buffer.from(arrayBuffer);
            const pdfName = crypto.randomUUID() + path.extname(parsed.data.pdfFile.name);
            pdfUrl = await uploadPdfToStorage(pdfBuffer, pdfName);
        }

        return prisma.product.create({
            data: {
                name: parsed.data.name,
                description: parsed.data.description,
                price: parsed.data.price,
                sku: parsed.data.sku,
                stock: parsed.data.stock,
                status: parsed.data.status,
                imgUrl,
                pdfUrl,
            }
        });
    },

    getProducts: async () => {
        return prisma.product.findMany();
    },


    getProductById: async (id: number) => {
        return prisma.product.findUnique({ where: { id } });
    },


    updateProduct: async (id: number, data: any) => {
        const parsed = updateProductSchema.safeParse(data);
        if (!parsed.success) {
            throw { type: "validation", errors: parsed.error.flatten() };
        }

        const existing = await prisma.product.findUnique({
            where: { sku: parsed.data.sku },
        });

        if (existing && existing.id !== id) {
            throw { type: "duplicate", message: "sku is already exists" };
        }

        let imgUrl = "";
        let pdfUrl = "";
        if (parsed.data.imgFile) {
            const arrayBuffer = await parsed.data.imgFile.arrayBuffer();
            const imgBuffer = Buffer.from(arrayBuffer);
            const imgName = crypto.randomUUID() + path.extname(parsed.data.imgFile.name);
            imgUrl = await uploadImageToStorage(imgBuffer, imgName);
        }

        if(parsed.data.pdfFile) {
            const arrayBuffer = await parsed.data.pdfFile.arrayBuffer();
            const pdfBuffer = Buffer.from(arrayBuffer);
            const pdfName = crypto.randomUUID() + path.extname(parsed.data.pdfFile.name);
            pdfUrl = await uploadPdfToStorage(pdfBuffer, pdfName);
        }

        return prisma.product.update({
            where: {id},
            data: {
                name: parsed.data.name,
                description: parsed.data.description,
                price: parsed.data.price,
                sku: parsed.data.sku,
                stock: parsed.data.stock,
                status: parsed.data.status,
                imgUrl,
                pdfUrl,
            }
        });
    },

    deleteProduct: async (id: number) => {
        return prisma.product.delete({
            where: { id },
        });
    },
}