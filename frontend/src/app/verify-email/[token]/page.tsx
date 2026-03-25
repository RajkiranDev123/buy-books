"use  client";
import { useVerifyEmailMutation } from "@/store/api";
import { authStatus, setEmailVerified } from "@/store/slice/userSlice";
import { RootState } from "@/store/store";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const page: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const dispatch = useDispatch();
  const [verifyEmail] = useVerifyEmailMutation();
  const isVerifyEmail = useSelector(
    (state: RootState) => state.user.isEmailVerified,
  );
  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "alreadyVerified" | "Failed"
  >("loading");

  useEffect(() => {
    const verify = async () => {
      if (isVerifyEmail) {
        setVerificationStatus("alreadyVerified");
        return;
      }
      try {
        const result = await verifyEmail(token).unwrap();
        if (result.success) {
          dispatch(setEmailVerified(true));
          setVerificationStatus("success");
          dispatch(authStatus());
          toast.success("Email verified successfully");
          setTimeout(() => {
            window.location.href = "/";
          }, 3000);
        } else {
          throw new Error(result.message || "Verification failed");
        }
      } catch (error) {
        toast.error("Failed to verify your email");
      }
    };
    if(token){
      verify()
    }
  }, [token,verifyEmail,dispatch,isVerifyEmail]);
  return <div>page</div>;
};

export default page;
