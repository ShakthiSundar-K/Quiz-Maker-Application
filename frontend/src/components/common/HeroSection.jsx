import React from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className='bg-gray-50'>
      <section className='relative'>
        <div className='absolute bottom-0 right-0 overflow-hidden'>
          <img
            className='w-full h-auto origin-bottom-right transform scale-150 lg:w-auto lg:mx-auto lg:object-cover lg:scale-75'
            src='https://cdn.rareblocks.xyz/collection/clarity/images/hero/1/background-pattern.png'
            alt='Background pattern'
          />
        </div>

        <div className='relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 gap-y-4 lg:items-center lg:grid-cols-2 xl:grid-cols-2'>
            {/* Left Content */}
            <div className='text-center xl:col-span-1 lg:text-left md:px-16 lg:px-0 xl:pr-20'>
              <h1 className='text-4xl font-bold leading-tight text-gray-900 sm:text-5xl sm:leading-tight lg:text-6xl lg:leading-tight'>
                THE REMARKABLY FUN QUIZ MAKER
              </h1>
              <p className='mt-2 text-lg text-gray-600 sm:mt-6'>
                Make quizzes that more people take.
              </p>

              <Link
                to='/quizzes/create'
                className='inline-flex px-12 mr-10 py-4 mt-8 text-lg font-bold text-white transition-all duration-200 bg-gray-900 border border-transparent rounded sm:mt-10 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900'
                role='button'
              >
                Create Quiz
              </Link>
              <Link
                to='/participants/join-quiz'
                className='inline-flex px-12 py-4 mt-8 text-lg font-bold text-white transition-all duration-200 bg-gray-900 border border-transparent rounded sm:mt-10 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900'
                role='button'
              >
                Join Quiz
              </Link>
            </div>

            {/* Right Illustration */}
            <div className='xl:col-span-1'>
              <img
                className='w-full mx-auto'
                src='https://cdn.rareblocks.xyz/collection/clarity/images/hero/1/illustration.png'
                alt='Quiz illustration'
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
