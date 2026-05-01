// layout.tsx (server)
//    ↓
// LayoutWrapper ("use client")
//    ↓
// AuthCheck (implicitly client)
//    ↓
// children

// Implicit : Imported inside a client component
// Explicit : "use client"

import { useEffect, useState } from "react";
import { useVerifyAuthMutation } from "../api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import BookLoader from "@/lib/BookLoader";
import { logout, setEmailVerified, setUser } from "../slice/userSlice";

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const [verifyAuth, { isLoading }] = useVerifyAuthMutation();
  console.log("Auth Check : isLoading  ==>", isLoading);
  // useVerifyAuthMutation hook returns : [ triggerFunction,{isLoading,isSuccess,isError,data,error}=resultObject]
  // Query = auto : Runs automatically when component loads ,  mutation ==> we have to call manually
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const dispatch = useDispatch();
  //
  const user = useSelector((state: RootState) => state.user.user);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  //Check if user is logged in / token valid
  const checkAuth = async () => {
    try {
      const response = await verifyAuth({}).unwrap();

      if (response.success) {
        dispatch(setUser(response.data));
        dispatch(setEmailVerified(response.data.isVerified));
      } else {
        dispatch(logout());
      }
    } catch (error) {
      dispatch(logout());
    } finally {
      setIsCheckingAuth(false);
    }
  };

  useEffect(() => {
    checkAuth();
    // if (!user && isLoggedIn) {
    //   checkAuth();
    // }
  }, [verifyAuth, dispatch]);

  if (isLoading || isCheckingAuth) {
    // if isLoading == true then stop , or ==> any 1 true then true
    // return stops the AuthCheck component function execution, not the whole app.
    // this block runs when :
    // API is running (isLoading = true)
    // OR auth check not finished (isCheckingAuth = true)
    return <BookLoader />;
  }

  return <>{children}</>;
}
