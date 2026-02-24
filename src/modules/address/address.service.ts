import status from "http-status";
import AppError from "../../utils/AppError";
import { prisma } from "../../lib/prisma";
import { CreateAddressInput, UpdateAddressInput } from "./address.type";

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
    async createAddress(userId: string, payload: CreateAddressInput) {
        const wantsDefault = payload.isDefault ?? false;

        const created = await prisma.$transaction(async (tx) => {
            if (wantsDefault) {
                // make others non-default
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
                    ...(wantsDefault ? { isDefault: true } : {}),
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

        const updated = await prisma.$transaction(async (tx) => {
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

        const updated = await prisma.$transaction(async (tx) => {
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
            select: { id: true },
        });

        if (!existing) {
            throw new AppError(status.NOT_FOUND, "Address not found");
        }

        // Important: Order.addressId has onDelete SetNull, so safe
        await prisma.address.delete({ where: { id: addressId } });

        return null;
    },
};