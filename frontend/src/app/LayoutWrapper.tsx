"use client";
import React from "react";
import { Toaster } from "react-hot-toast";

import { Provider } from "react-redux";

import { store, persistor } from "@/store/store";
import { PersistGate } from "redux-persist/integration/react";
// It delays rendering your app until Redux state is restored  from local-storage.

import BookLoader from "@/lib/BookLoader";
import AuthCheck from "@/store/Provider/AuthProvider";

// children ==> header , children/page.tsx , footer
const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={<BookLoader />} persistor={persistor}>
        <Toaster />
        {/* { children }  =   <Header /> , {children/page.tsx} , <Footer /> */}
        <AuthCheck>{children}</AuthCheck>
      </PersistGate>
    </Provider>
  );
};

export default LayoutWrapper;

// LayoutWrapper exists mainly to keep layout.tsx as a server component and move all client-side logic into a client component.
