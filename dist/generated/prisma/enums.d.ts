export declare const OrderStatus: {
    readonly PENDING: "PENDING";
    readonly CONFIRMED: "CONFIRMED";
    readonly SHIPPED: "SHIPPED";
    readonly DELIVERED: "DELIVERED";
    readonly CANCELLED: "CANCELLED";
};
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
export declare const PaymentMethod: {
    readonly CASH_ON_DELIVERY: "CASH_ON_DELIVERY";
};
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];
export declare const USER_STATUS: {
    readonly ACTIVE: "ACTIVE";
    readonly BANNED: "BANNED";
    readonly SUSPENDED: "SUSPENDED";
};
export type USER_STATUS = (typeof USER_STATUS)[keyof typeof USER_STATUS];
export declare const UserRole: {
    readonly USER: "USER";
    readonly ADMIN: "ADMIN";
};
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
//# sourceMappingURL=enums.d.ts.map