"use client";
import { Facebook, Instagram, Shield, Twitter, Youtube } from "lucide-react";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-12 md:grid-cols-4">
          {/* 1 */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">About Us</h3>
            <ul className="space-y-2">
              <li className="cursor-pointer">
                <Link className="hover:text-white" href={"/about-us"}>
                  About Us
                </Link>
              </li>
              <li className="cursor-pointer">
                <Link className="hover:text-white" href={"/contact-us"}>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          {/* 1 */}
          {/* 2 */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">
              USEFULL LINKS
            </h3>
            <ul className="space-y-2">
              <li className="cursor-pointer">
                <Link className="hover:text-white" href={"/how-it-works"}>
                  How it works
                </Link>
              </li>
              <li className="cursor-pointer">
                <Link className="hover:text-white" href={"/contact-us"}>
                  Blogs
                </Link>
              </li>
            </ul>
          </div>

          {/* 2 */}
          {/* 3 */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">POLICIES</h3>
            <ul className="space-y-2">
              <li className="cursor-pointer">
                <Link className="hover:text-white" href={"/terms-of-use"}>
                  Terms of Use
                </Link>
              </li>
              <li className="cursor-pointer">
                <Link className="hover:text-white" href={"/privacy-policy"}>
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* 3 */}
          {/*  */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">
              Stay Connected
            </h3>
            <div className="mb-4 flex space-x-4">
              <Link className="hover:text-white" href={"/"}>
                <Facebook className="h-6 w-6" />
              </Link>
              <Link className="hover:text-white" href={"/"}>
                <Instagram className="h-6 w-6" />
              </Link>
              <Link className="hover:text-white" href={"/"}>
                <Youtube className="h-6 w-6" />
              </Link>
              <Link className="hover:text-white" href={"/"}>
                <Twitter className="h-6 w-6" />
              </Link>
            </div>
            <p className="text-sm">
              Buy Books is a platform where you can buy second hand books at
              very cheap rate.
            </p>
          </div>

          {/*  */}
        </div>

        {/* feature section */}
        <section className="py-4">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-3">
              {/* 1 */}
              <div className="flex items-center gap-4 rounded-xl p-6 shadow-lg hover:shadow-sm">
                <div className="rounded-full p-3">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Secure Payment</h3>
                  <p className="text-sm text-gray-500">
                    100% Secure Online Transaction
                  </p>
                </div>
              </div>
              {/* 1 */}
            </div>
          </div>
        </section>
        {/* feature section */}
      </div>
    </footer>
  );
};

export default Footer;
