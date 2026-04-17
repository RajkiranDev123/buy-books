import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import Address from "../models/Address";
import User from "../models/User";

export const createOrUpdateAddressByUserId = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = req.id;

    const {
      addressLine1,
      addressLine2,
      phoneNumber,
      city,
      state,
      pincode,
      addressId,
    } = req.body;

    if (!userId) {
      return response(res, 400, "user not found, plz provide a valid id");
    }
    if (
      !addressLine1 ||
      !addressLine2 ||
      !phoneNumber ||
      !city ||
      !state ||
      !pincode
    ) {
      return response(
        res,
        400,
        "plz enter all values to create a new address.",
      );
    }
    if (addressId) {
      const existingAddress = await Address.findById(addressId);
      if (!existingAddress) {
        return response(res, 400, "Address not found");
      }
      existingAddress.addressLine1 = addressLine1;
      existingAddress.addressLine2 = addressLine2;
      existingAddress.phoneNumber = phoneNumber;
      existingAddress.city = city;
      existingAddress.state = state;
      existingAddress.pincode = pincode;

      await existingAddress.save();
      return response(
        res,
        200,
        "Address updated successfully.",
        existingAddress,
      );
    } else {
      const newAddress = new Address({
        user: userId,
        addressLine1,
        addressLine2,
        phoneNumber,
        city,
        state,
        pincode,
      });
      await newAddress.save();
      await User.findByIdAndUpdate(
        userId,
        {
          $push: { addresses: newAddress.id },
        },
        { new: true },
      );
      return response(res, 200, "User address created.", newAddress);
    }
  } catch (error) {
    console.log(error)
    return response(res, 500, "Internal Server Error");
  }
};

export const getUserAddressByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.id;
    if (!userId) {
      return response(res, 400, "user not found, plz provide valid id.");
    }
    const address = await User.findById(userId).populate("addresses");

    if (!address) {
      return response(res, 400, "user address not found");
    }
    return response(res, 200, "user address", address);
  } catch (error) {
    console.log(777777,error)
    return response(res, 500, "Internal Server Error");
  }
};

