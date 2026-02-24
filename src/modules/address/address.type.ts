export type CreateAddressInput = {
    label?: string;
    fullName: string;
    phone: string;
    district?: string;
    upazila?: string;
    area?: string;
    addressLine: string;
    isDefault?: boolean;
};

export type UpdateAddressInput = Partial<CreateAddressInput>;

export type SetDefaultAddressInput = {
    isDefault: true;
};