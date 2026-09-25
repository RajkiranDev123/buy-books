"use client"
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react'
import { useSelector } from 'react-redux';
import AdminLayout from '../components/admin/AdminLayout';
import { useGetDashboardStatsQuery } from '@/store/adminApi';

const page = () => {

  const user = useSelector((state: RootState) => state.user.user);

  const {data,isLoading,isError}=useGetDashboardStatsQuery({})

  console.log(data)

  const router = useRouter()

  useEffect(()=>{
   if( user && user.role !== "admin" ){
    router.push("/")
   }
  },[ user, router ])

  return (
    <div>

      <AdminLayout>
        m
      </AdminLayout>

      
    </div>
  )
}

export default page