import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";

export const createOrder = async (req: Request, res: Response) => {
  return await prismaClient.$transaction(async (tx) => {
    const cartItems = await tx.cartItem.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        product: true,
      },
    });

    if (cartItems.length == 0) {
      return res.json({ message: "Cart is empty" });
    }

    const price = cartItems.reduce((prev, current) => {
      return prev + current.quantity * +current.product.price;
    }, 0);

    const address = await tx.address.findFirst({
      where: {
        id: req.user.defaultShippingAddress!,
      },
    });

    const order = await tx.order.create({
      data: {
        userId: req.user.id,
        netAmount: price,
        address: address!.formattedAddress,
        products: {
          create: cartItems.map((cart) => {
            return {
              productId: cart.productId,
              quantity: cart.quantity,
            };
          }),
        },
      },
    });
    const orderEvent = await tx.orderEvents.create({
      data: {
        orderId: order.id,
      },
    });
    await tx.cartItem.deleteMany({
      where: {
        userId: req.user.id,
      },
    });
    return res.json(order);
  });
};

export const listOrders = async (req: Request, res: Response) => {
  const orders = await prismaClient.order.findMany({
    where: {
      userId: req.user.id,
    },
  });
  res.json(orders);
};

export const cancelOrder = async (req: Request, res: Response) => {
  return await prismaClient.$transaction(async (tx) => {
    try {
      const order = await tx.order.findFirst({
        where: {
          id: +req.params.id,
          userId: req.user.id,
        },
      });

      if (!order) {
        throw new NotFoundException(
          "Order not found",
          ErrorCode.ORDER_NOT_FOUND
        );
      }

      if (order.status === "CANCELLED") {
        return res.status(400).json({ message: "Order is already cancelled" });
      }

      const updatedOrder = await tx.order.update({
        where: {
          id: order.id,
        },
        data: {
          status: "CANCELLED",
        },
      });

      await tx.orderEvents.create({
        data: {
          orderId: order.id,
          status: "CANCELLED",
        },
      });

      return res.json(updatedOrder);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        return res
          .status(500)
          .json({ message: "An error occurred while cancelling the order" });
      }
    }
  });
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await prismaClient.order.findFirstOrThrow({
      where: {
        id: +req.params.id,
      },
      include: {
        products: true,
        events: true,
      },
    });
    res.json(order);
  } catch (error) {
    throw new NotFoundException("Order not found", ErrorCode.ORDER_NOT_FOUND);
  }
};