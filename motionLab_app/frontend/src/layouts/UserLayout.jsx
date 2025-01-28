import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const UserLayout = () => {
    return (
        <>
            <NavBar />
            <Outlet />
            {/* Footer goes here */}
            <Footer />
        </>
    )
}

export default UserLayout;
