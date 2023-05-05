import React from "react";
import {logOutUser} from "../redux/features/authSlice";
import {useDispatch} from "react-redux";
import { useNavigate } from "react-router-dom";

import Layout from '../components/Ui/Layout'

export default function LogoutPage() {

	const dispatch = useDispatch();
	const navigate = useNavigate();
	
	const handleLogOut = () => {
		dispatch(logOutUser());
		localStorage.removeItem("jwt");
	};

	return (
		<Layout>
			<div className="p-4 sm:ml-64">
				<div className="p-4 border-2 border-gray-200 border-dashed rounded-lg">
					<div className="flex flex-col justify-start border h-48">
						<div className="my-4 w-full">
							<h1 className="mx-auto text-center mb-3">
								Are you sure want to logout?
							</h1>
							<hr />
						</div>
						<div className="flex justify-center items-center my-4 w-full gap-4">
							<button
								onClick={() => navigate("/")}
								type="btn"
								className="bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-500">
								<span className="text-white text-base">
									Cancel
								</span>
							</button>
							<button
								onClick={handleLogOut}
								type="btn"
								className="bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-500">
								<span className="text-white text-base">
									Logout
								</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
}
