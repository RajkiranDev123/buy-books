import { Request,Response } from "express";
import SellerPayment from "../models/SellerPayment";
import Order from "../models/Order";
import { response } from "../utils/responseHandler";
import User from "../models/User";
import Products from "../models/Products";


export const getAllOrders = async( req : Request, res : Response )=>{
    
 try {

       const {status,paymentStatus,startDate,endDate}=req.query
   
       const paidOrderRecord = await SellerPayment.find().select("order")
       const paidOrderIds=paidOrderRecord.map(record=>record.order.toString())
   
       const query : any = { paymentStatus:"complete", _id:{ $nin : paidOrderIds } }
   
       if(status) {  query.status=status }
       query.paymentStatus = paymentStatus || "complete"
   
       if(startDate && endDate){
           query.createdAt={ $gte:new Date(startDate as string) , $lte:new Date(endDate as string) }
       }
   
       // Populate product, then inside that populated product, populate seller.

       const orders = await Order.find(query)
       .populate({
           path:"items.product", // items : [ {product,quantity,_id}, {product,quantity,_id} ]
           populate :{
               path:"seller",
               select:"name email phoneNumber paymentMode paymentDetails"
           }
       })
       .populate("user","name email") // buyer
       .populate("shippingAddress")
       .sort({createdAt:-1})
   
       return response(res,200,"order fetched successfully",orders)

 } catch (error) {

       return response(res,500,"Internal Server Error")
    
 }

}


export const updateOrder = async( req : Request, res : Response ) =>{
    
 try {

       const { id } = req.params

       const { status , paymentStatus } = req.body

       const order = await Order.findById(id)

       if(!order){
        return response(res,404,"Order not found.")
       }

       if(status) order.status=status
       if(paymentStatus) order.paymentStatus=paymentStatus

       await order.save()

       return response(res,200,"order updated successfully.",order)

 } catch (error) {

       return response(res,500,"Internal Server Error")
    
 }

}

export const processSellerPayment = async( req : Request, res : Response ) =>{
    
 try {

       const {orderId}=req.params

       const {productId , paymentMethod , amount , notes }=req.body

       const user=req.id

       if(!productId || !paymentMethod || !amount){
        return response(res,400,"Missing productId , paymentMethod and amount.")
       }

       const order = await Order.findById(orderId)
       .populate({
        path:"items.product",
        populate:{
            path:"seller"
        }
       })

       if(!order){
        return response(res,404,"Order not found.")
       }

       const orderItem = order.items.find(item => item.product._id.toString() === productId)

       if(!orderItem){
        return response(res,404,"Product not found in this order.")
       }

       const sellerPayment = new SellerPayment({
        seller:(orderItem.product as any ).seller._id,
        order:orderId,
        product:productId,
        amount,
        paymentMethod,
        paymentStatus:"complete",
        processedBy:user,
        notes
       })

       await sellerPayment.save()

       return response(res,200,"Payment to seller  processed successfully.", sellerPayment )

 } catch (error) {

       return response(res,500,"Internal Server Error.")
    
 }

}


export const getDashboardStats = async( req : Request, res : Response ) =>{
    
 try {

       const [totalOrders, totalUsers , totalProducts, statusCounts, recentOrders, revenue, monthlySales ] =
       await Promise.all([
        // get counts
        Order.countDocuments().lean(),
        User.countDocuments().lean(),
        Products.countDocuments().lean(),

        // get order by status
        // statusCounts = [  { _id: "processing", count: 3 }, ... ]

        Order.aggregate([
            {
                $group:{_id:"$status",count:{$sum:1}} // total:{$sum:"$totalAmount"}
            }
        ]),

        // recent orders

        Order.find()
        .select("user totalAmount status createdAt")
        .populate("user","name") // Mongoose includes _id by default when you use populate() , but .populate("user", "name -_id")
        .sort({createdAt:-1}).limit(5).lean(),

        // revenue ==> [ {_id:null, total:70} ]
        Order.aggregate([
            {
                $match : {paymentStatus:"complete"}
            },
            {
                $group : { _id:null, total:{$sum:"$totalAmount"}}
                // _id: null means don't group by any field.
                // So MongoDB puts all documents into one group
            }
        ]),

        // monthlySales
        // $month and $year extract the month or year from a Date field.
        Order.aggregate([

            { $match:{paymentStatus:"complete"} },

            {   // frequently used with aggregate functions (COUNT, SUM, AVG, MAX, or MIN) to perform mathematical calculations on each group.
                $group : { 
                    _id : { month: {$month : "$createdAt"}, year:{$year : "$createdAt"} } ,
                    total : {$sum : "$totalAmount"},
                    count : {$sum:1}
                }
            },

            { $sort : { "_id.year":1, "_id.month":1 } } // -1 would mean descending.

          ])

       ])// Promise.all

//   [
//   {
//     _id: { month: 1, year: 2026 },
//     total: 800,
//     count: 2
//   },
//   {
//     _id: { month: 2, year: 2026 },
//     total: 700,
//     count: 1
//   }
//   ]

          
       // process status count
       const ordersByStatus={ processing:0,shipped:0,delivered:0,cancelled:0 }
 
       //  statusCounts = [  { _id: "processing", count: 3 }, ... ]

       statusCounts.forEach((item:any)=>{
        // item ==>  { _id: "processing", count: 3 }
        // typeof ordersByStatus ==> { processing: number; shipped: number; ... }
        // gets the keys of that object : "processing" | "shipped" 
         const status = item._id as keyof typeof ordersByStatus // "Treat item._id as one of the valid keys of ordersByStatus."
         if(ordersByStatus.hasOwnProperty(status)){ // Check whether ordersByStatus has this key/property.
            ordersByStatus[status] = item.count
         }
       })

       return response(res, 200, "Dashboard statistics fetched successfully.", {
        counts:{ orders:totalOrders,users:totalUsers,products:totalProducts, revenue : revenue.length>0?revenue[0].total : 0 },
        ordersByStatus, recentOrders, monthlySales
       })      

 } catch (error) {

       return response(res,500,"Internal Server Error.")
    
 }

}

export const getSellerPayments = async ( req : Request , res : Response ) =>{
    try {

        const {sellerId , status , paymentMethod , startDate , endDate } = req.query

        const query : any = {}

        if(sellerId && sellerId!=="all"){
            query.seller=sellerId
        }

        if(status && status!=="all"){
            query.status=status
        }

        if(paymentMethod && paymentMethod!=="all"){
            query.paymentMethod=paymentMethod
        }

        if(startDate && endDate){
            query.createdAt={
                $gte:new Date(startDate as string),
                $lte:new Date(endDate as string)
            }
        }

        const payments = await SellerPayment.find(query)
        .populate("seller","name email phoneNumber paymentMode paymentDetails")
        .populate("order")
        .populate("product","subject finalPrice images")
        .populate("processedBy","name")
        .sort({createdAt:-1})

        return response(res,200,"Seller Payments fetched successfully",payments)



        
    } catch (error) {
        return response(res,500,"Internal Server Error.")
    }
}

