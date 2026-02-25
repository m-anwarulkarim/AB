import status from "http-status";
import AppError from "../../utils/AppError.js";
import { prisma } from "../../lib/prisma.js";
import { AddToCartInput, UpdateCartItemQtyInput } from "./cart.type.js";

function getUserIdFromReqUser(reqUser: unknown): string {
  const user = reqUser as { id?: string } | undefined;
  if (!user?.id) {
    throw new AppError(status.UNAUTHORIZED, "Unauthorized - Please login");
  }
  return user.id;
}

export const CartService = {
  // ✅ GET /cart
  async getMyCart(userId: string) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          orderBy: { createdAt: "desc" },
          include: {
            combo: true, // combo info show
          },
        },
      },
    });

    // cart না থাকলেও empty দেখাতে চাইলে:
    return cart ?? { id: null, userId, items: [] };
  },

  // ✅ POST /cart/items  (add or increment)
  async addItemToCart(userId: string, payload: AddToCartInput) {
    const quantityToAdd = payload.quantity ?? 1;

    // combo validate
    const combo = await prisma.combo.findUnique({
      where: { id: payload.comboId },
      select: {
        id: true,
        price: true,
        stock: true,
        isActive: true,
        title: true,
      },
    });

    if (!combo || combo.isActive === false) {
      throw new AppError(status.NOT_FOUND, "Combo not found");
    }

    if (combo.stock <= 0) {
      throw new AppError(status.BAD_REQUEST, "Out of stock");
    }

    // transaction: cart ensure + upsert cartItem
    const result = await prisma.$transaction(async (tx: any) => {
      const cart = await tx.cart.upsert({
        where: { userId },
        update: {}, // nothing
        create: { userId },
        select: { id: true },
      });

      // current item
      const existingItem = await tx.cartItem.findUnique({
        where: { cartId_comboId: { cartId: cart.id, comboId: combo.id } },
        select: { id: true, quantity: true },
      });

      const newQty = (existingItem?.quantity ?? 0) + quantityToAdd;

      // stock limit check
      if (newQty > combo.stock) {
        throw new AppError(
          status.BAD_REQUEST,
          `Not enough stock. Available: ${combo.stock}`,
        );
      }

      // upsert item
      await tx.cartItem.upsert({
        where: { cartId_comboId: { cartId: cart.id, comboId: combo.id } },
        update: {
          quantity: newQty,
          // unitPrice snapshot update করবো কি? সাধারণত add-to-cart এ price snapshot “প্রথমবার” রাখা হয়।
          // তবে তুমি চাইলে updated price reflect করতে পারো।
        },
        create: {
          cartId: cart.id,
          comboId: combo.id,
          quantity: newQty,
          unitPrice: combo.price, // snapshot
        },
      });

      // return fresh cart
      return tx.cart.findUnique({
        where: { userId },
        include: {
          items: {
            orderBy: { createdAt: "desc" },
            include: { combo: true },
          },
        },
      });
    });

    return result;
  },

  // ✅ PATCH /cart/items/:comboId  (set quantity)
  async updateItemQty(
    userId: string,
    comboId: string,
    payload: UpdateCartItemQtyInput,
  ) {
    const { quantity } = payload;

    const combo = await prisma.combo.findUnique({
      where: { id: comboId },
      select: { id: true, stock: true, isActive: true },
    });

    if (!combo || combo.isActive === false) {
      throw new AppError(status.NOT_FOUND, "Combo not found");
    }

    if (quantity > combo.stock) {
      throw new AppError(
        status.BAD_REQUEST,
        `Not enough stock. Available: ${combo.stock}`,
      );
    }

    const updated = await prisma.$transaction(async (tx: any) => {
      const cart = await tx.cart.findUnique({
        where: { userId },
        select: { id: true },
      });

      if (!cart) {
        throw new AppError(status.NOT_FOUND, "Cart not found");
      }

      const item = await tx.cartItem.findUnique({
        where: { cartId_comboId: { cartId: cart.id, comboId } },
        select: { id: true },
      });

      if (!item) {
        throw new AppError(status.NOT_FOUND, "Cart item not found");
      }

      await tx.cartItem.update({
        where: { cartId_comboId: { cartId: cart.id, comboId } },
        data: { quantity },
      });

      return tx.cart.findUnique({
        where: { userId },
        include: {
          items: {
            orderBy: { createdAt: "desc" },
            include: { combo: true },
          },
        },
      });
    });

    return updated;
  },

  // ✅ DELETE /cart/items/:comboId
  async removeItem(userId: string, comboId: string) {
    const updated = await prisma.$transaction(async (tx: any) => {
      const cart = await tx.cart.findUnique({
        where: { userId },
        select: { id: true },
      });

      if (!cart) {
        throw new AppError(status.NOT_FOUND, "Cart not found");
      }

      const item = await tx.cartItem.findUnique({
        where: { cartId_comboId: { cartId: cart.id, comboId } },
        select: { id: true },
      });

      if (!item) {
        throw new AppError(status.NOT_FOUND, "Cart item not found");
      }

      await tx.cartItem.delete({
        where: { cartId_comboId: { cartId: cart.id, comboId } },
      });

      return tx.cart.findUnique({
        where: { userId },
        include: {
          items: {
            orderBy: { createdAt: "desc" },
            include: { combo: true },
          },
        },
      });
    });

    return updated;
  },

  // ✅ DELETE /cart/clear
  async clearCart(userId: string) {
    const updated = await prisma.$transaction(async (tx: any) => {
      const cart = await tx.cart.findUnique({
        where: { userId },
        select: { id: true },
      });

      if (!cart) {
        // empty cart consider ok
        return { id: null, userId, items: [] };
      }

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return tx.cart.findUnique({
        where: { userId },
        include: {
          items: {
            orderBy: { createdAt: "desc" },
            include: { combo: true },
          },
        },
      });
    });

    return updated ?? { id: null, userId, items: [] };
  },

  // helper exported (optional) — controller থেকে userId reliably পেতে
  getUserIdFromReqUser,
};
