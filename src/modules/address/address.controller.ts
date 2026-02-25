import { Request, Response } from "express";
import status from "http-status";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { createAddressSchema, updateAddressSchema } from "./address.validation.js";
import { AddressService } from "./address.service.js";

export const AddressController = {
    // ✅ GET /addresses
    listMine: catchAsync(async (req: Request, res: Response) => {
        const userId = AddressService.getUserId(req.user);

        const data = await AddressService.listMyAddresses(userId);

        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message: "Addresses fetched",
            data,
        });
    }),

    // ✅ POST /addresses
    create: catchAsync(async (req: Request, res: Response) => {
        const userId = AddressService.getUserId(req.user);
        const payload = createAddressSchema.parse(req.body);

        const data = await AddressService.createAddress(userId, payload as any);

        sendResponse(res, {
            statusCode: status.CREATED,
            success: true,
            message: "Address created",
            data,
        });
    }),

    // ✅ PATCH /addresses/:id
    update: catchAsync(async (req: Request, res: Response) => {
        const userId = AddressService.getUserId(req.user);
        const { id } = req.params;
        const payload = updateAddressSchema.parse(req.body);

        const data = await AddressService.updateAddress(userId, id as string, payload as any);

        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message: "Address updated",
            data,
        });
    }),

    // ✅ PATCH /addresses/:id/default
    setDefault: catchAsync(async (req: Request, res: Response) => {
        const userId = AddressService.getUserId(req.user);
        const { id } = req.params;

        const data = await AddressService.setDefault(userId, id as string);

        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message: "Default address updated",
            data,
        });
    }),

    // ✅ DELETE /addresses/:id
    remove: catchAsync(async (req: Request, res: Response) => {
        const userId = AddressService.getUserId(req.user);
        const { id } = req.params;

        await AddressService.deleteAddress(userId, id as string);

        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message: "Address deleted",
            data: null,
        });
    }),
};