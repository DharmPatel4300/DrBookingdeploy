import React from "react";
import {Form, Input,message} from "antd";
import {useNavigate, Link} from "react-router-dom";
import axios from "axios";

const headerContent = (
	<div    className="text-center mb-5">
		<div    className="text-2xl font-bold">Register</div>
		<div    className="font-light text-neutral-500 mt-2 pb-2">
			Welcom to Book My Dr.
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
					Already have an account?
				</div>
				<Link
					to={"/login"}
					   className="text-nuetral-bold 
                    cursor-pointer hover:underline">
					Log in
				</Link>
			</div>
		</div>
	</div>
);

export default function RegisterPage() {
	const navigate = useNavigate();
	const onSubmitHandler =async (values) => {
		try {
			const res = await axios
				.post("api/v1/register", {...values})
			
			if (res.data?.success === false) {
				message.error(res.data?.message || "Something went wrong");
			}

			if (res.data?.success === true) {
				message.success(res.data?.message || "You are registered successfully");
				navigate("/login")
			}

		} catch (error) {
			message.error("Something went wrong")
		}
	};
	return (
		<main    className="bg-gray-50 flex w-full h-screen items-center">
			<div    className="w-full bg-white sm:w-96 mx-auto border p-4 rounded-lg flex flex-col shadow-sm">
				<>{headerContent}</>
				<Form layout="vertical" onFinish={onSubmitHandler}>
					<Form.Item label="Name" name={"name"}>
						<Input type="text" required />
					</Form.Item>
					<Form.Item label="Email" name={"email"}>
						<Input type="email" required />
					</Form.Item>
					<Form.Item label="Password" name={"password"}>
						<Input type="password" />
					</Form.Item>
					<button
						type="submit"
						   className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
						Submit
					</button>
				</Form>
				<div>{footerContent}</div>
			</div>
		</main>
	);
}
