import React, {useEffect, useState} from "react";
import Layout from "../../components/Ui/Layout";
import moment from 'moment'
import {Form, Input, Row, Col, TimePicker, message} from "antd";
import axios from "axios";

import {useSelector, useDispatch} from "react-redux";
import {showLoading, hideLoading} from "../../redux/features/alertSlice";
import {auhtenticateOrUpdateUser} from "../../redux/features/authSlice";

import UserProfile from '../../components/UserProfile'


export default function Profile() {
	const {user, jwt} = useSelector((state) => state.auth);
	const [profile, setProfile] = useState();
	const dispatch = useDispatch();

	useEffect(() => {
		if (user.role === "DOCTOR") {
			getDoctorProfile();
		}
		
	}, []);

	return (
		<Layout>
			<div className="flex items-center justify-center sm:ml-64">
				<div className="flex items-center justify-center">
					<h1 className="text-3xl text-gray-800 font-bold">
						Manage Profile
					</h1>
				</div>
			</div>
			<div className="p-4 sm:ml-64">
				<div className="p-4 border-2 border-gray-200 border-dashed rounded-lg">
					{profile && user.role === "DOCTOR" ? (
						<Form
							initialValues={{
								...profile,
								timings: [
									moment(profile.timings[0], "HH:mm"),
									moment(profile.timings[1], "HH:mm"),
								],
							}}
							className="pr-3"
							layout="vertical"
							onFinish={updateDoctorProfile}>
							<div className="sub-header">
								<h5 className="text-gray-700 font-semibold text-xl mb-2">
									Personal Details
								</h5>
								<hr />
							</div>
							<Row gutter={15} className="mt-5">
								<Col xs={24} md={24} lg={8}>
									<Form.Item
										className="font-semibold text-xl text-gray-700"
										label="First Name"
										name="firstName"
										required
										rules={[{required: true}]}>
										<Input
											type="text"
											placeholder="your firstname"
										/>
									</Form.Item>
								</Col>
								<Col xs={24} md={24} lg={8}>
									<Form.Item
										className="font-semibold text-xl text-gray-700"
										label="Last Name"
										name="lastName"
										required
										rules={[{required: true}]}>
										<Input
											type="text"
											placeholder="your lastName"
										/>
									</Form.Item>
								</Col>
								<Col xs={24} md={24} lg={8}>
									<Form.Item
										className="font-semibold text-xl text-gray-700"
										label="Phone No."
										name="phone"
										required
										rules={[{required: true}]}>
										<Input
											type="text"
											placeholder="your phone"
										/>
									</Form.Item>
								</Col>
								<Col xs={24} md={24} lg={8}>
									<Form.Item
										className="font-semibold text-xl text-gray-700"
										label="Have you website ?"
										name="website">
										<Input
											type="text"
											placeholder="your web address"
										/>
									</Form.Item>
								</Col>
							</Row>

							<div className="sub-header">
								<h5 className="text-gray-700 font-semibold text-xl mb-2">
									Professional Details
								</h5>
								<hr />
							</div>
							<Row gutter={15} className="mt-5">
								<Col xs={24} md={24} lg={8}>
									<Form.Item
										className="font-semibold text-xl text-gray-700"
										label="Where is your place ?"
										name="address"
										required
										rules={[{required: true}]}>
										<Input
											type="text"
											placeholder="your address"
										/>
									</Form.Item>
								</Col>
								<Col xs={24} md={24} lg={8}>
									<Form.Item
										className="font-semibold text-xl text-gray-700"
										label="What is your specialization ?"
										name="specialization"
										required
										rules={[{required: true}]}>
										<Input
											type="text"
											placeholder="your specialization"
										/>
									</Form.Item>
								</Col>
								<Col xs={24} md={24} lg={8}>
									<Form.Item
										className="font-semibold text-xl text-gray-700"
										label="Since how many years have you been practising?"
										name="experience"
										required
										rules={[{required: true}]}>
										<Input
											type="number"
											placeholder="your experience"
										/>
									</Form.Item>
								</Col>
								<Col xs={24} md={24} lg={8}>
									<Form.Item
										className="font-semibold text-xl text-gray-700"
										label="How much do charge for 1 session ?"
										name="feesPerConsultation"
										required
										rules={[{required: true}]}>
										<Input
											type="number"
											placeholder="your fees amount"
										/>
									</Form.Item>
								</Col>
								<Col xs={24} md={24} lg={8}>
									<Form.Item
										className="font-semibold text-xl text-gray-700"
										label="Show your opnning hours to patients"
										name="timings"
										required
										rules={[{required: true}]}>
										<TimePicker.RangePicker format="HH:mm" />
									</Form.Item>
								</Col>
							</Row>
							<div className="mx-auto">
								<button
									type="submit"
									className="bg-blue-600 w-full sm:w-96 py-2 rounded-lg hover:bg-blue-500">
									<span className="text-white text-base">
										Update
									</span>
								</button>
							</div>
						</Form>
					) : (
						<></>
					)}
				</div>

				<div className="p-4 border-2 border-gray-200 border-dashed rounded-lg">
					<div className="flex items-center justify-center ">
						<div className="flex items-center justify-center">
							<h1 className="text-3xl text-gray-800 font-bold">
								Manage User Profile
							</h1>
						</div>
					</div>
					<UserProfile />
				</div>
			</div>
		</Layout>
	);

	async function getDoctorProfile() {
		
		try {
			const res = await axios.get("api/v1/doctor/get-profile", {
				headers: {
					Authorization: "Bearer " + jwt,
					"Content-Type": "application/json",
					"Access-Control-Allow-Credentials": true,
				},
				withCredentials: true,
			});
			
			if (res.data.success) {
				message.success(res.data.message || "Doctor info recived");
				setProfile(res.data.data);
			} else {
				message.error(res.data.message);
			}
		} catch (err) {
			//console.log(err);
			message.error("Something went wrong!");
		}
	}

	async function updateDoctorProfile(values) {
		try {
			const res = await axios.post(
				"api/v1/doctor/update-profile",
				{	...values,
					timings:[
						moment(values.timings[0],'HH:mm'),
						moment(values.timings[1],'HH:mm')
					]
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
					res.data.message || "Doctor info updated successfully"
				);
				setProfile(res.data.data);
			} else {
				message.error(res.data.message);
			}
		} catch (err) {
			//console.log(err);
			message.error("Something went wrong!");
		}
	}

	
}
