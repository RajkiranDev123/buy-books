import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useProcessSellerPaymentsMutation } from '@/store/adminApi'
import { useRouter } from 'next/navigation'
import React,{useState} from 'react'
import toast from 'react-hot-toast'

interface OrderPaymentDialogProps{
  order:any,
  onClose:()=>void
}

const OrderPaymentDialog:React.FC<OrderPaymentDialogProps> = ({order,onClose}) => {

  const [selectedProduct,setSelectedProduct]=useState("")
  const [paymentMethod,setPaymentMethod]=useState("UPI")
  const [notes,setNotes]=useState("")
  const router=useRouter()
  const [processPayment,{isLoading}]=useProcessSellerPaymentsMutation()

  const handleSubmit=async(e:React.FormEvent)=>{
  e.preventDefault()
    try {

      await processPayment({
        orderId:order?._id,
        paymentData:{
          productId:selectedProduct,
          paymentMethod,
          amount:order.totalAmount,
          notes
        }
      }).unwrap()
      toast.success("Payment Processed.")
      onClose()
      router.refresh()
      
    } catch (error:any) {
      toast.error(error.data?.message || "Failed to process payment.")
    }
  }

  const getSelectProduct =()=>{
    if (!selectedProduct) return null
    return order.items.find((item:any)=>item.product._id===selectedProduct)?.product
  }
  const product=getSelectProduct()




  return (
    <form onSubmit={handleSubmit} className='space-y-4'>

      <div className='space-y-4'>

        <div className='space-y-2'>

          <Label htmlFor='status'>Select Product</Label>

          <Select value={selectedProduct} onValueChange={setSelectedProduct} required>

            <SelectTrigger><SelectValue placeholder="Select a Product" /></SelectTrigger>

            <SelectContent>

              {
                order?.items?.map((item:any)=>(
                     <SelectItem key={item?.product?._id} value={item?.product?._id}>{item?.product?.subject} (Rs{item?.product?.finalPrice})</SelectItem>
                ))
              }

            </SelectContent>

          </Select>

        </div>

        {product && (
          <Card>
            
          </Card>
        )}

 

        {/* notes */}
        <div className='space-y-2'>
          <Label htmlFor='notes'>Notes (Optional)</Label>
          <Textarea
          id='notes'
          value={notes}
          onChange={e=>setNotes(e.target.value)}
          placeholder='Add any additional notes about this update'
          rows={3}
          />
        </div>
        {/* notes */}

        {/* button */}
        <div className='flex justify-end space-x-2'>
        <Button type='button' variant={"outline"} onClick={onClose}>Cancel</Button>
        <Button disabled={isLoading} className='bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800'>
          {isLoading ? "Updating...":"Update Order"}
        </Button>
        </div>
        {/* button */}


      </div>

    </form>
  )
}

export default OrderPaymentDialog