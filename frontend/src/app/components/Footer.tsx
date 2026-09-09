"use client";
import {
  Clock,
  Facebook,
  HeadphonesIcon,
  Instagram,
  Shield,
  Twitter,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";


const Footer = () => {
  return (
    
    <footer className="bg-gray-900 text-gray-300">

      <div className=" px-4 py-5">

         {/* about us etc */}

        <div className="grid gap-12 grid-cols-2 md:grid-cols-3">

          {/* 1 */}
          <div>

            <h3 className="mb-4 text-lg font-semibold text-white">About Us</h3>

            <ul className="">

              <li className="cursor-pointer">

                <Link className="hover:text-white" href={"/about-us"}>
                  About Us
                </Link>

              </li>
        
            </ul>

          </div>
          {/* 1 */}

    
          {/* 2 */}

          <div>

            <h3 className="mb-4 text-lg font-semibold text-white">Policies</h3>

            <ul className="space-y-1">

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

          {/* 2 */}

          {/* 3 */}

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

          {/* 3 */}

        </div>

        {/* about us etc ends */}

        {/* feature section */}

        <section className="py-2">

            <div className="grid gap-8 md:grid-cols-3">

              {/* 1 */}

              <div className="flex items-center gap-4 rounded-xl p-6 shadow-lg hover:shadow-sm">

                <div className="rounded-full p-3">
                  <Shield className="w-6 h-6" />
                </div>
                
                <div>

                  <h3 className="font-semibold">Secure Payment</h3>
                  <p className="text-sm text-gray-500">
                    100% Secure Online Transaction.
                  </p>
                  
                </div>

              </div>

              {/* 1 */}

              {/* 2 */}

              <div className="flex items-center gap-4 rounded-xl p-6 shadow-lg hover:shadow-sm">

                <div className="rounded-full p-3">
                  <Clock className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="font-semibold">Buy Books Trust</h3>
                  <p className="text-sm text-gray-500">
                    Money transfered safely after confirmation.
                  </p>
                </div>

              </div>

              {/* 2 */}

              {/* 3 */}

              <div className="flex items-center gap-4 rounded-xl p-6 shadow-lg hover:shadow-sm">

                <div className="rounded-full p-3">
                  <HeadphonesIcon className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="font-semibold">Customer Support</h3>
                  <p className="text-sm text-gray-500">
                    Friendly Customer Support
                  </p>
                </div>

              </div>

              {/* 3 */}

            </div>
       
        </section>

        {/* feature section ends */}

        {/* copyright  */}

        <div className="mt-2 border-t pt-2 border-gray-700 flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-center">

          <p className="text-sm text-gray-400">
            &copy; : {new Date().getFullYear()} Buy Books. All rights reserved.
          </p>


          <div className="flex items-center space-x-2">
            {/* So gap-2 itself doesn't mean horizontal or vertical. The layout (flex or flex-col) determines it. */}
            {/* in grid : gaps both horizontally and vertically */}

            <Image
              src={"/icons/visa.svg"}
              alt="visa"
              height={30}
              width={50}
              className="filter brightness-10 invert"
            />
            {/* brightness-100 1.0 Normal */}
            {/* brightness-10 0.1 Almost black */}

            <Image
              src={"/icons/rupay.svg"}
              alt="rupay"
              height={30}
              width={50}
              className="brightness-20 invert"

              // filter enables CSS filter effects on an element.
              // In modern Tailwind, filter utilities such as invert and brightness generally work without explicitly writing filter.
            />

            <Image src={"/icons/paytm.svg"} alt="paytm" height={30} width={50} />

            <Image
              src={"/icons/upi.svg"}
              alt="upi"
              height={30}
              width={50}
              className="brightness-20 invert"
            />

          </div>
          
        </div>

        {/* copyright ends  */}

      </div>

    </footer>
  );
};

export default Footer;
