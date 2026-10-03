"use client"
import OrderDetailsDialog from '@/app/account/orders/OrderDetailsDialog'
import AdminLayout from '@/app/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableHead, TableHeader, TableRow ,TableCell } from '@/components/ui/table'

import { useGetAdminOrdersQuery } from '@/store/adminApi'
import { Filter, Search, ShoppingBag } from 'lucide-react'

import  { useMemo, useState } from 'react'

const page = () => {
    const [currentPage,setCurrentPage]=useState(1)
    const [pageSize,setPageSize]=useState(10)

    const [filters,setFilters]=useState({status:"",paymentStatus:"",startDate:"",endDate:"",search:""})

    const [editingOrder,setEditingOrder]=useState(null)
    const [paymentOrder,setPaymentOrder]=useState(null)

    const {data:OrdersData,isLoading:isOrderLoading}=useGetAdminOrdersQuery(filters)
    const allOrders=OrdersData?.data?.orders || []
    

    const filteredOrders = useMemo(()=>{
        if(!filters.search)  return allOrders

        const searchTerm=filters.search.toLowerCase()
        console.log(searchTerm)
        return allOrders.filter((order:any)=>{
            return ( order?._id?.toLowerCase().includes(searchTerm) || (order.user.name && order.user.name.toLowerCase().includes(searchTerm)) )
    })

    },[filters.search,allOrders])

    console.log(filteredOrders)

    // pagination
    const totalItems=filteredOrders.length
    const totalPages= Math.ceil(totalItems/pageSize)

    // get current page items
    // Page 1 → indexes 0–9   → orders 1–10
    // Page 2 → indexes 10–19 → orders 11–20
    // Page 3 → indexes 20–29 → orders 21–30
    const currentOrders= useMemo(()=>{
        const startIndex=(currentPage-1)*pageSize
        return filteredOrders.slice(startIndex, startIndex+pageSize)
    },[filteredOrders,currentPage,pageSize])

    const handleFilterChange=(key:string,value:string)=>{
        setFilters(prev=>({...prev,[key]:value}))
        setCurrentPage(1)
    }

    const handlePageChange=(page:string)=>{
         setCurrentPage(1)
    }

    const resetFilters=()=>{ setFilters({status:"",paymentStatus:"",startDate:"",endDate:"",search:""}) ; setCurrentPage(1)}

  return (
    <AdminLayout>

        <div className='space-y-6'>

            <div className='flex justify-between items-center'>
                <h3 className='text-3xl font-bold text-gray-600'>Orders Management</h3>
            </div>

            {/* filters */}

            <Card className='shadow-md'>

                <CardHeader>
                    <CardTitle className='text-xl flex items-center gap-2'>
                     <Filter/> Filters
                    </CardTitle>
                    <CardDescription>Filter orders by various criteria.</CardDescription>
                </CardHeader>

                <CardContent>
                    
                    <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-4'>

                        {/*  */}
                        <div className='space-y-2'>

                            <label className='text-sm font-medium'>Order Status</label>

                            <Select value={filters.status} onValueChange={(value)=>handleFilterChange("status",value)}>

                                <SelectTrigger>
                                    <SelectValue placeholder="All Status"></SelectValue>
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value='processing'>Processing</SelectItem>
                                    <SelectItem value='shipped'>Shipped</SelectItem>
                                    <SelectItem value='delivered'>Delivered</SelectItem>
                                    <SelectItem value='cancelled'>Cancelled</SelectItem>
                                </SelectContent>

                            </Select>

                        </div>
                        {/*  */}

                        {/* payment status */}
                        <div className='space-y-2'>

                            <label className='text-sm font-medium'>Payment Status</label>

                            <Select value={filters.paymentStatus} onValueChange={(value)=>handleFilterChange("paymentStatus",value)}>

                                <SelectTrigger>
                                    <SelectValue placeholder="All Status"></SelectValue>
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value='pending'>Pending</SelectItem>
                                    <SelectItem value='complete'>Completed</SelectItem>
                                    <SelectItem value='failed'>Failed</SelectItem>
                                </SelectContent>

                            </Select>

                        </div>
                        {/* payment status ends */}

                        {/* search */}

                        <div className='space-y-2'>

                            <label className='text-sm font-medium'>Search</label>

                            <div className='relative'>

                                <Search className='absolute left-2 top-2.5 h-4 w-4 text-gray-400'/>
                                <Input
                                placeholder='Order Id or Username'
                                className='pl-8'
                                value={filters.search}
                                onChange={(e)=>handleFilterChange("search",e.target.value)}
                                />

                            </div>

                        </div>

                        {/* search ends */}

                        {/* start date   */}

                        <div className='space-y-2'>

                            <label className='text-sm font-medium'>Search</label>

                            <div className='relative'>

                                <Search className='absolute left-2 top-2.5 h-4 w-4 text-gray-400'/>
                                <Input
                                type='date'
                                className='pl-8'
                                value={filters.startDate}
                                onChange={(e)=>handleFilterChange("startDate",e.target.value)}
                                />

                            </div>

                        </div>

                        {/* start date ends */}

                        {/* end date   */}

                        <div className='space-y-2'>

                            <label className='text-sm font-medium'>End Date</label>

                            <div className='relative'>

                                <Search className='absolute left-2 top-2.5 h-4 w-4 text-gray-400'/>
                                <Input
                                type='date'
                                className='pl-8'
                                value={filters.endDate}
                                onChange={(e)=>handleFilterChange("endDate",e.target.value)}
                                />

                            </div>

                        </div>

                        {/* end date ends */}

                        {/* reset */}

                        <div className='flex items-end space-x-2'>
                            <Button variant={"outline"} className='flex-1' onClick={resetFilters}>
                             Reset
                            </Button>
                        </div>

                        {/* reset */}



                    </div>

                </CardContent>

            </Card>

            
            {/* filters */}


            {/* orders table */}
            <Card className='shadow-md'>

                <CardHeader>
                 <CardTitle className='text-xl flex items-center'> <ShoppingBag className='mr-2 h-5 w-5'/> Orders</CardTitle>
                 <CardDescription>Showing {currentOrders?.length} of {totalItems}</CardDescription>
                </CardHeader>

                <CardContent>
                    {
                        isOrderLoading ? (
                        <div className='flex justify-center py-10'>
                        Loading...
                        </div>

                        ):currentOrders?.length===0?(
                            <div className='text-center py-10'>
                                <ShoppingBag className='mx-auto h-12 w-12 text-gray-400'/>
                                <h3 className='mt-2 text-lg font-medium text-gray-800'>No orders found</h3>
                                <p className='mt-1 text-sm text-gray-500'>Try adjusting your filters or search criteria.</p>
                            </div>
                        ):(
                            <div className='overflow-x-auto'>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order Id</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Payment</TableHead>
                                        <TableHead className='text-right'>Action</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>

                                    {
                                        currentOrders?.map((order:any)=>(

                                            <TableRow key={order?._id}>

                                             <TableCell className="font-medium">#{order?._id?.slice(-6)}</TableCell>
                                             <TableCell>{order?.user?.name}</TableCell>
                                             <TableCell >{new Date(order?.createdAt).toLocaleDateString()}</TableCell>
                                             <TableCell >Rs {order?.totalAmount}</TableCell>
                                             <TableCell className=''>
                                                <span
                                                className={
                                                `px-2 py-1 text-xs rounded-full font-semibold
                                                ${order?.status=="delivered"?"bg-green-100 text-green-800"
                                                :  order?.status=="processing" ? "bg-yellow-100 text-yellow-800"
                                                :  order?.status=="shipped"?"bg-blue-100 text-blue-800"
                                                : "bg-red-100 text-red-800"
                                                }
                                                `}>

                                                {order?.status?.charAt(0)?.toUpperCase()+order?.status?.slice(1)}

                                                </span>
                                             </TableCell>

                                            <TableCell className=''>
                                                <span
                                                className={
                                                `px-2 py-1 text-xs rounded-full font-semibold
                                                ${order?.paymentStatus=="complete"?"bg-green-100 text-green-800"
                                                :  order?.paymentStatus=="pending" ? "bg-yellow-100 text-yellow-800"
                                    
                                                : "bg-red-100 text-red-800"
                                                }
                                                `}>

                                                {order?.paymentStatus?.charAt(0)?.toUpperCase()+order?.paymentStatus?.slice(1)}

                                                </span>
                                             </TableCell>

                                             <TableCell className='text-right'>

                                                <div className='flex justify-end space-x-2'>
                                                    <OrderDetailsDialog order={order}/>
                                                    
                                                </div>

                                             </TableCell>

                                            </TableRow>
                                        ))
                                    }

                                </TableBody>

                             </Table>
                            </div>
                        )
                    }
                </CardContent>

            </Card>
            {/* orders table */}


        </div>
        
    </AdminLayout>
  )
}

export default page