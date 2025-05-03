import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/sidebar/sidebar';
import Header from '../components/header/header';

export default function Home() {
    return (
        <div className="flex flex-col h-screen font-poppins">
            <div className='flex h-[100%] '>
                <div className='full'>
                    <Sidebar />
                </div>
                <div className="flex-1 overflow-hidden">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}