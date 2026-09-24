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

// import { RootState } from "../store";

import BookLoader from "@/lib/BookLoader";

import { logout, setEmailVerified, setUser } from "../slice/userSlice";

export default function AuthCheck({ children }: { children: React.ReactNode }) {

  const [verifyAuth, { isLoading }] = useVerifyAuthMutation();
  // false → mutation is not currently running and true → verifyAuth() request is currently running 
  // When the verifyAuth() request finishes, isLoading becomes false again.
  // initially ==> false

  // useVerifyAuthMutation hook returns : [ triggerFunction , {isLoading , isSuccess , isError , data, error } = resultObject ]
  // use...Query() = Runs automatically when component loads ,  mutation ==> we have to call manually

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const dispatch = useDispatch();
  
  // const user = useSelector((state: RootState) => state.user.user);


  // Check if user is logged in / token valid

  const checkAuth = async () => {
  
    try {

      const response = await verifyAuth({}).unwrap();
      // {} ==> I'm calling the mutation, but I have no data to send.
      // no .unwrap() ==> RTK Query returns its result object instead of directly giving you the response data.

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
  }, [verifyAuth, dispatch]);

  if (isLoading || isCheckingAuth) {
    return <BookLoader />;
    // return does not remove/unmount a component from React's component tree.
    // only when navigation to another component or when condition is like ==> { false && <AuthCheck/> }
  }

  return <>{children}</>;
}
