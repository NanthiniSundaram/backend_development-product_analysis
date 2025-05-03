import { Bell, LogOut, Menu, Sun } from 'lucide-react'
import React, { useState } from 'react'
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button
} from "@heroui/react";
// import { useSidebarStore } from '../../store/sidebar/sidebarStore';
import Logo from "../../assets/Logo.svg";
// import { useAuthStore } from '../../store/Auth/AuthStore';
import { useNavigate } from 'react-router-dom';
import UserImg from '../../assets/user.jpg';
import { Tooltip } from '@heroui/react';

export default function Header() {
    // const SidebarView = useSidebarStore((state) => state.toggleSidebar);
    // const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);

    const handleLogout = () => {
        // logout();
        setOpen(false);
    }

    const username = localStorage.getItem('name');
    const client_name = localStorage.getItem('client_name')
    const client_id = localStorage.getItem('client_id')

    return (
        <>
            <div className='w-full h-full bg-gray-900 text-white flex justify-center items-center gap-5'>
                <div className='flex items-center justify-center mt-[0.3rem] ml-2 cursor-pointer max-md:hidden '
                //  onClick={SidebarView}
                 >
                    <Menu size={20} />
                </div>
                <div className='w-[95%] flex justify-between items-center'>
                    <div className='flex gap-5 justif-center items-center ml-7'>
                        <img src='/translogo.png' alt='Logo' className='w-[2.1rem]' />
                        <span className="text-xl font-bold">EQ-REV</span>
                    </div>
                    <div className='flex gap-5 cursor-pointer items-center'>
                        <div className='flex gap-3 items-center px-3'>
                            <div className="w-8 md:w-[34px] h-[34px] bg-gray-200 rounded-full flex items-center justify-center text-black font-semibold">
                                {client_name.charAt(0).toUpperCase()}
                            </div>
                            <div className='flex flex-col '>
                                <p className='text-[14px]'>{client_name.charAt(0).toUpperCase() + client_name.slice(1)}</p>
                                <div className='flex gap-1 text-[12px] text-gray-300'>
                                    <p>{client_id}</p>
                                </div>
                            </div>
                        </div>
                        <Tooltip content={<p className='px-3'>Logout</p>} placement='bottom' radius='sm' >
                            <LogOut
                                size={17}
                                className='mx-2 text-red-400 cursor-pointer'
                                onClick={() => setOpen(true)}
                            />
                        </Tooltip>
                    </div>
                </div>
            </div>

            {open && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs"
                    onClick={() => setOpen(false)}
                >
                    <div
                        className="bg-white rounded-lg shadow-xl max-w-sm w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Confirm Logout</h2>
                            <p className="mb-6">Are you sure you want to log out of your account?</p>
                            <div className="flex justify-end space-x-2">
                                <button
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                    onClick={() => setOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}