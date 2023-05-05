import {useSelector, useDispatch} from "react-redux";
import { Link } from 'react-router-dom';


// icons
import { FaUserCircle } from "react-icons/fa";

import MenuItems from	"./MenuItems"


export default function Sidebar() {

    const {isSidebar} = useSelector(state=>state.ui);
    const {user} = useSelector(state=>state.auth);


	return (
		<aside
			   className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform sm:translate-x-0 border ${
				!isSidebar ? "-translate-x-full" : " "
			}`}
			aria-label="Sidebar">
			<div    className="h-full px-3 py-4 overflow-y-auto bg-gray-50 ">
				<header    className="flex justify-between mb-5 border py-5">
					<Link
						to="/"
						   className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100 ">
						<FaUserCircle
							size={30}
							className={
								"flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 "
							}
						/>
						<span    className="ml-3 font-semibold"> {user.name}</span>
					</Link>
					<button    className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 ">
						<span     className="sr-only">Open sidebar</span>
					</button>
				</header>
			<MenuItems />
			</div>
		</aside>
	);
}
