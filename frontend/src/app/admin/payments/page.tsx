"use client"
import AdminLayout from '@/app/components/admin/AdminLayout'


import Pagination from '@/app/components/Pagination'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DialogContent,Dialog, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableHead, TableHeader, TableRow ,TableCell } from '@/components/ui/table'

import { useGetSellerPaymentsQuery } from '@/store/adminApi'
import { CreditCard,  Eye, FileText, Filter, Search, ShoppingBag } from 'lucide-react'
import Image from 'next/image'


import  { useMemo, useState } from 'react'

const page = () => {
    const [currentPage,setCurrentPage]=useState(1)
    const [pageSize,setPageSize]=useState(10)

    const [filters,setFilters]=useState({sellerId:"",status:"",paymentMethod:"",startDate:"",endDate:"",search:""})

    const [selectedPayment,setSelectedPayment]=useState<any>(null)

    // const [selectedPayment, setSelectedPayment] = useState<{
    //                                                 amount?: number;
    //                                                 [key: string]: any;
    //                                                 } | null>(null);
  
    const {data:paymentData,isLoading:isPaymentLoading}=useGetSellerPaymentsQuery(filters)
    const allPayments=paymentData?.data?.payments || []
    const sellers=paymentData?.data?.users || []
    

    const filteredOrders = useMemo(()=>{
        if(!filters.search)  return allPayments

        const searchTerm=filters.search.toLowerCase()
        console.log(searchTerm)
        return allPayments.filter((payment:any)=>{
            return ( payment?._id?.toLowerCase().includes(searchTerm) || (payment.seller.name && payment.seller.name.toLowerCase().includes(searchTerm))
          || (payment.product.subject && payment.product.subject.toLowerCase().includes(searchTerm))
          )
            
    })

    },[filters.search,allPayments])

    console.log(filteredOrders)

    // pagination
    const totalItems=filteredOrders.length
    const totalPages= Math.ceil(totalItems/pageSize)

    // get current page items
    // Page 1 → indexes 0–9   → orders 1–10
    // Page 2 → indexes 10–19 → orders 11–20
    // Page 3 → indexes 20–29 → orders 21–30
    const currentPayments= useMemo(()=>{
        const startIndex=(currentPage-1)*pageSize
        return filteredOrders.slice(startIndex, startIndex+pageSize)
    },[filteredOrders,currentPage,pageSize])

    const handleFilterChange=(key:string,value:string)=>{
        setFilters(prev=>({...prev,[key]:value}))
        setCurrentPage(1)
    }

    const handlePageChange=(page:number)=>{
         setCurrentPage(1)
    }

    const resetFilters=()=>{ setFilters({sellerId:"",status:"",paymentMethod:"",startDate:"",endDate:"",search:""}) ; setCurrentPage(1)}

    const formatDate=(dateString:string)=>{

      const date=new Date(dateString)
      return date.toLocaleDateString("en-US",{
        year:"numeric",
        month:"short",
        day:"numeric",
        hour:"2-digit",
        minute:"2-digit"
      })

    }

  return (
    <AdminLayout>

        <div className='space-y-6'>

            <div className='flex justify-between items-center'>
                <h3 className='text-3xl font-bold text-gray-600'>Seller Payments</h3>
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

                            <label className='text-sm font-medium'>Seller</label>

                            <Select value={filters.sellerId} onValueChange={(value)=>handleFilterChange("sellerId",value)}>

                                <SelectTrigger>
                                    <SelectValue placeholder="All Sellers"></SelectValue>
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value='all'>All Sellers</SelectItem>
                                    {
                                      sellers?.map((seller:any)=>(
                                        <SelectItem key={seller?._id} value={seller?._id}>
                                          {seller?.name}
                                        </SelectItem>                                        
                                      ))
                                    }
                               
                                </SelectContent>

                            </Select>

                        </div>


                        {/*  */}

                        {/*  */}
                        <div className='space-y-2'>

                            <label className='text-sm font-medium'>Order Status</label>

                            <Select value={filters.status} onValueChange={(value)=>handleFilterChange("status",value)}>

                                <SelectTrigger>
                                    <SelectValue placeholder="All Status"></SelectValue>
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value='all'>All Statuses</SelectItem>
                                    <SelectItem value='pending'>Pending</SelectItem>
                                    <SelectItem value='complete'>Complete</SelectItem>
                                    <SelectItem value='failed'>Failed</SelectItem>
                                </SelectContent>

                            </Select>

                        </div>
                        {/*  */}

                        {/* payment method */}
                        <div className='space-y-2'>

                            <label className='text-sm font-medium'>Payment Method</label>

                            <Select value={filters.paymentMethod} onValueChange={(value)=>handleFilterChange("paymentMethod",value)}>

                                <SelectTrigger>
                                    <SelectValue placeholder="All Status"></SelectValue>
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value='all'>All Method</SelectItem>
                                    <SelectItem value='UPI'>UPI</SelectItem>
                                    <SelectItem value='Bank Transfer'>Bank Transfer</SelectItem>
                                    <SelectItem value='Other'>Other</SelectItem>
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

            
            {/* filters end*/}


            {/* payment table */}
            <Card className='shadow-md'>

                <CardHeader>
                 <CardTitle className='text-xl flex items-center'> <CreditCard className='mr-2 h-5 w-5'/> Seller Payments</CardTitle>
                 <CardDescription>Showing {currentPayments?.length} of {totalItems}</CardDescription>
                </CardHeader>

                <CardContent>
                    {
                        isPaymentLoading ? (
                        <div className='flex justify-center py-10'>
                        Loading...
                        </div>

                        ):currentPayments?.length===0?(
                            <div className='text-center py-10'>
                                <ShoppingBag className='mx-auto h-12 w-12 text-gray-400'/>
                                <h3 className='mt-2 text-lg font-medium text-gray-800'>No payments found</h3>
                                <p className='mt-1 text-sm text-gray-500'>Try adjusting your filters or search criteria.</p>
                            </div>
                        ):(
                            <div className='overflow-x-auto'>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Seller Id</TableHead>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Method</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className='text-right'>Action</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>

                                    {
                                        currentPayments?.map((payment:any)=>(

                                            <TableRow key={payment?._id}>

                                            
                                             <TableCell>{payment?.seller?.name || "Unknown"}</TableCell>
                                             <TableCell className='max-w-[200px] truncate'>
                                              <div className='flex items-center space-x-2'>
                                              
                                              {payment?.product?.images && payment?.product?.images[0]
                                              && (<Image
                                              src={payment?.product?.images[0]}
                                              alt={payment?.product?.subject}
                                              width={30}
                                              height={30}
                                              className="rounded-md"
                                              />)
                                              }
                                              <span className='truncate'>{payment?.product?.subject}</span>

                                              </div>
                                             </TableCell>
                                            
                                             <TableCell >Rs {payment?.amount}</TableCell>
                                             <TableCell >Rs {payment?.paymentMethod}</TableCell>
                                            <TableCell >{formatDate(payment?.createdAt)}</TableCell>
                                             <TableCell className=''>
                                                <span
                                                className={
                                                `px-2 py-1 text-xs rounded-full font-semibold
                                                ${payment?.status=="complete"?"bg-green-100 text-green-800"
                                                : payment?.status=="pending" ? "bg-yellow-100 text-yellow-800"
                                    
                                                : "bg-red-100 text-red-800"
                                                }
                                                `}>

                                                {payment?.status?.charAt(0)?.toUpperCase()+payment?.status?.slice(1)}

                                                </span>
                                             </TableCell>

                                         

                                             <TableCell className='text-right'>

                                                <div className='flex justify-end space-x-2'>
                                                  

                                                    <Button variant={"outline"} size={"sm"} onClick={()=>setSelectedPayment(payment)}>
                                                        <Eye className="h-4 w-4 mr-1"/>
                                                        View
                                                    </Button>

                                                    <Button variant={"outline"} size={"sm"} >
                                                        <FileText className="h-4 w-4 mr-1"/>
                                                        Receipt
                                                    </Button>
                                                    
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

                    {/* custom pagination */}
                    {!isPaymentLoading && currentPayments?.length > 0 && (
                        <div className='mt-5'>
                            <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                    {/* custom pagination */}



                </CardContent>

            </Card>
            {/* orders table */}


        </div>

   

     {
        selectedPayment && (
            <Dialog open={!!selectedPayment} onOpenChange={(open)=>!open && setSelectedPayment(null)}>

                <DialogContent className='sm:max-w-[600px]'>

                    <DialogHeader>
                        <DialogTitle className='text-2xl font-bold text-purple-700'>Payment Details</DialogTitle>
                    </DialogHeader>

                    <div className='space-y-6'>

                      {/* first */}

                      <div className='bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-lg '>
                        <h3 className='font-semibold text-lg text-purple-800 mb-2'>Transaction Information</h3>

                        {/* grid */}

                        <div className='grid grid-cols-2 gap-2'>

                            <div className='text-sm font-medium text-gray-500'>
                                Amount :
                            </div>

                            <div className='text-sm font-medium text-gray-500'>
                              Rs {selectedPayment?.amount}
                            </div>

                            <div className='text-sm font-medium text-gray-500'>
                                Payment Method :
                            </div>

                            <div className='text-sm font-medium text-gray-500'>
                                {selectedPayment?.paymentMethod}
                            </div>

                           <div className='text-sm font-medium text-gray-500'>
                                Status :
                            </div>

                            <div className='text-sm'>
                                <span 
                                className=
                                {`px-2 py-1 rounded-full text-xs font-semibold 
                                  ${selectedPayment?.status==="complete" ? "bg-green-100 text-green-800"
                                   : selectedPayment?.status==="pending" ? "bg-yellow-100 text-yellow-800"
                                   : "bg-red-100 text-red-800"
                                   }
                                `}
                                >
                                  {selectedPayment?.status?.charAt(0)?.toUpperCase()+selectedPayment?.status?.slice(1)}
                                </span>
                            </div>

                            <div className='text-sm font-medium text-gray-500'>
                                Date :
                            </div>

                            <div className='text-sm font-medium text-gray-500'>
                                formatDate(selectedPayment?.createdAt)
                            </div>

                            <div className='text-sm font-medium text-gray-500'>
                                Processed By :
                            </div>

                            <div className='text-sm font-medium text-gray-500'>
                                {selectedPayment?.processedBy?.name}
                            </div>

                        </div>
                        {/* grid ends */}

                      </div>

                      {/* second */}

                      <div className='bg-gradient-to-r from-blue-100 to-cyan-100 p-4 rounded-lg '>

                        <h3 className='font-semibold text-lg text-purple-800 mb-2'>Seller Information</h3>

                        {/* grid */}

                        <div className='grid grid-cols-2 gap-2'>

                            <div className='text-sm font-medium text-gray-500'>
                                Name :
                            </div>

                            <div className='text-sm font-medium text-gray-500'>
                               {selectedPayment?.seller?.name}
                            </div>

                            <div className='text-sm font-medium text-gray-500'>
                                Email :
                            </div>

                            <div className='text-sm font-medium text-gray-500'>
                                {selectedPayment?.seller?.email}
                            </div>

                           <div className='text-sm font-medium text-gray-500'>
                                Phone :
                            </div>

                            <div className='text-sm font-medium text-gray-500'>
                             {selectedPayment?.seller?.phoneNumber || "Not Provided"}
                            </div>

                            <div className='text-sm font-medium text-gray-500'>
                                Payment Method :
                            </div>

                            <div className='text-sm font-medium text-gray-500'>
                                {selectedPayment?.seller?.paymentMode || "Not specified"}
                            </div>


                        </div>
                        {/* grid ends */}

                      </div>

                      {/* second */}

                      {/* last */}

                    <div className='bg-gradient-to-r from-green-100 to-teal-100 p-4 rounded-lg '>

                        <h3 className='font-semibold text-lg text-blue-800 mb-2'>Product & Order Information</h3>

                        {/* grid */}

                        <div className='grid grid-cols-2 gap-2'>

                            <div className='text-sm font-medium text-gray-500'>
                                Product :
                            </div>

                            <div className='text-sm font-medium text-gray-500'>
                               {selectedPayment?.product?.subject}
                            </div>

                            <div className='text-sm font-medium text-gray-500'>
                                Price :
                            </div>

                            <div className='text-sm font-medium text-gray-500'>
                                Rs{selectedPayment?.product?.finalPrice}
                            </div>

                           <div className='text-sm font-medium text-gray-500'>
                                Order Id :
                            </div>

                            <div className='text-sm font-medium text-gray-500'>
                             {selectedPayment?.order?._id?.slice(-6) || "Not Provided"}
                            </div>

                         


                        </div>
                        {/* grid ends */}

                        {/* notes */}
                        {selectedPayment?.notes && (
                            <div className='bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-lg'>
                                <h3 className='font-semibold text-lg text-yellow-600'>Notes</h3>
                                <p className='text-sm'>{selectedPayment?.notes}</p>
                            </div>
                        )}
                     
                        {/* notes */}



                    </div>


                      {/* last */}

                    </div>

                </DialogContent>

            </Dialog>
        )
     }


      
        
    </AdminLayout>
  )
}

export default page