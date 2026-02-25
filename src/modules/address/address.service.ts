import status from "http-status";
import AppError from "../../utils/AppError.js";
import { prisma } from "../../lib/prisma.js";
import { CreateAddressInput, UpdateAddressInput } from "./address.type.js";

function getUserId(reqUser: Express.Request["user"]): string {
    if (!reqUser?.id) throw new AppError(status.UNAUTHORIZED, "Unauthorized - Please login");
    return reqUser.id;
}

export const AddressService = {
    getUserId,

    // ✅ GET /addresses
    async listMyAddresses(userId: string) {
        return prisma.address.findMany({
            where: { userId },
            orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
        });
    },

    // ✅ POST /addresses
    // ✅ POST /addresses
    async createAddress(userId: string, payload: CreateAddressInput) {
        const wantsDefault = payload.isDefault ?? false;

        const created = await prisma.$transaction(async (tx: any) => {
            const existingCount = await tx.address.count({ where: { userId } });

            // ✅ first address -> auto default
            const makeDefault = existingCount === 0 ? true : wantsDefault;

            if (makeDefault) {
                await tx.address.updateMany({
                    where: { userId, isDefault: true },
                    data: { isDefault: false },
                });
            }

            return tx.address.create({
                data: {
                    userId,
                    fullName: payload.fullName,
                    phone: payload.phone,
                    addressLine: payload.addressLine,

                    ...(payload.label !== undefined ? { label: payload.label } : {}),
                    ...(payload.district !== undefined ? { district: payload.district } : {}),
                    ...(payload.upazila !== undefined ? { upazila: payload.upazila } : {}),
                    ...(payload.area !== undefined ? { area: payload.area } : {}),
                    ...(makeDefault ? { isDefault: true } : {}),
                },
            });
        });

        return created;
    },

    // ✅ PATCH /addresses/:id
    async updateAddress(userId: string, addressId: string, payload: UpdateAddressInput) {
        const existing = await prisma.address.findFirst({
            where: { id: addressId, userId },
            select: { id: true, isDefault: true },
        });

        if (!existing) {
            throw new AppError(status.NOT_FOUND, "Address not found");
        }

        const wantsDefault = payload.isDefault === true;

        const updated = await prisma.$transaction(async (tx: any) => {
            if (wantsDefault) {

                await tx.address.updateMany({
                    where: { userId, isDefault: true },
                    data: { isDefault: false },
                });
            }

            return tx.address.update({
                where: { id: addressId },
                data: {
                    ...(payload.label !== undefined ? { label: payload.label } : {}),
                    ...(payload.fullName !== undefined ? { fullName: payload.fullName } : {}),
                    ...(payload.phone !== undefined ? { phone: payload.phone } : {}),
                    ...(payload.district !== undefined ? { district: payload.district } : {}),
                    ...(payload.upazila !== undefined ? { upazila: payload.upazila } : {}),
                    ...(payload.area !== undefined ? { area: payload.area } : {}),
                    ...(payload.addressLine !== undefined ? { addressLine: payload.addressLine } : {}),
                    ...(wantsDefault ? { isDefault: true } : {}),
                },
            });
        });

        return updated;
    },

    // ✅ PATCH /addresses/:id/default
    async setDefault(userId: string, addressId: string) {
        const existing = await prisma.address.findFirst({
            where: { id: addressId, userId },
            select: { id: true },
        });

        if (!existing) {
            throw new AppError(status.NOT_FOUND, "Address not found");
        }

        const updated = await prisma.$transaction(async (tx: any) => {
            await tx.address.updateMany({
                where: { userId, isDefault: true },
                data: { isDefault: false },
            });

            return tx.address.update({
                where: { id: addressId },
                data: { isDefault: true },
            });
        });

        return updated;
    },

    // ✅ DELETE /addresses/:id
    async deleteAddress(userId: string, addressId: string) {
        const existing = await prisma.address.findFirst({
            where: { id: addressId, userId },
            select: { id: true, isDefault: true },
        });

        if (!existing) {
            throw new AppError(status.NOT_FOUND, "Address not found");
        }

        await prisma.$transaction(async (tx: any) => {
            await tx.address.delete({ where: { id: addressId } });

            // ✅ if deleted one was default, set another as default (if exists)
            if (existing.isDefault) {
                const next = await tx.address.findFirst({
                    where: { userId },
                    orderBy: { createdAt: "desc" },
                    select: { id: true },
                });

                if (next) {
                    await tx.address.update({
                        where: { id: next.id },
                        data: { isDefault: true },
                    });
                }
            }
        });

        return null;
    }
};