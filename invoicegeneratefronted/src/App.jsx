// src/App.jsx

import { Routes, Route } from 'react-router-dom'; // <-- BrowserRouter yahan se hata dein
import Menubar from './components/Menubar';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage/LandingPage';
import Dashboard from './pages/Dashboard';
import MainPage from './pages/MainPage';
import PreviewPage from './pages/PreviewPage';
import UserSyncHandler from './components/UserSyncHandler';
import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react';

const App = () => {
  return (
    // <-- Yahan se BrowserRouter ko hata kar ek simple fragment (<> </>) laga dein
    <>
      <UserSyncHandler />
      <Menubar />
      <Toaster />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        <Route path="/dashboard" element={
            <>
              <SignedIn><Dashboard /></SignedIn>
              <SignedOut><RedirectToSignIn /></SignedOut>
            </>
          }
        />
        
        <Route path="/generate" element={
            <>
              <SignedIn><MainPage /></SignedIn>
              <SignedOut><RedirectToSignIn /></SignedOut>
            </>
          }
        />
        
        <Route path="/preview" element={
            <>
              <SignedIn><PreviewPage /></SignedIn>
              <SignedOut><RedirectToSignIn /></SignedOut>
            </>
          }
        />
      </Routes>
    </>
  );
};

export default App;