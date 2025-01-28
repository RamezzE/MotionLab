import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {

    return (
        <>
            <h1 className="mb-10">Dashboard Layout</h1>
            <Outlet />
        </>
    )
}

export default DashboardLayout;
