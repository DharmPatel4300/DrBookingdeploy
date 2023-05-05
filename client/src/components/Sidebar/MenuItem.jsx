import React from 'react'
import {useLocation, Link} from "react-router-dom";

export default function MenuItem({title,icon,path}) {
	//location
	const location = useLocation();

	return (
		<li>
			<Link
				to={path}
				    className={`flex items-center p-2  text-gray-900 rounded-lg  hover:bg-gray-200 ${
					location.pathname === path ? "bg-gray-200" : ""
				}`}>
				{icon}
				<span     className="flex-1 ml-3 whitespace-nowrap">{title}</span>
			</Link>
		</li>
	);
}
