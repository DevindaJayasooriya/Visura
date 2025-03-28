import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return(
<div className="h-full relative">
        <div className="hidden h-full md:flex md:flex-col md:fixed md:w-72 md:insert-y-0 z-[8 0] bg-violet-950">
            <Sidebar/>
        </div>

        <main className="md:ml-72 h-full">
            <Navbar/>
            {children}
        </main>
</div>
    )
};

export default DashboardLayout;