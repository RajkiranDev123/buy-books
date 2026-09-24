
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { usePathname, useRouter } from 'next/navigation'
import { ChevronDown, CreditCard, LayoutDashboard, LogOut, Menu, ShoppingBag, User, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useLogoutMutation } from '@/store/api'
import { logout } from '@/store/slice/userSlice'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface AdminLayoutProps{
  children:React.ReactNode
}

const AdminLayout : React.FC<AdminLayoutProps>= ({children}) => {

  const dispatch = useDispatch()

  const user = useSelector( ( state : RootState ) => state.user.user)

  const router = useRouter()
  const pathname = usePathname()


  const [logoutMutation] = useLogoutMutation()

  const [sidebarOpen, setSidebarOpen] = useState(false)


  const handleProtectedNavigation = (href : string ) => {

    if(user){
      router.push(href)
    } else{
      router.push("/admin/login")
    }

  }

    const handleLogout = async () => {
    try {
      await logoutMutation({}).unwrap();
      dispatch(logout());
      toast.success("Logout done.");
      router.push("/admin")

    } catch (error) {
      toast.error("Failed to logout.");
    }
  }

    const userPlaceholder = user?.name // raj kiran
    ?.split(" ") // ["raj","kiran"]
    .map((name: string) => name[0]) //["r","k"]
    .join(""); // "rk"

  const navigation = [

    {
      name : "Dashboard",
      onClick : ()=> router.push("/admin"),
      icon:LayoutDashboard,
      href:"/admin",
      bgColor : "from-purple-500 to-indigo-600",
      hoverTextColor:"text-purple-600",
      hoverIconColor: "group-hover:text-purple-600"

    },
    {
      name : "Orders",
      onClick : ()=> handleProtectedNavigation("/admin/orders"),
      icon:ShoppingBag,
      href:"/admin/orders",
      bgColor : "from-blue-500 to-cyan-600",
      hoverTextColor:"text-blue-600",
      hoverIconColor: "group-hover:text-blue-600"
    },
    {
      name : "Payments",
      onClick : () => handleProtectedNavigation("/admin/orders"),
      icon:CreditCard,
      href:"/admin/payments",
      bgColor : "from-pink-500 to-rose-600",
      hoverTextColor:"text-pink-600",
      hoverIconColor: "group-hover:text-pink-600"

    }

  ]

    
  return (

    <div className='min-h-screen '>

      {/* mobile  */}

      <div className='lg:hidden '>

        <Button
        variant={"ghost"} // no visible background/border, but it gets a hover background when you move the mouse over it.
        onClick={() => setSidebarOpen(prev => !prev)}
        size="icon"
        className='fixed top-4 left-4 z-50 cursor-pointer'
        > {sidebarOpen ? <X/> : <Menu/> } </Button>

        {sidebarOpen && ( <div className='fixed inset-0 z-40 bg-black/50' onClick={()=>setSidebarOpen(prev => !prev)} /> )}

  

      {/* -translate-x-full → hidden by moving left and translate-x-0 → visible in normal position */}
      {/* You can use a template literal (${}) instead of cn() for simple cases */}
      {/* cn() is useful when you have many conditional classes */}

      {/* When two elements have the same z-index, CSS uses their stacking order. In this simple case, the element that comes later is painted on top. */}

      <aside className={cn(`fixed inset-y-0 left-0 z-40 w-64  duration-300 ease-in-out`, sidebarOpen ? "translate-x-0 ":"-translate-x-full")}>

        <div className='flex rounded-r-md h-16 items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-700 text-white'>
          <h1 className='text-xl ml-5 font-semibold'>Buy Books Admin</h1>
        </div>
       
        <nav className='h-full overflow-y-auto bg-white shadow-lg'>

          <div className='mt-5 px-2 space-y-1'>

            {
              navigation.map(item => (
                <button
                key={item.name}
                onClick={item.onClick}
                className={
                  // group lets you change a child when you hover the parent.
                  cn(
                   "group w-full flex items-center px-4 py-2 text-base font-medium rounded-md  duration-300 cursor-pointer",
                    pathname === item.href ? `bg-linear-to-r ${item.bgColor} text-white`:`text-gray-600 hover:bg-gray-50 ${item.hoverTextColor}`
                  )
                }

                >

                 <item.icon className={cn(
                 "mr-3 h-6 w-6",
                 pathname === item.href ? "text-white":`text-gray-400 ${item.hoverIconColor}`
                 )} />
                 {item.name}

                </button>
              ))
            }

          </div>

          {/* logout */}
          <div className='absolute bottom-0 w-full p-4 border-l'>
            <Button 
            variant={"ghost"}
            onClick={handleLogout}
            className='w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer'>
              <LogOut/>  Logout
            </Button>
          </div>
          {/* logout */}

        </nav>


      </aside>

      </div>

      {/* mobile ends */}

      {/* desktop sidebar starts*/}


      <div className='hidden lg:fixed   lg:inset-y-0 lg:w-64 lg:flex lg:flex-col'>

      <div className='flex flex-col flex-grow overflow-y-auto'>
        {/* overflow-y-auto = make the element vertically scrollable when its content exceeds its height , 
        vertical scrollbar only when needed. */}

        {/* logo */}
        <div className='flex rounded-r-md h-16 items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-700 text-white'>
          <h1 className='text-xl font-semibold'>Buy Books Admin</h1>
        </div>
        {/* logo ends */}
       
       {/* nav */}
        <nav className=' bg-white shadow-lg flex-1'>

          
          <div className='mt-5 flex-1 px-2 space-y-1'>

            {
              navigation.map(item => (
                <button
                key={item.name}
                onClick={item.onClick}
                className={
                  // group lets you change a child when you hover the parent.
                  cn(
                   "group w-full flex items-center px-4 py-2 text-base font-medium rounded-md  duration-300 cursor-pointer",
                    pathname === item.href ? `bg-linear-to-r ${item.bgColor} text-white`:`text-gray-600 hover:bg-gray-50 ${item.hoverTextColor}`
                  )
                }

                >

                 <item.icon className={cn(
                 "mr-3 h-6 w-6",
                 pathname === item.href ? "text-white":`text-gray-400 ${item.hoverIconColor}`
                 )} />
                 {item.name}

                </button>
              ))
            }

          </div>

          {/* logout */}
          <div className='p-4 border-t mt-auto '>
 
            <Button 
            variant={"ghost"}
            onClick={handleLogout}
            className='w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer'>
              <LogOut/>  Logout
            </Button>
          </div>
          {/* logout */}

        </nav>
        {/* nav ends */}


      </div>


      </div>


      {/* desktop sidebar ends*/}

      {/* main starts*/}

      <div className={`lg:pl-64 ${sidebarOpen?"pl-64":""} flex flex-col `}>

        {/* header */}
        <header className='bg-white shadow-sm '>


          <div className='flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8'>

            {/* name */}
            <h1 className='text-xl ml-10 font-semibold text-gray-800'>
              {navigation.find(item=>item.href===pathname)?.name || "Admin Panel"}
            </h1>
            {/* name ends */}

            <div className='flex-end items-center space-x-4'>

              <DropdownMenu>

                <DropdownMenuTrigger asChild>

                  <Button variant={"ghost"} className='flex items-center space-x-2'>

                    <Avatar className='w-8 h-8 rounded-full'>

                      {user?.profilePicture ? (
                        <AvatarImage src={user?.profilePicture} alt='User'/>
                      )
                      : userPlaceholder? (
                        <AvatarFallback>{userPlaceholder}</AvatarFallback>
                      )
                      :(
                        <User className='ml-2 mt-2'/>
                      )
                      
                    }

                    </Avatar>

                    {user ? (
                     <div className='hidden md:block text-left'>

                      <p className='text-sm font-medium'>{user?.name}</p>
                      <p className='text-xs text-gray-500'>{user?.email}</p>

                     </div>
                    ):(
                      <p className='text-md font-medium'>My Account</p>
                    )}

                    <ChevronDown className='h-4 w-4 text-gray-500'/>

                  </Button>

                </DropdownMenuTrigger>

                <DropdownMenuContent align='end'>

                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator/>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Setting</DropdownMenuItem>
                  <DropdownMenuSeparator/>
                  {
                    user ? (

                    <DropdownMenuItem className='text-red-600' onClick={handleLogout}>Logout</DropdownMenuItem>
                    
                    ):(

                    <DropdownMenuItem className='text-red-600' onClick={()=>router.push("/admin/login")}>Login</DropdownMenuItem>
                    
                    )
                  }

                </DropdownMenuContent>

              </DropdownMenu>
              
            </div>
            

          </div>


        </header>
        {/* header ends */}

        {/* main */}

        <main className='flex-1 pb-8'>

          <div className='py-6'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 md:px-8'>
           {children}
          </div>
          </div>

        </main>

        {/* main ends */}

      </div>

      {/* main ends */}

    </div>

  )
}

export default AdminLayout