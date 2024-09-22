import { Request, Response } from "express";
import { CreateCartSchema, ChangeQuantitySchema } from "../schema/cart";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { Product } from "@prisma/client";
import { prismaClient } from "..";
import { UnauthorizedException } from "../exceptions/unauthorized";

export const addItemToCart = async (req: Request, res: Response) => {
  const validatedData = CreateCartSchema.parse(req.body);

  let product: Product;
  try {
    product = await prismaClient.product.findFirstOrThrow({
      where: { id: validatedData.productId },
    });
  } catch (error) {
    throw new NotFoundException(
      "Product not found",
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }

  const existingCartItem = await prismaClient.cartItem.findFirst({
    where: {
      userId: req.user.id,
      productId: product.id,
    },
  });

  if (existingCartItem) {
    const updatedCartItem = await prismaClient.cartItem.update({
      where: { id: existingCartItem.id },
      data: { quantity: existingCartItem.quantity + validatedData.quantity },
    });
    return res.json(updatedCartItem);
  } else {
    const cart = await prismaClient.cartItem.create({
      data: {
        userId: req.user.id,
        productId: product.id,
        quantity: validatedData.quantity,
      },
    });
    res.json(cart);
  }
};

export const deleteItemFromCart = async (req: Request, res: Response) => {
  const cartItem = await prismaClient.cartItem.findUnique({
    where: { id: +req.params.id },
  });

  if (!cartItem) {
    throw new NotFoundException(
      "Cart item not found",
      ErrorCode.CART_ITEM_NOT_FOUND
    );
  }

  if (cartItem.userId !== req.user.id) {
    return res
      .status(403)
      .json({ message: "You are not authorized to delete this cart item" });
  }

  await prismaClient.cartItem.delete({
    where: { id: +req.params.id },
  });

  res.json({ message: "Cart item deleted" });
};

export const changeQuantity = async (req: Request, res: Response) => {
  const validatedData = ChangeQuantitySchema.parse(req.body);

  const cartItem = await prismaClient.cartItem.findUnique({
    where: { id: +req.params.id },
  });

  if (!cartItem) {
    throw new NotFoundException(
      "Cart item not found",
      ErrorCode.CART_ITEM_NOT_FOUND
    );
  }

  if (cartItem.userId !== req.user.id) {
    throw new UnauthorizedException(
      "You are not authorized to change this cart item",
      ErrorCode.CART_UNAUTHORIZED_ACCESS
    );
  }

  const updatedCartItem = await prismaClient.cartItem.update({
    where: { id: +req.params.id },
    data: { quantity: validatedData.quantity },
  });

  res.json(updatedCartItem);
};

export const getCart = async (req: Request, res: Response) => {
  const cartItems = await prismaClient.cartItem.findMany({
    where: { userId: req.user.id },
    include: { product: true },
  });

  if (!cartItems.length) {
    throw new NotFoundException("Cart is empty", ErrorCode.CART_EMPTY);
  }

  res.json(cartItems);
};
