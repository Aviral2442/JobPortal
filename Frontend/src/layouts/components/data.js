import { TbBellRinging, TbCreditCard, TbHeadset, TbLock, TbLogout2, TbSettings2, TbUserCircle } from 'react-icons/tb';
import { LuCircleGauge, LuUsers } from 'react-icons/lu';
import { HiOutlineUserGroup } from "react-icons/hi2";

export const userDropdownItems = [{
  label: 'Welcome back!',
  isHeader: true
}, {
  label: 'Profile',
  icon: TbUserCircle,
  url: '/pages/profile'
}, {
  label: 'Notifications',
  icon: TbBellRinging,
  url: '#'
}, {
  label: 'Balance: $985.25',
  icon: TbCreditCard,
  url: '#'
}, {
  label: 'Account Settings',
  icon: TbSettings2,
  url: '#'
}, {
  label: 'Support Center',
  icon: TbHeadset,
  url: '#'
}, {
  isDivider: true
}, {
  label: 'Lock Screen',
  icon: TbLock,
  url: '/auth-1/lock-screen'
}, {
  label: 'Log Out',
  icon: TbLogout2,
  url: '#',
  class: 'text-danger fw-semibold'
}];


//dashboard sidebar menu items
export const menuItems = [
  {
  key: 'dashboard',
  label: 'Dashboard',
  icon: LuCircleGauge,
  url: '/admin/dashboard'
},
{
  key: 'manage-students',
  label: 'Manage Students',
  icon: LuUsers,
  children: [{
    key: 'students',
    label: 'Students List',
    url: '/admin/students'
  },
  {    key: 'Applied-Jobs',
    label: 'Applied Jobs',
    url: '/admin/applied-jobs'
  },],
},
{
  key:'manage-category',
  label:'Manage Jobs',
  icon: HiOutlineUserGroup,
  children:[{
    key:'category',
    label:'Category',
    url:'/admin/category'
},
{
    key:'job',
    label:'Job List',
    url:'/admin/jobs'
  },
{
    key:'admit-card',
    label:'Admit Card',
    url:'/admin/admit-card'
  },
{
    key:'result',
    label:'Results',
    url:'/admin/result'
  },
{
    key:'answer-key',
    label:'Answer Key',
    url:'/admin/answer-key'
  },
{
    key:'documents',
    label:'Documents',
    url:'/admin/documents'
  },
{    key:'admissions',
    label:'Admissions',
    url:'/admin/admissions'
},

// {
//     key:'sub-category',
//     label:'SubCategory List',
//     url:'/admin/sub-category'
// },
]},
// {
//   key:'manage-jobs',
//   label:'Manage Jobs',
//   icon:BsBriefcaseFill,
//   children:[{
//     key:'job',
//     label:'Job List',
//     url:'/admin/jobs'
//   },{
//     key:'admit-card',
//     label:'Admit Card',
//     url:'/admin/admit-card'
//   },]},
 ];