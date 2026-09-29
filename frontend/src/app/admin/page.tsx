"use client"
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react'
import { useSelector } from 'react-redux';
import AdminLayout from '../components/admin/AdminLayout';
import { useGetDashboardStatsQuery } from '@/store/adminApi';
import BookLoader from '@/lib/BookLoader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, IndianRupee, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import {BarChart,CartesianGrid,XAxis,YAxis,Tooltip,Legend,Bar,ResponsiveContainer,Pie,PieChart,Cell} from "recharts"

const page = () => {

  const user = useSelector((state: RootState) => state?.user?.user);
  const router = useRouter()

  const {data,isLoading,isError}=useGetDashboardStatsQuery({})
  const stats=data?.data
  console.log(stats)


  useEffect(()=>{
   if( user && user.role !== "admin" ){
    router.push("/")
   }
  },[ user, router ])

  if(isLoading){
    return (
     <AdminLayout>
      <div className='flex justify-center items-center h-96'>
       <BookLoader/>
      </div>
     </AdminLayout>
    )
  }

  if(isError){
    return (
     <AdminLayout>
      <div className='text-center py-10'>
       <h2 className='text-2xl font-bold text-gray-700'>Failed to load Dashboard Data.</h2>
       <p className='text-gray-500 mt-2'>Please try again later.</p>
      </div>
     </AdminLayout>
    )
  }

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
  

      <AdminLayout>

        <div className='space-y-4 '>

          <h1 className='text-3xl font-bold text-black/70'>Dashboard</h1>

          {/* cards */}

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

                    <div className='text-2xl font-bold text-gray-800'>{stats?.counts?.orders}</div>

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

            <Card className='bg-linear-to-br from-blue-50 to-blue-100 shadow-md border-none'>

              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium text-gray-500'>Total Users</CardTitle>
              </CardHeader>

              <CardContent>

                <div className='flex items-center'>

                  <div className='rounded-full bg-blue-200 p-2 mr-4'>
                    <Users className='h-6 w-6 text-blue-700'/>
                  </div>

                  <div>

                    <div className='text-2xl font-bold text-gray-800'>{stats?.counts?.users}</div>

                    <p className='text-xs text-gray-500'>
                      <TrendingUp className='inline h-3 w-3 text-green-500 mr-1'/>
                      <span className='text-green-500 font-medium'>+10%</span>{" "}from last month
                    </p>

                  </div>
                  
                </div>

              </CardContent>

            </Card>
      
            {/* total users ends */}

            {/* products total */}

            <Card className='bg-linear-to-br from-green-50 to-green-100 shadow-md border-none'>

              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium text-gray-500'>Total Products</CardTitle>
              </CardHeader>

              <CardContent>

                <div className='flex items-center'>

                  <div className='rounded-full bg-green-200 p-2 mr-4'>
                    <BookOpen  className='h-6 w-6 text-green-700'/>
                  </div>

                  <div>

                    <div className='text-2xl font-bold text-gray-800'>{stats?.counts?.products}</div>

                    <p className='text-xs text-gray-500'>
                      <TrendingUp className='inline h-3 w-3 text-green-500 mr-1'/>
                      <span className='text-green-500 font-medium'>+5%</span>{" "}from last month
                    </p>

                  </div>
                  
                </div>

              </CardContent>

            </Card>
      
            {/* products total */}

            {/* revenue */}

            <Card className='bg-linear-to-br from-amber-50 to-amber-100 shadow-md border-none'>

              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium text-gray-500'>Total Revenue</CardTitle>
              </CardHeader>

              <CardContent>

                <div className='flex items-center'>

                  <div className='rounded-full bg-amber-200 p-2 mr-4'>
                    <IndianRupee className='h-6 w-6 text-amber-700'/>
                  </div>

                  <div>

                    <div className='text-2xl font-bold text-gray-800'>{stats?.counts?.revenue?.toLocaleString()}</div>

                    <p className='text-xs text-gray-500'>
                      <TrendingUp className='inline h-3 w-3 text-green-500 mr-1'/>
                      <span className='text-green-500 font-medium'>+9%</span>{" "}from last month
                    </p>

                  </div>
                  
                </div>

              </CardContent>

            </Card>
      
            {/* revenue */}

          </div>

          {/* cards ends */}

          {/* charts */}

          <div className='grid gap-6 lg:grid-cols-2'>

            <Card className='shadow-md'>

              <CardHeader>
                <CardTitle>Monthly Sales</CardTitle>
              </CardHeader>

              <CardContent>

                <div className='h-80'>

                  <ResponsiveContainer width={"100%"} height={"100%"}>

                    <BarChart
                    data={salesData}
                    margin={{top:20,right:30,left:20,bottom:5}}
                    >
                      <CartesianGrid strokeDasharray={"2 2"}/>
                      <XAxis dataKey={"name"}/>
                      <YAxis/>
                      <Tooltip/>
                      <Legend/>
                      <Bar dataKey={"sales"} name={"Sales (Rs)"} fill='#8884d' radius={[4,4,0,0]}/>
                      <Bar dataKey={"orders"} name={"Orders"} fill='#82ca9d' radius={[4,4,0,0]}/>

                    </BarChart>

                  </ResponsiveContainer>

                </div>

              </CardContent>

            </Card>


            {/* pie */}

            <Card className='shadow-md'>

              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>

              <CardContent>

                <div className='h-80'>

                  <ResponsiveContainer width={"100%"} height={"100%"}>

                    <PieChart>
                      
                      <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="45%"
                      labelLine={false}
                      outerRadius={65}
                      dataKey="value"
                      label={({ name, value }) =>   value > 0 ? `${name}: ${value}%` : "" }>

                      {orderStatusData?.map((entity, index) => ( <Cell key={`cell-${index}`} fill={entity.color}/>))}

                     </Pie>
                      
                      <Tooltip/>
                      <Legend/>
            
                    </PieChart>

                  </ResponsiveContainer>

                </div>

              </CardContent>

            </Card>

            {/* pie */}

          </div>

          {/* charts ends */}

          {/* recent orders */}

          <Card>

            <CardHeader><CardTitle>Recent Orders</CardTitle></CardHeader>

            <CardContent>

              <div className='overflow-x-auto'>

                <table className='w-full texr-sm text-left'>

                  <thead className='text-xs text-gray-700 uppercase bg-gray-50'>

                    <tr>
                      <th scope='col' className='px-6 py-3'>Order Id</th>
                      <th scope='col' className='px-6 py-3'>Customer</th>
                      <th scope='col' className='px-6 py-3'>Date</th>
                      <th scope='col' className='px-6 py-3'>Amount</th>
                      <th scope='col' className='px-6 py-3'>Status</th>
                    </tr>

                  </thead>

                  <tbody>

                    {stats?.recentOrders?.map((order:any)=>(

                    <tr key={order?._id} className='bg-white border-b hover:bg-gray-50'>
                      <td className='px-6 py-4'>#{order?._id?.slice(-6)}</td>
                      <td className='px-6 py-4'>{order?.user?.name}</td>
                      <td className='px-6 py-4'>{new Date(order?.createdAt).toLocaleDateString()}</td>
                      <td className='px-6 py-4'>Rs {order?.totalAmount}</td>
                      <td className='px-6 py-4'>
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
                      </td>
                      {/* *: is a variant that targets all direct children. */}


                    </tr>

                    ))}
                 
                  </tbody>

                </table>

              </div>

            </CardContent>
            


          </Card>

          {/* recent orders */}

        </div>

      </AdminLayout>

      

  )
}

export default page