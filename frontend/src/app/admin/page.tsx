"use client"
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react'
import { useSelector } from 'react-redux';
import AdminLayout from '../components/admin/AdminLayout';
import { useGetDashboardStatsQuery } from '@/store/adminApi';
import BookLoader from '@/lib/BookLoader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, TrendingUp } from 'lucide-react';

const page = () => {

  const user = useSelector((state: RootState) => state.user.user);
  const router = useRouter()

  const {data,isLoading,isError}=useGetDashboardStatsQuery({})
  const stats=data?.data
  console.log(stats)


  useEffect(()=>{
   if( user && user.role !== "admin" ){
    router.push("/")
   }
  },[ user, router ])

  // if(isLoading){
  //   return (
  //    <AdminLayout>
  //     <div className='flex justify-center items-center h-96'>
  //      <BookLoader/>
  //     </div>
  //    </AdminLayout>
  //   )
  // }

  // if(isError){
  //   return (
  //    <AdminLayout>
  //     <div className='text-center py-10'>
  //      <h2 className='text-2xl font-bold text-gray-700'>Failed to load Dashboard Data.</h2>
  //      <p className='text-gray-500 mt-2'>Please try again later.</p>
  //     </div>
  //    </AdminLayout>
  //   )
  // }

  // prepare data for charts

  const orderStatusData = [
    { name : "Processing", value : stats?.ordersByStatus?.processing, color : "#FFBB28" },
    { name : "Shipped", value : stats?.ordersByStatus?.shipped, color : "#0088FE" },
    { name : "Delivered", value : stats?.ordersByStatus?.delivered, color : "#00C49F" },
    { name : "Cancelled", value : stats?.ordersByStatus?.cancelled, color : "#FF8042" },
  ]

  //                    0      1      2      3      4      5      6      7      8      9     10      11
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const salesData = stats?.monthlySales?.map((item:any)=> ({
        name : `${monthNames[item?._id?.month - 1 ]} ${item?._id?.year}`,
        sales : item?.total,
        orders : item?.count
  })
)



  return (
    <div>

      <AdminLayout>

        <div className='space-y-4 '>

          <h1 className='text-3xl font-bold text-black/70'>Dashboard</h1>

          {/*  */}

          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-4'>

            {/* total orders */}
            <Card className='bg-linear-to-br from-purple-50 to-purple-100 shadow-md border-none'>

              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium text-gray-500'>Total Orders</CardTitle>
              </CardHeader>

              <CardContent>

                <div className='flex items-center'>

                  <div className='rounded-full bg-purple-200 p-2 mr-4'>
                    <ShoppingBag className='h-6 w-6 text-purple-700'/>
                  </div>

                  <div>

                    <div className='text-2xl font-bold text-gray-800'>{stats?.counts.orders}</div>

                    <p className='text-xs text-gray-500'>
                      <TrendingUp className='inline h-3 w-3 text-green-500 mr-1'/>
                      <span className='text-green-500 font-medium'>+12%</span>{" "}from last month
                    </p>

                  </div>
                  
                </div>

              </CardContent>

            </Card>
            {/* total orders ends */}

            {/* total users */}

            <Card className='bg-linear-to-br from-purple-50 to-purple-100 shadow-md border-none'>

              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium text-gray-500'>Total Users</CardTitle>
              </CardHeader>

              <CardContent>

                <div className='flex items-center'>

                  <div className='rounded-full bg-purple-200 p-2 mr-4'>
                    <ShoppingBag className='h-6 w-6 text-purple-700'/>
                  </div>

                  <div>

                    <div className='text-2xl font-bold text-gray-800'>{stats?.counts.users}</div>

                    <p className='text-xs text-gray-500'>
                      <TrendingUp className='inline h-3 w-3 text-green-500 mr-1'/>
                      <span className='text-green-500 font-medium'>+12%</span>{" "}from last month
                    </p>

                  </div>
                  
                </div>

              </CardContent>

            </Card>
      
            {/* total users ends */}

          </div>


          {/*  */}

          

        </div>

      </AdminLayout>

      
    </div>
  )
}

export default page