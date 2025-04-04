import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";
function NavBar() {
  const [expanded, setExpanded] = useState(false); // State to handle mobile menu toggle
  const logout = useLogout();
  return (
    <div className='bg-gray-50'>
      <header className='relative z-10 py-4 md:py-6'>
        <div className='container px-4 mx-auto sm:px-6 lg:px-8'>
          <div className='relative flex items-center justify-between'>
            <div className='flex-shrink-0'>
              <Link
                to='/'
                title='Home'
                className='flex rounded outline-none focus:ring-1 focus:ring-gray-900 focus:ring-offset-2'
              >
                <img
                  className='w-auto h-8'
                  src='https://cdn.rareblocks.xyz/collection/clarity/images/logo.svg'
                  alt='Logo'
                />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className='flex md:hidden'>
              <button
                type='button'
                className='text-gray-900'
                onClick={() => setExpanded(!expanded)}
                aria-expanded={expanded}
              >
                {expanded ? (
                  <svg
                    className='w-7 h-7'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                ) : (
                  <svg
                    className='w-7 h-7'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='1.5'
                      d='M4 6h16M4 12h16M4 18h16'
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className='hidden md:flex md:items-center md:justify-center md:space-x-10 md:absolute md:inset-y-0 md:left-1/2 md:-translate-x-1/2 lg:space-x-16'>
              <Link
                to='/home'
                className='text-base font-medium text-gray-900 transition-all duration-200 rounded focus:outline-none hover:text-opacity-50 focus:ring-1 focus:ring-gray-900 focus:ring-offset-2'
              >
                Home
              </Link>
              <Link
                to='/quizzes/user-quizzes'
                className='flex items-center p-3 -m-3 text-base font-medium text-gray-900 transition-all duration-200 rounded hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:ring-offset-2'
              >
                MyQuizzes
              </Link>
              {/* <Link
                to='/questionpool'
                className='text-base font-medium text-gray-900 transition-all duration-200 rounded focus:outline-none hover:text-opacity-50 focus:ring-1 focus:ring-gray-900 focus:ring-offset-2'
              >
                Quiz
              </Link> */}
            </div>

            {/* Call to Action Button */}
            <div className='hidden md:flex'>
              <button
                onClick={logout}
                className='inline-flex items-center justify-center px-6 py-3 text-base font-bold leading-7 text-white transition-all duration-200 bg-gray-900 border border-transparent rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900'
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {expanded && (
            <nav>
              <div className='px-1 py-8'>
                <div className='grid gap-y-7'>
                  <Link
                    to='/home'
                    className='flex items-center p-3 -m-3 text-base font-medium text-gray-900 transition-all duration-200 rounded hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:ring-offset-2'
                  >
                    Home
                  </Link>

                  <Link
                    to='/questionpool'
                    className='flex items-center p-3 -m-3 text-base font-medium text-gray-900 transition-all duration-200 rounded hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:ring-offset-2'
                  >
                    QuestionPool
                  </Link>

                  <Link
                    to='/quizzes/user-quizzes'
                    className='flex items-center p-3 -m-3 text-base font-medium text-gray-900 transition-all duration-200 rounded hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:ring-offset-2'
                  >
                    MyQuizzes
                  </Link>

                  <button
                    onClick={logout}
                    className='inline-flex items-center justify-center px-6 py-3 text-base font-bold leading-7 text-white transition-all duration-200 bg-gray-900 border border-transparent rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900'
                  >
                    Logout
                  </button>
                </div>
              </div>
            </nav>
          )}
        </div>
      </header>
    </div>
  );
}

export default NavBar;
