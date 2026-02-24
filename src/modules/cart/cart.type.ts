export type AddToCartInput = {
    comboId: string;
    quantity?: number; // default 1
};

export type UpdateCartItemQtyInput = {
    quantity: number; // must be >= 1
};