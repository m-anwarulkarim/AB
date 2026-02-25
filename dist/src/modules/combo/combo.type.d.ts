export type ComboItemInput = {
    name: string;
    quantity: string;
    note?: string;
};
export type CreateComboInput = {
    title: string;
    slug: string;
    description?: string;
    price: number;
    stock?: number;
    imageUrl?: string;
    isActive?: boolean;
    items?: ComboItemInput[];
};
export type UpdateComboInput = Partial<CreateComboInput>;
//# sourceMappingURL=combo.type.d.ts.map