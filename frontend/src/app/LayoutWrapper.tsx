"use client";
import React from "react";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store, persistor } from "@/store/store";
import { PersistGate } from "redux-persist/integration/react"; 
import BookLoader from "@/lib/BookLoader";
import AuthCheck from "@/store/Provider/AuthProvider";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={<BookLoader />} persistor={persistor}>
        <Toaster />
        <AuthCheck>{children}</AuthCheck>
      </PersistGate>
    </Provider>
  );
};

export default LayoutWrapper;
