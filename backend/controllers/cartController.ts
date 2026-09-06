import { Request, Response } from "express";
import Products from "../models/Products";
import { response } from "../utils/responseHandler";
import Cart, { ICartItem } from "../models/CartItems";

export const addToCart = async (req: Request, res: Response) => {

  try {

    const userId = req.id;

    if (!userId) {
      return response(res, 401, "Unauthorized");
    }

    const { productId, quantity } = req.body;

    if (!quantity || quantity <= 0) {
       return response(res, 400, "Quantity must be greater than 0.");
     }

    const product = await Products.findById(productId);

    if (!product) {
      return response(res, 404, "Product not found.");
    }

    // Prevent seller from buying their own product
    if (product.seller.toString() === userId) {
      return response(res, 400, "You can't add your own product to the cart.");
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // if cart doesn't exist, create one in memory
      cart = new Cart({ user: userId, items: [] });
    }

    // find returns undefined if not found
    const existingItem = cart.items.find( item => item.product.toString() === productId );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const newItem = { product: productId,  quantity: quantity };
      cart.items.push(newItem as ICartItem);
    }

    await cart.save();
    return response(res, 200, "Item added to cart.", cart);

  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal Server Error");
  }
};

export const removeItemFromCart = async (req: Request, res: Response) => {
  try {
    const userId = req.id;

    const { productId } = req.params;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return response(res, 404, "Cart not found for this user.");
    }

    cart.items = cart.items.filter( (item) => item.product.toString() !== productId );

    await cart.save();
    return response(res, 200, "Item removed from cart.");

  } catch (error) {
    return response(res, 500, "Internal Server Error");
  }
};

export const getCartByUser = async (req: Request, res: Response) => {
  try {

    const userId = req.params.userId;

    let cart = await Cart.findOne({ user: userId }).populate(
      "items.product",
    );
  

    if (!cart) {
      return response(res, 404, "Cart is Empty", { items: [] });
    }

    return response(res, 200, "User cart fetched.", cart);

  } catch (error) {
    // console.log(error)
    return response(res, 500, "Internal Server Error");
  }
};
