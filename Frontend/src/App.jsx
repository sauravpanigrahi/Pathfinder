import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Loader} from './components/loader';

// 🔹 Lazy-load all pages
import { ProtectedRoute, CompanyProtectedRoute } from "./utils/protect";
import Error from './pages/Error';
const MainHome = lazy(() => import('./pages/MainHome'));
const Home = lazy(() => import('./pages/Student/Home'));
const Jobs = lazy(() => import('./pages/Student/Jobs'));
const Signup = lazy(() => import('./pages/Signup'));
const Companysignup = lazy(() => import('./pages/Company/companysignup'));
const Studentsignup = lazy(() => import('./pages/Student/studentsignup'));
const Studentlogin = lazy(() => import('./pages/Student/login'));
const Companylogin = lazy(() => import('./pages/Company/login'));
const Jobapply = lazy(() => import('./pages/Student/apply'));
const InstitutionHome = lazy(() => import('./pages/Company/InstitutionHome'));
const Setting = lazy(() => import('./pages/Student/Setting'));
const StudDetails = lazy(() => import('./pages/Student/studdetails'));
const CreateJob = lazy(() => import('./pages/Company/createjob'));
const Blog = lazy(() => import('./pages/Student/blog'));
const Form = lazy(() => import('./pages/Student/blogform'));
const Companyprofile = lazy(() => import('./pages/Company/companyprofile'));
const Application = lazy(() => import('./pages/Company/Application'));

const StudentAnalytics = lazy(() => import('./pages/Student/analytics'));
const Smartreview = lazy(() => import('./pages/Student/smartreview'));
const Contact = lazy(() => import('./pages/Student/contact'));

// 🔹 You can lazy-load these too if large (optional)
const Navbar = lazy(() => import('./components/studentnavbar'));
const MainNavbar = lazy(() => import('./components/navbar'));
const CompanyNavbar = lazy(() => import('./components/comapnynavbar'));
const Interview = lazy(() => import('./pages/Company/interview'));
const Interviewprep = lazy(() => import('./pages/Student/interviewprep'));
const Ciq = lazy(() => import('./pages/Student/ciq'));
const Codingquestions = lazy(() => import('./pages/Student/coding'));
const Companyques = lazy(() => import('./pages/Student/compques'));
const  Interviewschedule=lazy(()=>import('./pages/Company/interviewschedule'))
const JobResults = lazy(() => import('./pages/Student/jobresults'));

function App() {
  const location = useLocation();
  // Define which pages show which Navbar
  const studentNavbarPaths = [
    '/home',
    '/listedjobs',
    '/student/apply',
    '/settings',
    '/student/details',
    '/blogs',
    '/blogs/form',
    '/listedjobs/:companyuid/smartreview'
  ];
  const shouldShowNavbar = studentNavbarPaths.some(path =>location.pathname.startsWith(path));
  const NavbarPaths = ['/', '/main-home','/jobs',];
  const ShowNavbar = NavbarPaths.includes(location.pathname);
  const CompanyNavbarPaths = ['/companyhome', '/company/application'];
  const ShowCompanyNavbar = CompanyNavbarPaths.some(path => location.pathname.startsWith(path));
  return (
    <>
      {/* 🔹 Wrap Navbar with Suspense to avoid blocking */}
      <Suspense fallback={null}>
        {(shouldShowNavbar && <Navbar />) ||
          (ShowNavbar && <MainNavbar />) ||
          (ShowCompanyNavbar && <CompanyNavbar />)}
      </Suspense>
      {/* 🔹 Lazy load all routes */}
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Public/Main Routes */}
          <Route path="/" element={<MainHome />} />
          {/* <Route path="/main-home" element={<MainHome />} /> */}
          <Route path="/jobs" element={<JobResults />} />
          {/* Student Routes */}
          
          <Route element={<ProtectedRoute />}>
              <Route path="home" element={<Home />} />
              <Route path="listedjobs" element={<Jobs />} />
              <Route path="Student/Apply/:companyuid" element={<Jobapply />} />
              <Route path="settings/:userID" element={<Setting />} />
              <Route path="student/details" element={<StudDetails />} />
              <Route path="blogs" element={<Blog />} />
              <Route path="blogs/form/:userID" element={<Form />} />
              <Route path="listedjobs/:companyuid/smartreview/:job_id" element={<Smartreview />}/>
              <Route path="contact" element={<Contact />} />
              <Route path="interviewprep" element={<Interviewprep />} />
              <Route path="interviewprep/start-common-questions" element={<Ciq />} />
              <Route path="interviewprep/start-coding-questions" element={<Codingquestions />} />
              <Route path="interviewprep/:companySlug" element={<Companyques />} />
              <Route path="student/analytics" element={<StudentAnalytics />} />
          </Route>
              <Route path="/signup" element={<Signup />} />
              <Route path="/signup/student" element={<Studentsignup />} />
              <Route path="/login/student" element={<Studentlogin />} />
          {/* Company Routes */}
          <Route path="/signup/company" element={<Companysignup />} />
          <Route path="/login/Company" element={<Companylogin />} />
          <Route element={<CompanyProtectedRoute />}>
              <Route path="companyhome" element={<InstitutionHome />} />
              <Route path="companyhome/:uid/create" element={<CreateJob />} />
              <Route path="profile" element={<Companyprofile />} />
              <Route path="company/application" element={<Application />} />
              
              <Route path="company/:companyUID/interview" element={<Interview />} />
              <Route path="company/interview/schedule" element={<Interviewschedule/>}/>
              
          </Route>
          {/* Error Route - Catch all unmatched routes (must be last) */}
          <Route path="*" element={<Error />} />
        </Routes>
      </Suspense>

      {/* 🔹 Toast Notifications */}
      <ToastContainer
        position="top-center"
        draggable
        theme="colored"
        toastStyle={{
          maxWidth: '90vw',   // responsive
          width: '450px',    // desktop
          minHeight: '60px',
          color: '#fff',
          backgroundColor: '#1e293b',
          borderRadius: '12px'
        }}
      />
    </>
  );
}

export default App;
