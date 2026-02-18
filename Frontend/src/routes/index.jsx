import { lazy } from 'react';
import { Navigate } from 'react-router';
import MainLayout from "@/layouts/MainLayout";
import ProtectedRoute from "@/components/ProtectedRoute";


const Dashboard = lazy(() => import('@/views/dashboard'));
const AuthLogIn = lazy(() => import('@/views/auth/login'));
const Error404 = lazy(() => import('@/views/error/404'));
const Category = lazy(() => import('@/views/pages/Manage-Jobs/Category')); // single category component
const AddCategory = lazy(() => import('@/views/pages/Manage-Jobs/Category/components/AddCategory'));
const AddSubCategory = lazy(() => import('@/views/pages/Manage-Jobs/Category/components/AddSubCategory'));
const AddJobType = lazy(() => import('@/views/pages/Manage-Jobs/Category/components/AddJobType'));
const AddSector = lazy(() => import('@/views/pages/Manage-Jobs/Category/components/AddSector'));
const EditSubCategory = lazy(() => import('@/views/pages/Manage-Jobs/Category/components/EditSubCategory'));
const Jobs = lazy(() => import('@/views/pages/Manage-Jobs/jobs')); 
const AddJob = lazy(() => import('@/views/pages/Manage-Jobs/jobs/components/AddJob'));
const ViewJob = lazy(() => import('@/views/pages/Manage-Jobs/jobs/components/ViewJob'));
const AdmitCard = lazy(() => import('@/views/pages/Manage-Jobs/admit-card'));
const AddAdmitCard = lazy(() => import('@/views/pages/Manage-Jobs/admit-card/components/AddAdmitCard'));
const EditAdmitCard = lazy(() => import('@/views/pages/Manage-Jobs/admit-card/components/AddAdmitCard'));
const Results = lazy(() => import('@/views/pages/Manage-Jobs/results'));
const AddResult = lazy(() => import('@/views/pages/Manage-Jobs/results/components/AddResult'));
const EditResult = lazy(() => import('@/views/pages/Manage-Jobs/results/components/AddResult'));
const AnswerKey = lazy(() => import('@/views/pages/Manage-Jobs/answer-key'));
const AddAnswerKey = lazy(() => import('@/views/pages/Manage-Jobs/answer-key/components/AddAnswerKey'));
const EditAnswerKey = lazy(() => import('@/views/pages/Manage-Jobs/answer-key/components/AddAnswerKey'));
const Documents = lazy(() => import('@/views/pages/Manage-Jobs/documents'));
const Admissions = lazy(() => import('@/views/pages/Manage-Jobs/admission'));
const RegisterStudent = lazy(() => import('@/views/pages/student/Register'));
const Students = lazy(() => import('@/views/pages/student'));
const StudentDetail = lazy(() => import('@/views/pages/student/components/StudentDetail'));
const AppliedJobs = lazy(() => import('@/views/pages/student/AppliedOn'));
const Douments = lazy(() => import('@/views/pages/Manage-Jobs/documents'));
const AddDocument = lazy(() => import('@/views/pages/Manage-Jobs/documents/Components/AddDocument'));
const EditDocument = lazy(() => import('@/views/pages/Manage-Jobs/documents/Components/AddDocument'));



// login
const authRoutes = [
  {
    path: '/admin/login',
    element: <AuthLogIn />,
  },
];

// error
const errorRoutes = [
  {
    path: '/admin/error/404',
    element: <Error404 />,
  },
];

// dashboard
const dashboardRoutes = [
  {
    path: '/admin/dashboard',
    element: <Dashboard />,
  },
];

const categoryRoutes = [
  {
    path: '/admin/category',
    element: <Category />,
  },
  {

    path:'/admin/category/add',
    element:<AddCategory/>
  },
  {
    path:'admin/sub-category/add',
    element:<AddSubCategory/>
  },{
    path:'admin/sub-category/edit/:id',
    element:<EditSubCategory/>
  },
  {
    path: '/admin/job-type/add',
    element: <AddJobType/>
  },
  {
    path: 'admin/sector/add',
    element: <AddSector/>
  }
];

//job routes
const jobRoutes=[{
   path: '/admin/jobs',
    element: <Jobs/>,
},{
   path: '/admin/jobs/add',
    element: <AddJob/>,
},
{
   path: '/admin/jobs/edit/:id',
    element: <AddJob/>,
},
{
  path:'/admin/jobs/view/:id',
  element:<ViewJob/>
}
];

const studentsRoutes=[{
  path:'/admin/students',
  element:<Students/>
},
{
  path:'/admin/students/view/:id',
  element:<StudentDetail/>
},{
  path: '/admin/student/registration',
  element:<RegisterStudent/>
},{
  path: '/admin/applied-jobs',
  element:<AppliedJobs/>
}];


const admitRoutes=[{  
  path:'/admin/admit-card',
  element:<AdmitCard/>
},{
  path:'/admin/admit-card/add',
  element:<AddAdmitCard/>
},{
  path: '/admin/admit-card/edit/:id',
  element:<AddAdmitCard/>
}];

const resultRoutes=[{
  path:'/admin/result',
  element:<Results/>
},{
  path: '/admin/result/add',
  element: <AddResult/>
},{
  path: '/admin/result/edit/:id',
  element: <AddResult/>
}
];


const answerKeyRoutes=[{
  path:'/admin/answer-key',
  element:<AnswerKey/>
},{
  path: '/admin/answer-key/add',
  element: <AddAnswerKey/>
},{
  path: '/admin/answer-key/edit/:id',
  element: <EditAnswerKey/>
}
];

const documentsRoutes=[{
  path:'/admin/documents',
  element:<Documents/>
},{
  path: '/admin/documents/add',
  element: <AddDocument/>
},{
  path: '/admin/documents/edit/:id',
  element: <EditDocument/>
}]

const admissionsRoutes=[{
  path:'/admin/admissions',
  element:<Admissions/>
}];


// admin routes wrapped in main layout + protected route
const adminRoutes = [
  {
    element: (
      <ProtectedRoute role="admin">
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/',
        element: <Navigate to="/admin/dashboard" replace />,
      },
      ...dashboardRoutes,
      ...categoryRoutes,
      ...jobRoutes,
      ...admitRoutes,
      ...resultRoutes,
      ...answerKeyRoutes,
      ...documentsRoutes,
      ...admissionsRoutes,
      ...studentsRoutes
    ],
  },
];

const otherRoutes = [...authRoutes, ...errorRoutes];
export const routes = [...adminRoutes, ...otherRoutes];
