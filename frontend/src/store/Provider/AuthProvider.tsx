import { useEffect, useState } from "react";
import { useVerifyAuthMutation } from "../api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import BookLoader from "@/lib/BookLoader";
import { logout, setEmailVerified, setUser } from "../slice/userSlice";

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const [verifyAuth, { isLoading }] = useVerifyAuthMutation();
  // useVerifyAuthMutation hook returns :
  //   [ triggerFunction,resultObject]
  //   {isLoading,isSuccess,isError,data,error}
  // Query = auto : Runs automatically when component loads , Mutation = mutation, we have to call manually
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  //Check if user is logged in / token valid
  const checkAuth = async () => {
    try {
      const response = await verifyAuth({}).unwrap();
      console.log(77, response);
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

  //[verifyAuth,dispatch,user] ==> the user state changes → useEffect runs again → checkAuth() runs again → another API call.

  if (isLoading || isCheckingAuth) {
    return <BookLoader />;
  }

  return <>{children}</>;
}
