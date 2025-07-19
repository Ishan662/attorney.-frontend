import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import ProtectedRoute from './components/protected/ProtectedRoute'

import Home from './pages/Common/Home';
import Dashboard from './pages/Lawyer/Dashboard';
// import SignUp from './pages/Common/SignUp';

import Timeline from './pages/Lawyer/Timeline';
import Incomes from './pages/Lawyer/Incomes';
// import DaySummary from './pages/Lawyer/DaySummary';
import AddClient from './pages/Lawyer/AddNewClient';
// import Meetings from './pages/Lawyer/MeetingRequest';
import Clients from './pages/Lawyer/Clients';
import ScheduleMeeting from './pages/Client/ScheduleMeeting';
import Lawyercalander from './pages/Lawyer/Lawyercalender';
import UserSignUp from './pages/Common/UserSignUp';
import UserLogin from './pages/Common/UserLogin';
import Messages from './pages/Lawyer/AllMessages';
import CaseProfiles from './pages/Lawyer/CaseProfile';
import CaseDetails from './pages/Lawyer/CaseDetails';
import NewCaseProfile from './pages/Lawyer/NewCaseProfile';
import Cases from './pages/Lawyer/Cases';
import DuePayments from './pages/Lawyer/DuePayments';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AddJunior from './pages/Lawyer/AddNewJunior';
import SystemSettings from './pages/Admin/SystemSettings';
import PackageManagement from './pages/Admin/PackageManagement';
import NotFoundPage from './pages/Common/404';
import JuniorDashboard from './pages/JuniorLawyer/JuniorDashboard';
import AssignedCases from './pages/JuniorLawyer/AssignedCases';
import Tasks from './pages/JuniorLawyer/Tasks';
import JuniorMessages from './pages/JuniorLawyer/JuniorMessages';
import JuniorHearings from './pages/JuniorLawyer/JuniorHearing';
import AccountUsers from './pages/Lawyer/AccountUsers';
import UserManagement from './pages/Admin/UserManagement';
import ViewMessages from './pages/Admin/ViewMessages';
import AdminAnalytics from './pages/Admin/ViewAnalytics';
import ClientDashboard from './pages/Client/Clientdashboard';
import Clientcaseprofiles from './pages/Client/Clientcaseprofiles';
import ClientCalendar from './pages/Client/Clientcalendar';
import AddNextHearingModal from './pages/Lawyer/AddNextHearingDate';
import LawyerDashboard from './pages/Lawyer/LawyerDashboard';
import AcceptInvitationPage from './pages/Common/AcceptInvitationPage';

import ClientInvitation from './pages/Client/ClientInvitation';
import UserOTP from './pages/Common/UserOTP';
import LawyerAddDocuments from './pages/Lawyer/AddDocuments';

export default function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="signup" element={<SignUp />} />  */}
          <Route path="admin/dashboard" element={<AdminDashboard />} />
          <Route path="junior/dashboard" element={<JuniorDashboard/>} />
          <Route path="client/dashboard" element={<ClientDashboard />} />
          <Route path="admin/timeline" element={<Timeline />}/>
          <Route path='lawyer/calendar' element={< Lawyercalander />} />
          {/* <Route path="lawyer/dashboard" element={<Dashboard />} /> */}
          <Route path="lawyer/timeline" element={<Timeline />} />
          <Route path="lawyer/incomes" element={<Incomes />} />
          {/* <Route path="lawyer/day-summary" element={<DaySummary />} /> */}
          {/* <Route path="lawyer/meetingrequest" element={<Meetings />} /> */}
          <Route path="lawyer/clients" element={<Clients />} />
          <Route path="client/schedulemeeting" element={<ScheduleMeeting />} />
          {/* client case profiles  */}
          <Route path="client/caseprofiles" element={<CaseProfiles />} />
          <Route path="client/clientcalendar" element={<ClientCalendar />} />
          <Route path='/lawyer/messages' element={<Messages />} />
          <Route path="user/signup" element={<UserSignUp />} />
          <Route path="user/login" element={<UserLogin />} />
          <Route path="user/otp" element={<UserOTP />} />
          <Route path="lawyer/caseprofile" element={<CaseProfiles />} />
          <Route path="lawyer/case/:caseId" element={<CaseDetails />} />
          <Route path="lawyer/newcaseprofile" element={<NewCaseProfile />} />
          <Route path="lawyer/cases" element={<Cases />} />
          <Route path="lawyer/duepayments" element={<DuePayments />} />
          <Route path="lawyer/addnewjunior" element={<AddJunior />} />
          <Route path="admin/systemsettings" element={<SystemSettings />} />
          <Route path="admin/packagemanagement" element={<PackageManagement />} />
          <Route path="junior/cases" element={<AssignedCases/>} />
          <Route path="junior/tasks" element={<Tasks/>} />
          <Route path="junior/messages" element={<JuniorMessages/>} />
          <Route path="junior/hearings" element={<JuniorHearings/>} />
          <Route path="lawyer/accountusers" element={<AccountUsers />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="admin/usermanagement" element={<UserManagement />} />
          <Route path="admin/viewmessages" element={<ViewMessages />} />
          <Route path="admin/viewanalytics" element={<AdminAnalytics />} />
          {/* client case profiles  */}
          {/* <Route path="client/caseprofiles" element={<Clientcaseprofiles />} /> */}
          {/* <Route path="/invitation/:inviteToken" element={<ClientInvitation />} />   */}

          <Route path="lawyer/dashboard" element={<ProtectedRoute allowedRoles={['LAWYER']}>
            <Dashboard />
          </ProtectedRoute>} />
          <Route path="lawyer/:caseId/addnewclient" element={<ProtectedRoute allowedRoles={['LAWYER']}>
            <AddClient />
          </ProtectedRoute>} /> */}

          {/* testing routes */}
          <Route path="lawyer/dashboard" element={<Dashboard />} />
          <Route path="accept-invitation/:token" element={<AcceptInvitationPage />} />
 
          <Route path="/invitation/:inviteToken" element={<ClientInvitation />} /> 
          <Route path="lawyer/addnexthearing" element={<AddNextHearingModal />} />  

        </Routes>
      </div>
    </Router>
  );
}
