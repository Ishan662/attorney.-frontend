import Sidebar from "../../components/layout/Sidebar";


const Dashboard = () => {
    const user = {
        name: 'Nishagi Jewantha',
        email: 'jeewanthadeherath@gmail.com',
    };

    return (
        <div className="flex">
            <Sidebar user={user} />
            <div className="flex-grow p-6">
                <h1>User Dashboard</h1>
                {/* User content here */}
            </div>
        </div>
      );
}

export default Dashboard
