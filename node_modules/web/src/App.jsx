import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardEstate from './pages/DashboardEstate';

import CreatePR from './pages/CreatePR';
import GoodsReceipt from './pages/GoodsReceipt';
import PurchasingReport from './pages/PurchasingReport';
import PrintPR from './pages/PrintPR';
import MasterUser from './pages/MasterUser';
import MasterSupplier from './pages/MasterSupplier';
import UserManagement from './pages/UserManagement';
import PrintBPB from './pages/PrintBPB';
import InputBPB from './pages/InputBPB';
import GeneralSettings from './pages/GeneralSettings';
import DashboardPurchasingHO from './pages/DashboardPurchasingHO';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<DashboardEstate />} />
        <Route path="/create-pr" element={<CreatePR />} />
        <Route path="/goods-receipt" element={<GoodsReceipt />} />
        <Route path="/purchasing-report" element={<PurchasingReport />} />
        <Route path="/print-pr" element={<PrintPR />} />
        <Route path="/master-user" element={<MasterUser />} />
        <Route path="/master-supplier" element={<MasterSupplier />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/print-bpb" element={<PrintBPB />} />
        <Route path="/input-bpb" element={<InputBPB />} />
        <Route path="/general-settings" element={<GeneralSettings />} />
        <Route path="/dashboard-purchasing-ho" element={<DashboardPurchasingHO />} />
        {/* Redirect unknown routes to Login for now */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
