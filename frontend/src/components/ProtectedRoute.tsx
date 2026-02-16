import { getIsLoggedIn } from '@multiversx/sdk-dapp/out/methods/account/getIsLoggedIn';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const isLoggedIn = getIsLoggedIn();

    if (!isLoggedIn) {
        return <Navigate to="/unlock" replace />;
    }

    return <>{children}</>;
};
