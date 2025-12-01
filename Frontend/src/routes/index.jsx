import { lazy } from 'react';
import { Navigate } from 'react-router';
import MainLayout from "@/layouts/MainLayout";
import ProtectedRoute from "@/components/ProtectedRoute";


const Dashboard = lazy(() => import('@/views/dashboard'));
const AuthLogIn = lazy(() => import('@/views/auth/login'));
const Error404 = lazy(() => import('@/views/error/404'));
const Category = lazy(() => import('@/views/pages/Category')); // single category component
const AddCategory = lazy(() => import('@/views/pages/Category/components/AddCategory'));
const AddSubCategory = lazy(() => import('@/views/pages/Category/components/AddSubCategory'));
const AddJobType = lazy(() => import('@/views/pages/Category/components/AddJobType'));
const AddSector = lazy(() => import('@/views/pages/Category/components/AddSector'));
const EditSubCategory = lazy(() => import('@/views/pages/Category/components/EditSubCategory'));
const Jobs = lazy(() => import('@/views/pages/jobs')); 
const EditJob = lazy(() => import('@/views/pages/jobs/components/EditJob'));
const AddJob = lazy(() => import('@/views/pages/jobs/components/AddJob'));
const ViewJob = lazy(() => import('@/views/pages/jobs/components/ViewJob'));
const AdmitCard = lazy(() => import('@/views/pages/admit-card'));
const AddAdmitCard = lazy(() => import('@/views/pages/admit-card/components/AddAdmitCard'));
const Results = lazy(() => import('@/views/pages/results'));
const AddResult = lazy(() => import('@/views/pages/results/components/AddResult'));
const AnswerKey = lazy(() => import('@/views/pages/answer-key'));
const AddAnswerKey = lazy(() => import('@/views/pages/answer-key/components/AddAnswerKey'));
const Documents = lazy(() => import('@/views/pages/documents'));
const Admissions = lazy(() => import('@/views/pages/admission'));
const EditJobType = lazy(() => import('@/views/pages/Category/components/AddJobType'));





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
    path: '/admin/job-type/edit/:id',
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
    element: <EditJob/>,
},
{
  path:'/admin/jobs/view/:id',
  element:<ViewJob/>
}
];

const admitRoutes=[{  
  path:'/admin/admit-card',
  element:<AdmitCard/>
},{
  path:'/admin/admit-card/add',
  element:<AddAdmitCard/>
}];

const resultRoutes=[{
  path:'/admin/result',
  element:<Results/>
},{
  path: '/admin/result/add',
  element: <AddResult/>
}
];


const answerKeyRoutes=[{
  path:'/admin/answer-key',
  element:<AnswerKey/>
},{
  path: '/admin/answer-key/add',
  element: <AddAnswerKey/>
}
];

const documentsRoutes=[{
  path:'/admin/documents',
  element:<Documents/>
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
    ],
  },
];

const otherRoutes = [...authRoutes, ...errorRoutes];
export const routes = [...adminRoutes, ...otherRoutes];
