"use client"
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLoginMutation, useRegisterMutation } from "@/store/api";
import { authStatus } from "@/store/slice/userSlice";
import { AnimatePresence, motion } from "framer-motion";
import { Copy,Eye,EyeOff,Loader2,Lock,Mail,User } from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

interface LoginProps {
  isLoginOpen: boolean;
  setIsLoginOpen: () => void;
}

interface LoginFormData {
  email?: string;
  password?: string;
}

interface SignupFormData {
  email: string;
  name: string;
  password: string;
  agreeTerms: boolean;
}



const AuthPage: React.FC<LoginProps> = ({  setIsLoginOpen }) => {

 const dispatch = useDispatch()

  const [currentTab, setCurrenttab] = useState<"login" | "signup" >("login");
  const [showPassword, setShowPassword] = useState(false);

  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);



  const [register] = useRegisterMutation();
  const [login] = useLoginMutation();


  const router = useRouter();

  // login
  const { register: registerLogin, handleSubmit: handleLoginSubmit, formState: { errors: loginError } } = useForm<LoginFormData>();

  // registerLogin → register/track an input & store its value under the key email etc
  // handleLoginSubmit passes the form data to your callback function (submits the tracked data)

//   const user = {
//   name: "Rahul",
//   address: {
//     city: "Kolkata",
//     pin: 700001
//   }
// };

// const { address: { city } } = user;  // nested destructuring.

// why useForm<LoginFormData>() ?
// <input {...register("username")} />
// will give a TypeScript error because username isn't in LoginFormData.

  // signup
  const {
    register: registerSignup,
    handleSubmit: handleSignUpSubmit, // it validates your form before calling onSubmitSignUp
    formState: { errors: signUpError }
  } = useForm<SignupFormData>();



  const onSubmitSignUp = async (data: SignupFormData) => {

    setSignupLoading(true);

    try {

      const { email, password, name , agreeTerms  } = data;
      const result = await register({ email, password, name , agreeTerms,  role:"admin" }).unwrap();
      if (result.success) {
        toast.success(
          "Signup done.",
        );
        setCurrenttab("login")
    
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong.");
    } finally {
      setSignupLoading(false);
    }
  };

  const onSubmitLogin = async (data: LoginFormData) => {
    setLoginLoading(true);
    try {
      const result = await login(data).unwrap();
      if (result.success) {
        toast.success(result?.message);
        dispatch(authStatus())
        router.push("/admin");
        setTimeout(()=>{
          window.location.reload()
        },1000)
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    } finally {
      setLoginLoading(false)
    }
  };





  return (
    
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-100 to-indigo-100 p-4">

      <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">

        <div className="bg-gradient-to-r from bg-purple-600 to-indigo-700 text-white p-6 text-center">
            <h1 className="text-2xl font-bold">Buy Books Admin Portal</h1>
            <p className="text-purple-100 mt-1">Access the Admin Dashboard</p>
        </div>

        <div className="p-6 ">

        <Tabs
          value={currentTab}
          onValueChange={(value) => setCurrenttab(value as "login" | "signup" ) }
        >

          <TabsList className="grid w-full md:grid-cols-3 mb-15 gap-1 bg-white">

            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
     

          </TabsList>

          <AnimatePresence mode="wait">

            {/* Without mode="wait" ==> Old component goes out , New component comes in , Both happen together */}
            {/* motion can do exit animation, but only AnimatePresence lets it run */}

            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >

              {/* login tabs content */}

              <TabsContent value="login" className="space-y-4">

                <form onSubmit={handleLoginSubmit(onSubmitLogin)} className="space-y-4">

                  <div className="flex gap-4 items-center">
                    Test Email{" "}

                    <Copy
                      onClick={() => {
                        navigator.clipboard.writeText("rk7889666@gmail.com"); 
                        toast.success("Email copied!");
                      }}
                      className="cursor-pointer animate-pulse"
                      size={18}
                    />

                  </div>

                  <div className="relative">

                    <Input

                      {...registerLogin("email", {
                        required: "Email is Required.",
                      })}

                      placeholder="Email"
                      type="email"
                      className="pl-10"
                    />

                    <Mail
                      className="absolute left-3 top-1/2  -translate-y-1/2 text-gray-500"
                      size={20}
                    />

                  </div>

                  {loginError.email && ( <p className="text-red-500 text-sm"> {loginError.email.message} </p> )}

                  {/* passowrd */}
                  <div className="flex gap-4 items-center">

                    Test Password{" "}

                    <Copy
                      onClick={() => {
                        navigator.clipboard.writeText("admin123"); // ✅ fixed email
                        toast.success("Password copied!");
                      }}
                      className="cursor-pointer animate-pulse"
                      size={18}
                    />

                  </div>

                  <div className="relative">

                    <Input

                      {...registerLogin("password", {
                        required: "Password is Required.",
                      })}

                      placeholder="Password"
                      type={showPassword ? "text" : "password"}
                      className="pl-10"
                    />

                    <Lock
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      size={20}
                    />

                    {showPassword ? (
                      <Eye
                        onClick={() => setShowPassword(false)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                        size={20}
                      />
                    ) : (
                      <EyeOff
                        onClick={() => setShowPassword(true)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                        size={20}
                      />
                    )}

                  </div>

                  {loginError.password && (
                    <p className="text-red-500 text-sm">
                      {loginError.password.message}
                    </p>
                  )}

                  <Button type="submit" className="w-full bg-linear-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800">
                    {loginLoading ? (
                      <Loader2 className="animate-spin mr-2" size={20} />
                    ) : (
                      "Login as Admin"
                    )}
                  </Button>

                </form>

                <div className="text-center mt-4">
                  <Link className="text-sm text-purple-600 hover:underline" href={"/"}>Return to main site</Link>
                </div>

              </TabsContent>

              {/* login tabs content ends */}

              {/* signup tabs content starts*/}

              <TabsContent value="signup" className="space-y-4">
                <form
                  onSubmit={handleSignUpSubmit(onSubmitSignUp)}
                  className="space-y-4"
                >
                  <div className="relative">
                    <Input
                      {...registerSignup("name", {
                        required: "Name is Required",
                      })}
                      placeholder="Name"
                      type="text"
                      className="pl-10"
                    />
                    <User
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      size={20}
                    />
                  </div>
                  {signUpError.name && (
                    <p className="text-red-500 text-sm">
                      {signUpError.name.message}
                    </p>
                  )}
                  <div className="relative">
                    <Input
                      {...registerSignup("email", {
                        required: "Email is Required",
                      })}
                      placeholder="Email"
                      type="email"
                      className="pl-10"
                    />
                    <Mail
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      size={20}
                    />
                  </div>
                  {signUpError.email && (
                    <p className="text-red-500 text-sm">
                      {signUpError.email.message}
                    </p>
                  )}
                  {/* passowrd */}
                  <div className="relative">
                    <Input
                      {...registerSignup("password", {
                        required: "Password is Required",
                      })}
                      placeholder="Password"
                      type={showPassword ? "text" : "password"}
                      className="pl-10"
                    />
                    <Lock
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      size={20}
                    />
                    {showPassword ? (
                      <Eye
                        onClick={() => setShowPassword(false)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                        size={20}
                      />
                    ) : (
                      <EyeOff
                        onClick={() => setShowPassword(true)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                        size={20}
                      />
                    )}
                  </div>
                  {signUpError.password && (
                    <p className="text-red-500 text-sm">
                      {signUpError.password.message}
                    </p>
                  )}
                  <div className="flex items-center">
                    <input
                      className="mr-2"
                      type="checkbox"
                      {...registerSignup("agreeTerms", {
                        required: "You must agree to the terms & conditions.",
                      })}
                    />
                    <label className="text-sm text-gray-700">
                      I agree to the terms and conditions
                    </label>
                  </div>

                  {signUpError.agreeTerms && (
                    <p className="text-red-500 text-sm">
                      {signUpError.agreeTerms.message}
                    </p>
                  )}

                  <Button type="submit" className="w-full bg-linear-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800">
                    {signupLoading ? (
                      <Loader2 className="animate-spin mr-2" size={20} />
                    ) : (
                      "Create Admin Account"
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* signup tab ends*/}

         
            </motion.div>

          </AnimatePresence>

        </Tabs>

        {/* tabs ends */}

        {/* privacy policy etc starts : common for all tabs */}

        {currentTab == "signup" && <p className="text-sm mt-2 text-center text-gray-600">

          By Clicking 'agree' , you agree to our{" "}

          <Link onClick={setIsLoginOpen}
            href={"/terms-of-use"}
            className="text-blue-500 hover:underline"
          >
            Terms of Use ,
          </Link>

          <Link onClick={setIsLoginOpen}
            href={"/privacy-policy"}
            className="text-blue-500 hover:underline"
          >
            {" "}
            Privacy Policy
          </Link>

        </p>}

        {/* privacy policy etc ends */}

        </div>

      </div>



     

    </div>

  );
};

export default AuthPage;
