import SampleDashboardSection from "./sections/SampleDashboardSection";

const Dashboard = () => {

  return (
    <div className="w-full">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <SampleDashboardSection />
        {/* Section 2, 3, etc */}
        {/* <SampleSection />  */}
        {/* <SampleSection /> */}
    </div>
  );
};

export default Dashboard;
