import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";

export default function RootLayout() {
    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <main className="p-4">
                <Outlet /> 
            </main>
        </div>
    );
}