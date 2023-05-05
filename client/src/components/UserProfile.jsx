import React from 'react'
import { useSelector } from 'react-redux';
import {Form, Input, message} from "antd";
import axios from "axios";


export default function UserProfile() {
    const {user} = useSelector(state=>state.auth)
  return (
		<div>
			<Form initialValues={user} layout="vertical" onFinish={updateUser}>
				<Form.Item label="Name" name={"name"}>
					<Input type="text" required />
				</Form.Item>
				<Form.Item label="Email" name={"email"}>
					<Input type="email" required />
				</Form.Item>
				<Form.Item label="Old Password" name={"oldPassword"}>
					<Input type="password" />
				</Form.Item>
				<Form.Item label="New Password" name={"password"}>
					<Input type="password" />
				</Form.Item>
				<div className="mx-auto">
					<button
						type="submit"
						className="bg-blue-600 w-full sm:w-96 py-2 rounded-lg hover:bg-blue-500">
						<span className="text-white text-base">Update</span>
					</button>
				</div>
			</Form>
		</div>
  );

  async function updateUser(values) {
		dispatch(showLoading());

		try {
			const res = await axios.post(
				"api/v1/user/update-profile",
				{
					...values,
				},
				{
					headers: {
						Authorization: "Bearer " + jwt,
						"Content-Type": "application/json",
						"Access-Control-Allow-Credentials": true,
					},
					withCredentials: true,
				}
			);

			if (res.data.success) {
				message.success(
					res.data.message || "User info updated successfully"
				);
				dispatch(
					auhtenticateOrUpdateUser({
						user: {
							...user,
							email: values.email,
							name: values.name,
						},
					})
				);
			} else {
				message.error(res.data.message);
			}
		} catch (err) {
			//console.log(err);
			dispatch(hideLoading());
			message.error("Something went wrong!");
		}
  }
}
