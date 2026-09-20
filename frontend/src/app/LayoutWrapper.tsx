"use client";
import React from "react";
import { Toaster } from "react-hot-toast";

import { Provider } from "react-redux";

import { store, persistor } from "@/store/store";
import { PersistGate } from "redux-persist/integration/react";
// It delays rendering your app until Redux state is restored  from local-storage.

import BookLoader from "@/lib/BookLoader";
import AuthCheck from "@/store/Provider/AuthProvider";

import Header from "./components/Header";
import Footer from "./components/Footer";
import { usePathname } from "next/navigation";


// children ==> header , children/page.tsx , footer
const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname=usePathname()
  const isAdminRoute=pathname.startsWith("/admin")
  return (
    <Provider store={store}>
      <PersistGate loading={<BookLoader />} persistor={persistor}>
        <Toaster />
     
        <AuthCheck>
          
          {!isAdminRoute && <Header/>}
          {children}
          {!isAdminRoute && <Footer/>}

        </AuthCheck>
      </PersistGate>
    </Provider>
  );
};

export default LayoutWrapper;

// LayoutWrapper exists mainly to keep layout.tsx as a server component and move all client-side logic into a client component.
