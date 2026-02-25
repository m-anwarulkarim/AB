import { prisma } from "../../lib/prisma.js";
import status from "http-status";
import AppError from "../../utils/AppError.js";
export const ComboService = {
    // ✅ Public: GET /combos (only isActive)
    async listActiveCombos() {
        const data = await prisma.combo.findMany({
            where: { isActive: true },
            orderBy: { createdAt: "desc" },
            include: { items: true },
        });
        return data;
    },
    // ✅ Public: GET /combos/:slug
    async getComboBySlug(slug) {
        const data = await prisma.combo.findUnique({
            where: { slug },
            include: { items: true },
        });
        // Public route: inactive combo hide
        if (!data || data.isActive === false) {
            throw new AppError(status.NOT_FOUND, "Combo not found");
        }
        return data;
    },
    // ✅ Admin: POST /admin/combos
    async createCombo(payload) {
        const existing = await prisma.combo.findUnique({
            where: { slug: payload.slug },
            select: { id: true },
        });
        if (existing) {
            throw new AppError(status.CONFLICT, "Slug already exists");
        }
        const { items, ...comboData } = payload;
        const data = await prisma.combo.create({
            data: {
                ...comboData,
                stock: comboData.stock ?? 0,
                isActive: comboData.isActive ?? true,
                // ✅ exactOptionalPropertyTypes safe: items না থাকলে key-ই যাবে না
                ...(items?.length
                    ? {
                        items: {
                            create: items.map((i) => ({
                                name: i.name,
                                quantity: i.quantity,
                                // ✅ note undefined হলে field omit হবে
                                ...(i.note !== undefined ? { note: i.note } : {}),
                                // চাইলে null রাখতে:
                                // note: i.note ?? null,
                            })),
                        },
                    }
                    : {}),
            },
            include: { items: true },
        });
        return data;
    },
    // ✅ Admin: PATCH /admin/combos/:id
    async updateComboById(id, payload) {
        const exists = await prisma.combo.findUnique({
            where: { id },
            select: { id: true },
        });
        if (!exists) {
            throw new AppError(status.NOT_FOUND, "Combo not found");
        }
        // slug update করলে uniqueness check (if provided)
        if (payload.slug) {
            const slugTaken = await prisma.combo.findFirst({
                where: { slug: payload.slug, NOT: { id } },
                select: { id: true },
            });
            if (slugTaken) {
                throw new AppError(status.CONFLICT, "Slug already exists");
            }
        }
        const { items, ...comboData } = payload;
        const data = await prisma.$transaction(async (tx) => {
            // items দিলে: পুরোনো সব items delete করে নতুনগুলো insert (replace strategy)
            if (items) {
                await tx.comboItem.deleteMany({ where: { comboId: id } });
            }
            return tx.combo.update({
                where: { id },
                data: {
                    ...comboData,
                    // ✅ exactOptionalPropertyTypes safe: items না থাকলে key-ই যাবে না
                    ...(items
                        ? {
                            items: {
                                create: items.map((i) => ({
                                    name: i.name,
                                    quantity: i.quantity,
                                    // ✅ note undefined হলে field omit হবে
                                    ...(i.note !== undefined ? { note: i.note } : {}),
                                    // চাইলে null রাখতে:
                                    // note: i.note ?? null,
                                })),
                            },
                        }
                        : {}),
                },
                include: { items: true },
            });
        });
        return data;
    },
    // ✅ Admin: PATCH /admin/combos/:id/toggle
    async toggleComboActive(id) {
        const combo = await prisma.combo.findUnique({
            where: { id },
            select: { id: true, isActive: true },
        });
        if (!combo) {
            throw new AppError(status.NOT_FOUND, "Combo not found");
        }
        const data = await prisma.combo.update({
            where: { id },
            data: { isActive: !combo.isActive },
            include: { items: true },
        });
        return data;
    },
    // ✅ Admin: PATCH /admin/combos/:id/stock
    async updateStock(id, stock) {
        const exists = await prisma.combo.findUnique({
            where: { id },
            select: { id: true },
        });
        if (!exists) {
            throw new AppError(status.NOT_FOUND, "Combo not found");
        }
        const data = await prisma.combo.update({
            where: { id },
            data: { stock },
            include: { items: true },
        });
        return data;
    },
    // ✅ Admin: PATCH /admin/combos/:id/price
    async updatePrice(id, price) {
        const exists = await prisma.combo.findUnique({
            where: { id },
            select: { id: true },
        });
        if (!exists) {
            throw new AppError(status.NOT_FOUND, "Combo not found");
        }
        const data = await prisma.combo.update({
            where: { id },
            data: { price },
            include: { items: true },
        });
        return data;
    },
};
//# sourceMappingURL=combo.service.js.map