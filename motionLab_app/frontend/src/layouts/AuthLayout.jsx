import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';

const UserLayout = () => {
    return (
        <>
            <Outlet />
            <Footer />
        </>
    )
}

export default UserLayout;
