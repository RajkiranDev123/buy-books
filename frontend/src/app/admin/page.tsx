"use client"
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react'
import { useSelector } from 'react-redux';
import AdminLayout from '../components/admin/AdminLayout';

const page = () => {

  const user = useSelector((state: RootState) => state.user.user);

  const router = useRouter()

  useEffect(()=>{
  if( user && user.role !== "admin" ){
    router.push("/")
  }
  },[user,router])

  return (
    <div>

      <AdminLayout>
        m
      </AdminLayout>





      
    </div>
  )
}

export default page