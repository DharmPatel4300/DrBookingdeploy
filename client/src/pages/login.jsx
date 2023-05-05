import React from "react";
import {Form, Input,message} from "antd";
import axios from "axios";
import {useNavigate, Link} from "react-router-dom";

// actions-reducers imports
import {showLoading, hideLoading} from "../redux/features/alertSlice"
import {loginUser } from "../redux/features/authSlice"
import {useDispatch, useSelector} from "react-redux"
import {PacmanLoader} from "react-spinners";

const headerContent = (
	<div    className="text-center mb-5">
		<div    className="text-2xl font-bold">Login</div>
		<div    className="font-light text-neutral-500 mt-2 pb-2">
			Welcom back to Book My Dr.
		</div>
		<hr />
	</div>
);

const footerContent = (
	<div    className="flex flex-col gap-4 mt-3">
		<hr />
		<div
			   className="text-nuetral-500 text-start
            mt-4 font-light">
			<div    className="justify-start flex flex-row items-center gap-2">
				<div    className="text-sm font-light">
					Need an account ?
				</div>
				<Link
					to={"/register"}
					   className="text-nuetral-bold 
                    cursor-pointer hover:underline">
					Register
				</Link>
			</div>
		</div>
	</div>
);

export default function LoginPage() {
	const navigate = useNavigate();
	const dispatch  = useDispatch();
	const {loading} = useSelector((state) => state.alerts);
	
	// Sending req to backend for login 
	const onSubmitHandler = async (values) => {
		
		dispatch(showLoading())
		try {
			const res = await axios.post(
				"api/v1/login",
				{...values}
			);
			
			dispatch(hideLoading());
			if (res.data?.success === false) {
				return message.error(res.data?.message || "Something went wrong");
			}

			if (res.data?.success === true) {
				message.success(res.data?.message || "You are logged in successfully");
				dispatch(
					loginUser({
						jwt: res.data.token,
						user: res.data.user,
					})
				);
				// set token in storage
				localStorage.setItem("jwt",res.data.token);
				navigate("/")
			}

		} catch (error) {
			//console.log(error);
			message.error("Something went wrong")
			dispatch(hideLoading());
		}
	};

	return (
		<main    className="bg-gray-50 flex w-full h-screen items-center">

			{/* form */}
			<div    className="w-full bg-white sm:w-96 mx-auto border p-4 rounded-lg flex flex-col shadow-sm ">
				<>
					{loading ? (
						<PacmanLoader
							color="rgb(59 130 246)"
							   className="my-4 "
						/>
					) : (
						headerContent
					)}
				</>
				<Form layout="vertical" onFinish={onSubmitHandler}>
					<Form.Item label="Email" name={"email"}>
						<Input type="email" required />
					</Form.Item>
					<Form.Item label="Password" name={"password"}>
						<Input type="password" required />
					</Form.Item>
					<button
						type="submit"
						   className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
						Login
					</button>
				</Form>
				<div>{footerContent}</div>
			</div>
		</main>
	);
}
