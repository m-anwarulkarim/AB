import { CreateComboInput, UpdateComboInput } from "./combo.type.js";
export declare const ComboService: {
    listActiveCombos(): Promise<({
        items: {
            name: string;
            id: string;
            quantity: string;
            note: string | null;
            comboId: string;
        }[];
    } & {
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
    })[]>;
    getComboBySlug(slug: string): Promise<{
        items: {
            name: string;
            id: string;
            quantity: string;
            note: string | null;
            comboId: string;
        }[];
    } & {
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
    }>;
    createCombo(payload: CreateComboInput): Promise<{
        items: {
            name: string;
            id: string;
            quantity: string;
            note: string | null;
            comboId: string;
        }[];
    } & {
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
    }>;
    updateComboById(id: string, payload: UpdateComboInput): Promise<any>;
    toggleComboActive(id: string): Promise<{
        items: {
            name: string;
            id: string;
            quantity: string;
            note: string | null;
            comboId: string;
        }[];
    } & {
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
    }>;
    updateStock(id: string, stock: number): Promise<{
        items: {
            name: string;
            id: string;
            quantity: string;
            note: string | null;
            comboId: string;
        }[];
    } & {
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
    }>;
    updatePrice(id: string, price: number): Promise<{
        items: {
            name: string;
            id: string;
            quantity: string;
            note: string | null;
            comboId: string;
        }[];
    } & {
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
    }>;
};
//# sourceMappingURL=combo.service.d.ts.map