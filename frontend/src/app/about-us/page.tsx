"use client";

import { BookOpen, Users, ShieldCheck } from "lucide-react"; // Importing icons from Lucide

const AboutUs = () => {

  return (
    
    <div className="min-h-screen bg-gray-100 py-16">

      <div className="container mx-auto px-4">

        <h1 className="text-4xl font-bold text-center mb-8 text-black/70">About Us</h1>
        <p className="text-gray-600 text-lg text-center mb-12">
          Welcome to Buy Books, your ultimate destination for buying and selling
          used books online.
        </p>

        {/* mission , community and commitment */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">

          <div className="bg-white rounded-lg shadow-lg p-8 hover:scale-105 duration-500">
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="w-12 h-12 text-primary/80" />
            </div>
            <h2 className="text-xl font-semibold text-center mb-4 text-black/70">
              Our Mission
            </h2>
            <p className="text-gray-600 text-left">
              At Buy Books, we aim to make reading accessible to everyone by
              providing a platform where people can buy and sell their old books
              easily.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 duration-500 hover:scale-105">
            <div className="flex items-center justify-center mb-4">
              <Users className="w-12 h-12 text-primary/80" />
            </div>
            <h2 className="text-xl font-semibold text-center mb-4 text-black/70">
              Our Community
            </h2>
            <p className="text-gray-600 text-left">
              We believe in building a community of book lovers who can share
              their passion for reading while promoting eco-friendly practices.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 duration-500 hover:scale-105">
            <div className="flex items-center justify-center mb-4">
              <ShieldCheck className="w-12 h-12 text-primary/80" />
            </div>
            <h2 className="text-xl font-semibold text-center mb-4 text-black/70">
              Our Commitment
            </h2>
            <p className="text-gray-600 text-left">
              We are committed to providing a secure platform for transactions
              and ensuring customer satisfaction at every step.
            </p>
          </div>

        </div>
        {/* mission , community and commitment */}

        {/* Why Choose */}

        <section className="py-10 bg-white">

          <h2 className="text-3xl font-bold text-center mb-8 text-black/70">
            Why Choose Buy Books?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto  px-4">

            {/* Without max-w-6xl : On a large screen , The grid can stretch almost across the entire screen. */}

            <div className="bg-gray-100 rounded-lg p-6 shadow-lg duration-200 hover:scale-105">

              <div className="flex items-center justify-center mb-4">
                <span className="text-primary text-4xl">📚</span>
              </div>
              <h3 className="font-semibold text-lg text-center mb-2 text-black/70">
                Wide Selection
              </h3>
              <p className="text-gray-600 text-left">
                Thousands of used books available at your fingertips.
              </p>
            </div>

            <div className="bg-gray-100 rounded-lg p-6 shadow-lg duration-200 transition-transform transform hover:scale-105">
              <div className="flex items-center justify-center mb-4">
                <span className="text-primary text-4xl">📝</span>
              </div>
              <h3 className="font-semibold text-lg text-center mb-2 text-black/70">
                Easy Listing
              </h3>
              <p className="text-gray-600 text-left">
                Sell your old books in just a few clicks.
              </p>
            </div>

            <div className="bg-gray-100 rounded-lg p-6 shadow-lg duration-200 transition-transform transform hover:scale-105">
              <div className="flex items-center justify-center mb-4">
                <span className="text-primary text-4xl">🔒</span>
              </div>
              <h3 className="font-semibold text-lg text-center mb-2 text-black/70">
                Secure Transactions
              </h3>
              <p className="text-gray-600 text-left text-black/70">
                Safe payment methods ensure your peace of mind.
              </p>
            </div>

            <div className="bg-gray-100 rounded-lg p-6 shadow-lg duration-200 transition-transform transform hover:scale-105">
              <div className="flex items-center justify-center mb-4">
                <span className="text-primary text-4xl">🤝</span>
              </div>
              <h3 className="font-semibold text-lg text-center mb-2 text-black/70">
                Community Driven
              </h3>
              <p className="text-gray-600 text-left">
                Join a community of readers and sellers who share your passion.
              </p>
            </div>

          </div>

        </section>

        {/* Why Choose */}

        {/* Images Section */}
        <div className="mt-16 flex flex-col md:flex-row gap-4 items-center justify-center mb-4 mx-auto px-4">

          <img
            src="/images/book1.jpg"
            alt="Books"
            className="w-full md:w-[350px] rounded-lg shadow-md "
          />
          <img
            src="/images/book2.jpg"
            alt="Reading"
            className="w-full md:w-[350px] rounded-lg shadow-md"
          />
        </div>

        <h2 className="text-xl font-semibold text-center mb-4 text-black/70">
          Join Us Today!
        </h2>
        <p className="text-gray-600 text-lg text-center mb-8">
          Sign up now to start buying and selling your favorite books on
          BookKart!
        </p>

        <div className="flex justify-center">
          <a
            href="/"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg duration-300"
          >
            Get Started
          </a>
        </div>
      </div>

    </div>
  );
};

export default AboutUs;