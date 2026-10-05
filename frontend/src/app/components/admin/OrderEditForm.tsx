
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUpdateOrderMutation } from '@/store/adminApi';
import { useRouter } from 'next/navigation';
import React,{useState} from 'react'
import toast from 'react-hot-toast';

interface OrderEditFormProps{
  order:any;
  onClose : ()=>void
}

const OrderEditForm :React.FC<OrderEditFormProps> = ({order,onClose}) => {

  const router = useRouter()

  const [status,setStatus]=useState(order.status)
  const [paymentStatus,setPaymentStatus]=useState(order.paymentStatus)
  const [notes,setNotes]=useState("")

  const [updateOrder, {isLoading}] = useUpdateOrderMutation()

  const handleSubmit = async(e:React.FormEvent)=>{
    e.preventDefault()
    try {

      await updateOrder({
        orderId:order._id,
        update:{
          status,paymentStatus,notes
        }
      })
      toast.success("Order updated.")
      onClose()
      router.refresh()
      
    } catch (error:any) {
      toast.error(error.data?.message || "Failed to update order.")
    }
  }
  return (
    <form onSubmit={handleSubmit} className='space-y-4'>

      <div className='space-y-4'>
        <div className='space-y-2'>

          <Label htmlFor='status'>Order Status</Label>

          <Select value={status} onValueChange={setStatus} required>
            <SelectTrigger><SelectValue placeholder="Select Order Status" /></SelectTrigger>

            <SelectContent>
              <SelectItem value='processing'>Processing</SelectItem>
              <SelectItem value='shipped'>Shipped</SelectItem>
              <SelectItem value='delivered'>Delivered</SelectItem>
              <SelectItem value='cancelled'>Cancelled</SelectItem>
            </SelectContent>

          </Select>


        </div>
      </div>

    </form>
  )
}

export default OrderEditForm