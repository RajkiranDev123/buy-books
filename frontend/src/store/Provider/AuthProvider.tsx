import { useEffect, useState } from "react";
import { useVerifyAuthMutation } from "../api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import BookLoader from "@/lib/BookLoader";

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const [verifyAuth, { isLoading }] = useVerifyAuthMutation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  const checkAuth = async () => {
    try {
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {}, []);

  if (isLoading || isCheckingAuth) {
    return <BookLoader />;
  }

  return <>{children}</>;
}
