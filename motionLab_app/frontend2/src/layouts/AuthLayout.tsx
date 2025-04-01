import { Outlet } from 'react-router-dom';
import Footer from '../components/nav/Footer';

const UserLayout = () => {
    return (
        <>
            <Outlet />
            <Footer />
        </>
    )
}

export default UserLayout;
