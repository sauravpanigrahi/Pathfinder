import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom'

const Signup = () => {
    const navigate=useNavigate();
    const [iscomapny,setiscomapny]=useState(false);
    const [isStudent,setisStudent]=useState(false)

    const company=()=>{
            setiscomapny(true)
            setisStudent(false)
    }
    const student=()=>{
        setiscomapny(false)
        setisStudent(true)
    }
    const accountbtn = () => {
        if (iscomapny) {
          navigate('/signup/company');
        } else if (isStudent) {
          navigate('/signup/student');
        } else {
          alert("Please select an option first");
        }
      };
      
  return (
<div className="choose flex min-h-screen flex-col md:flex-row">
    <div className="ask-question text-[#030914] flex-1 w-full md:w-3/5 md:flex-none px-6 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-14">
        <div className="max-w-2xl mx-auto">
          <h1 className='font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight'>How do you want to use PathFinder?</h1>
          <p className='mt-3 sm:mt-4 text-gray-600'>We’ll personalize your setup experience accordingly.</p>

          <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
            <div
              onClick={company}
              role="button"
              aria-pressed={iscomapny}
              className={`company h-20 w-full max-w-xl bg-gray-100 flex cursor-pointer rounded-xl transition shadow-sm hover:bg-gray-50 ${iscomapny ? 'ring-2 ring-[#1E3A7A] bg-white' : 'ring-1 ring-gray-200'}`}
            >
              <div className="icon h-full w-14 sm:w-16 flex items-center justify-center">
                <img src="https://cdn.prod.website-files.com/66b6d7fd4d3e9cef94717176/67a276633d188f1cc21be5e1_svgexport-2.svg" alt="Company icon" className="h-8 w-8 sm:h-9 sm:w-9" />
              </div>

              <div className="text-black h-full w-full flex flex-col justify-center px-3 sm:px-4">
                <p className="font-medium">I'm here to hire tech talent</p>
                <p className="text-sm text-gray-600">Evaluate tech skill at scale</p>
              </div>
            </div>

            <div
              onClick={student}
              role="button"
              aria-pressed={isStudent}
              className={`student h-20 w-full max-w-xl bg-gray-100 flex cursor-pointer rounded-xl transition shadow-sm hover:bg-gray-50 ${isStudent ? 'ring-2 ring-[#1E3A7A] bg-white' : 'ring-1 ring-gray-200'}`}
            >
              <div className="icon h-full w-14 sm:w-16 flex items-center justify-center">
                <img src="https://cdn.prod.website-files.com/66b6d7fd4d3e9cef94717176/67a27663f236712d384b60f8_svgexport-3.svg" alt="Student icon" className="h-8 w-8 sm:h-9 sm:w-9" />
              </div>
              <div className="text-black h-full w-full flex flex-col justify-center px-3 sm:px-4">
                <p className="font-medium">I'm here to apply for jobs</p>
                <p className="text-sm text-gray-600">Showcase my talent </p>
              </div>
            </div>
          </div>

          <button onClick={accountbtn} className='mt-8 sm:mt-10 h-11 w-full sm:w-40 bg-[#1E3A7A] text-white rounded-xl shadow hover:bg-[#183062] transition'>Create Account</button>
        </div>
    </div>
      <div className="image text-black hidden md:flex md:w-2/5 h-64 md:h-auto items-center justify-center p-2 ">
            { isStudent?<img src="/src/assets/download.jpeg
        " alt="company icon"  className="h-1/2 w-full object-cover"  />:
        <img src="/src/assets/office.jpeg
        " alt="Student icon"  className="h-1/2 w-full object-cover"  />}
      </div>
</div>
  );
};

export default Signup;
