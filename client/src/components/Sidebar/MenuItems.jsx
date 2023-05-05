// icons
import {
	FaUserMd,
	FaHome,
	FaUserLock,
	FaUserCircle,
	FaUser,
} from "react-icons/fa";
import {HiLogout} from "react-icons/hi";

import MenuItem from "./MenuItem"
import { useEffect, useState } from "react";
import {useSelector} from "react-redux";




export default function MenuItems() {
	const {user} = useSelector((state) => state.auth);
	const allMenuItems = [
		{
			path: "/",
			title: "Home",
			roles: ["DOCTOR", "USER", "ADMIN"],
			icon: (
				<FaHome
					size={30}
					className={`flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 `}
				/>
			),
		},
		{
			path: "/admin/doctors",
			title: "Manage Doctors",
			roles: ["ADMIN"],
			icon: (
				<FaUserMd
					size={30}
					className={`flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 `}
				/>
			),
		},
		{
			path: "/admin/users",
			title: "Manage Users",
			roles: ["ADMIN"],
			icon: (
				<FaUser
					size={30}
					className={`flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 `}
				/>
			),
		},
		{
			path: "/appointments",
			title: "Appointments",
			roles: ["USER","DOCTOR"],
			icon: (
				<FaUserLock
					size={30}
					className={`flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 `}
				/>
			),
		},
		{
			path: "/apply-doctor",
			title: "Apply Doctor",
			roles: ["USER"],
			icon: (
				<FaUserMd
					size={30}
					className={`flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 `}
				/>
			),
		},
		{
			path: `/profile/${user.id}`,
			title: "Profile",
			roles: ["DOCTOR", "USER", "ADMIN"],
			icon: (
				<FaUserCircle
					size={30}
					className={`flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 `}
				/>
			),
		},
		{
			path: "/logout",
			title: "Logout",
			roles: ["DOCTOR", "USER", "ADMIN"],
			icon: (
				<HiLogout
					size={30}
					className={`flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 `}
				/>
			),
		},
	];

	
	const menuItems = allMenuItems.filter((item)=>item.roles.includes(user.role))

	return (
		<ul className="space-y-2 font-medium">
			{menuItems.map(({path, title, icon}, index) => (
				<MenuItem key={index} path={path} title={title} icon={icon} />
			))}
		</ul>
	);
}
