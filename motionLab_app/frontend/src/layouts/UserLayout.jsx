import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const UserLayout = () => {
    return (
        <>
            <NavBar />
            <div className="py-12"><Outlet /></div>
            <Footer />
        </>
    )
}

export default UserLayout;
