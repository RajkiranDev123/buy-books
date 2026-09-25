
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const Base_URL = process.env.NEXT_PUBLIC_API_URL; //"http://localhost:8000/api/v1"

export const adminApi=createApi({

    reducerPath : "adminApi",

    baseQuery : fetchBaseQuery({
        baseUrl : Base_URL,
        credentials : "include",
    }),

    tagTypes : ["AdminStats","AdminOrders","SellerPayments"],

    endpoints: (builder) =>({

        // app.use("/api/v1/admin", adminRoutes);
        // router.get("/dashboard-stats",  adminController.getDashboardStats);
        getDashboardStats : builder.query({
            query : ()=>"/admin/dashboard-stats",
            providesTags : ["AdminStats"]
        }),

        getAdminOrders:builder.query({
            query:(params)=>{

                // params = {   status : "processing" , page : 2 }
                // Object.entries(params) ==> [ ["status","processing"] , ["page",2] ]
                // queryParams.append("status", "processing") 
                // queryParams.append("page", "2");
                // status=processing&page=2

                const queryParams=new URLSearchParams() // creates an object for building URL query parameters.
                if(params){
                    Object.entries(params).forEach(([key,value])=>{
                        if(value) queryParams.append(key,value.toString())
                    })
                }

                return `/admin/orders?${queryParams}`
            },
            providesTags:["AdminOrders"]
        }),

        updateOrder:builder.mutation({
            query:({orderId,update})=>(
                {
                    url:`/admin/orders/${orderId}`,
                    method:"PUT",
                    body:update
                }
            ),
            invalidatesTags:( result,error,{orderId} ) => [ { type:"AdminOrders", id:orderId }, "AdminOrders","AdminStats"]
        }),

        getSellerPayments:builder.query({
            query:(params)=>{
                const queryParams = new URLSearchParams()
                if(params){
                    Object.entries(params).forEach(([key,value])=>{
                        if(value) queryParams.append(key,value.toString())
                    })
                }
                return `/admin/seller-payments?${queryParams}`
            },
            providesTags:["SellerPayments"]
        }),

        processSellerPayments : builder.mutation({
            query:({orderId,paymentData})=>({
                url:`/admin/process-seller-payment/${orderId}`,
                method:"POST",
                body:paymentData
            }),
            invalidatesTags:(result,error,{orderId})=>[ {type:"AdminOrders", id:orderId}, "AdminOrders", "AdminStats", "SellerPayments" ]
        })

    })// endpoints

}) // createApi

// use................Query and use............Mutation
export const {
    useGetDashboardStatsQuery,
    useGetAdminOrdersQuery,
    useUpdateOrderMutation,
    useProcessSellerPaymentsMutation,
    useGetSellerPaymentsQuery
} = adminApi