import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/Layout/Layout';
import { UnlockPage } from './pages/UnlockPage';
import { DashboardPage } from './pages/DashboardPage';
import { MultisigPage } from './pages/MultisigPage';
import { CreatePage } from './pages/CreatePage';
import { HistoryPage } from './pages/HistoryPage';
import { AddressBookPage } from './pages/AddressBookPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { StakingPage } from './pages/StakingPage';
import { SettingsPage } from './pages/SettingsPage';
import { MultiChainPage } from './pages/MultiChainPage';
import { GovernancePage } from './pages/GovernancePage';
import { PluginsPage } from './pages/PluginsPage';
import { TwoFAPage } from './pages/TwoFAPage';
import { SocialRecoveryPage } from './pages/SocialRecoveryPage';
import { NftTreasuryPage } from './pages/NftTreasuryPage';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
    return (
        <BrowserRouter>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#0c2329',
                        color: '#e2e8f0',
                        border: '1px solid #15393f',
                        borderRadius: '1rem',
                        boxShadow: '0 0 30px rgba(45, 212, 191, 0.06), 0 8px 32px rgba(0, 0, 0, 0.4)',
                        fontSize: '0.875rem',
                    },
                    success: {
                        iconTheme: { primary: '#2dd4bf', secondary: '#0c2329' },
                    },
                    error: {
                        iconTheme: { primary: '#ef4444', secondary: '#0c2329' },
                    },
                }}
            />

            <Routes>
                <Route path="/unlock" element={<UnlockPage />} />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<DashboardPage />} />
                    <Route path="multisig/:address" element={<MultisigPage />} />
                    <Route path="create" element={<CreatePage />} />
                    <Route path="history" element={<HistoryPage />} />
                    <Route path="address-book" element={<AddressBookPage />} />
                    <Route path="analytics" element={<AnalyticsPage />} />
                    <Route path="staking" element={<StakingPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="multi-chain" element={<MultiChainPage />} />
                    <Route path="governance" element={<GovernancePage />} />
                    <Route path="plugins" element={<PluginsPage />} />
                    <Route path="two-fa" element={<TwoFAPage />} />
                    <Route path="social-recovery" element={<SocialRecoveryPage />} />
                    <Route path="nft-treasury" element={<NftTreasuryPage />} />
                </Route>
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

