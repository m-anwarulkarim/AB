import { CreateAddressInput, UpdateAddressInput } from "./address.type.js";
declare function getUserId(reqUser: Express.Request["user"]): string;
export declare const AddressService: {
    getUserId: typeof getUserId;
    listMyAddresses(userId: string): Promise<{
        id: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        label: string | null;
        fullName: string;
        district: string | null;
        upazila: string | null;
        area: string | null;
        addressLine: string;
        isDefault: boolean;
    }[]>;
    createAddress(userId: string, payload: CreateAddressInput): Promise<any>;
    updateAddress(userId: string, addressId: string, payload: UpdateAddressInput): Promise<any>;
    setDefault(userId: string, addressId: string): Promise<any>;
    deleteAddress(userId: string, addressId: string): Promise<null>;
};
export {};
//# sourceMappingURL=address.service.d.ts.map