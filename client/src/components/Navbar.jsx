import React,{useEffect} from 'react'
import axios from "axios";

import {AiOutlineMenu,AiOutlineClose,AiFillBell} from "react-icons/ai"
import {NavLink} from "react-router-dom";

//Hooks and states
import { useSelector , useDispatch} from "react-redux";
import {showSidebar, hideSidebar} from "../redux/features/uiSlice";

//components
import Badge from "./Ui/Badge"


export default function Navbar() {


    //state variables selections
    const { user} = useSelector((state) => state.auth);
    const {isSidebar} = useSelector((state) => state.ui);
	
  return (
		<nav
			className={`w-full h-20 fixed top-0 z-30 px-4 py-4 mb-10 flex gap-3 items-center bg-slate-50 border shadow-sm ${
				user
					? "sm:will-change-transform sm:translate-x-64 sm:justify-start"
					: ""
			} ${isSidebar ? "justify-end" : ""}`}>
			{!user ? (
				<>
					<NavLink className="font-semibold" to="/login">
						Login
					</NavLink>
					<NavLink className="font-semibold" to="/register">
						Sign Up
					</NavLink>
				</>
			) : (
				<>
					<button className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 ">
						<span className="sr-only">Open sidebar</span>
						{isSidebar ? (
							<AiOutlineClose
								size={25}
								onClick={() => dispatch(hideSidebar())}
							/>
						) : (
							<AiOutlineMenu
								size={25}
								onClick={() => dispatch(showSidebar())}
							/>
						)}
					</button>
					<NavLink to={"/"} className="font-semibold">
						Book My Doctor
					</NavLink>
					<NavLink
						to={"/notifications"}
						className="font-semibold relative h-10 w-10 inline-flex justify-center items-center">
						<AiFillBell
							className={`flex-shrink-0 w-6 h-6 transition duration-75 group-hover:text-gray-900 ${
								user?.notifications?.length === 0
									? "text-gray-500"
									: "text-blue-600"
							}`}
							size={25}
						/>
						<div className='absolute top-0 right-0'>
							{<Badge>{user?.notifications?.length}</Badge>}
						</div>
					</NavLink>
				</>
			)}
		</nav>
  );
}
