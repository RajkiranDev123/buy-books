import mongoose, { Document, Schema } from "mongoose";

// 1 item ==> { productId and quantity }
export interface ICartItem extends Document {
  product: mongoose.Types.ObjectId; // product has price inside it
  quantity: number;
}

// cart ==> { user and items : [ ICartItem1 , ICartItem2 ]  }
export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
}

const cartItemSchema = new Schema<ICartItem>({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const cartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [cartItemSchema], // [ { product : "123abc" , quantity : 5 } , { product : "456def" , quantity : 2 } ]
  },
  { timestamps: true },
);

export default mongoose.model<ICart>("Cart", cartSchema);
