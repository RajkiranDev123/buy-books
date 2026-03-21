import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLoginMutation, useRegisterMutation } from "@/store/api";
import { toggleLoginDialog } from "@/store/slice/userSlice";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

interface LoginProps {
  isLoginOpen: boolean;
  setIsLoginOpen: (open: boolean) => void;
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
interface ForgetPasswordFormData {
  email: string;
}
const AuthPage: React.FC<LoginProps> = ({ isLoginOpen, setIsLoginOpen }) => {
  const dispatch = useDispatch();
  const [currentTab, setCurrenttab] = useState<"login" | "signup" | "forgot">(
    "login",
  );
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);

  const [register] = useRegisterMutation();
  const [login] = useLoginMutation();

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginError },
  } = useForm<LoginFormData>();

  const {
    register: registerSignup,
    handleSubmit: handleSignUpSubmit, // it validates your form before calling onSubmitSignUp
    formState: { errors: signUpError },
  } = useForm<SignupFormData>();

  const {
    register: registerForgotPassword,
    handleSubmit: handleForgotPasswordSubmit,
    formState: { errors: forgotPasswordError },
  } = useForm<ForgetPasswordFormData>();

  const onSubmitSignUp = async (data: SignupFormData) => {
    setSignupLoading(true);
    try {
      const { email, password, name } = data;
      const result = await register({ email, password, name }).unwrap();
      if (result.success) {
        toast.success("verification link sent to email, plz verify your email");
        dispatch(toggleLoginDialog());
      }
    } catch (error) {
      toast.error("Email already registered");
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
      <DialogContent className="sm:max-w-[425px] p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold mb-4">
            Welcome to Buy Books
          </DialogTitle>
        </DialogHeader>
        {/* tabs start */}
        <Tabs
          value={currentTab}
          onValueChange={(value) =>
            setCurrenttab(value as "login" | "signup" | "forgot")
          }
        >
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="forgot">Forgot Password ?</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* login tab */}
              <TabsContent value="login" className="space-y-4">
                <form className="space-y-4">
                  <div className="relative">
                    <Input
                      {...registerLogin("email", {
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
                  {loginError.email && (
                    <p className="text-red-500 text-sm">
                      {loginError.email.message}
                    </p>
                  )}
                  {/* passowrd */}
                  <div className="relative">
                    <Input
                      {...registerLogin("password", {
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
                      <EyeOff
                        onClick={() => setShowPassword(false)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                        size={20}
                      />
                    ) : (
                      <Eye
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
                  <Button type="submit" className="w-full font-bold">
                    {loginLoading ? (
                      <Loader2 className="animate-spin mr-2" size={20} />
                    ) : (
                      "Login"
                    )}
                  </Button>
                </form>
                <div className="flex items-center my-4">
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <p className="mx-2 text-gray-500 text-sm">Or</p>
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                <Button
                  className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 border
                   border-gray-300 hover:bg-gray-50"
                >
                  {googleLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" />
                    </>
                  ) : (
                    <>
                      <Image
                        src={"/icons/google.svg"}
                        alt="google"
                        width={20}
                        height={20}
                      />
                      Login with Google
                    </>
                  )}
                </Button>
              </TabsContent>
              {/* signup tab starts*/}
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
                      <EyeOff
                        onClick={() => setShowPassword(false)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                        size={20}
                      />
                    ) : (
                      <Eye
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
                        required: "You must agree to the terms & conditions",
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

                  <Button type="submit" className="w-full font-bold">
                    {signupLoading ? (
                      <Loader2 className="animate-spin mr-2" size={20} />
                    ) : (
                      "Sign Up"
                    )}
                  </Button>
                </form>
              </TabsContent>
              {/* signup tab ends*/}

              {/* forgot password tab starts */}

              <TabsContent value="forgot" className="space-y-4">
                {!forgotPasswordSuccess ? (
                  <form className="space-y-4">
                    <div className="relative">
                      <Input
                        {...registerForgotPassword("email", {
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
                    {forgotPasswordError.email && (
                      <p className="text-red-500 text-sm">
                        {forgotPasswordError.email.message}
                      </p>
                    )}

                    <Button type="submit" className="w-full font-bold">
                      {forgotPasswordLoading ? (
                        <Loader2 className="animate-spin mr-2" size={20} />
                      ) : (
                        "Send Reset Link"
                      )}
                    </Button>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center space-y-4"
                  >
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                    <h3 className="text-xl font-semibold text-gray-700 ">
                      Reset Link Sent
                    </h3>
                    <p className="text-gray-500 ">
                      We have sent a password reset link to your email.
                    </p>
                    <Button
                      onClick={() => setForgotPasswordSuccess(false)}
                      className="w-full"
                    >
                      Send another link to email
                    </Button>
                  </motion.div>
                )}
              </TabsContent>

              {/*  */}
            </motion.div>
          </AnimatePresence>
        </Tabs>
        {/* tabs ends */}

        {/* privacy policy etc starts */}
        <p className="text-sm mt-2 text-center text-gray-600">
          By Clicking 'agree' , you agree to our{" "}
          <Link
            href={"/terms-of-use"}
            className="text-blue-500 hover:underline"
          >
            Terms of Use ,
          </Link>
          <Link
            href={"/privacy-policy"}
            className="text-blue-500 hover:underline"
          >
            {" "}
            Privacy Policy
          </Link>
        </p>
        {/* privacy policy etc starts */}
      </DialogContent>
    </Dialog>
  );
};

export default AuthPage;
