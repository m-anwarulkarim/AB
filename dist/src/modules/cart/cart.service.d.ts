import { AddToCartInput, UpdateCartItemQtyInput } from "./cart.type.js";
declare function getUserIdFromReqUser(reqUser: unknown): string;
export declare const CartService: {
    getMyCart(userId: string): Promise<({
        items: ({
            combo: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                title: string;
                description: string | null;
                slug: string;
                price: number;
                stock: number;
                imageUrl: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            quantity: number;
            cartId: string;
            comboId: string;
            unitPrice: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }) | {
        id: null;
        userId: string;
        items: never[];
    }>;
    addItemToCart(userId: string, payload: AddToCartInput): Promise<any>;
    updateItemQty(userId: string, comboId: string, payload: UpdateCartItemQtyInput): Promise<any>;
    removeItem(userId: string, comboId: string): Promise<any>;
    clearCart(userId: string): Promise<any>;
    getUserIdFromReqUser: typeof getUserIdFromReqUser;
};
export {};
//# sourceMappingURL=cart.service.d.ts.map