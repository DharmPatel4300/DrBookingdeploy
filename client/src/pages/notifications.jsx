import React from 'react'
import {Tabs, message} from 'antd'
import axios from 'axios';

//hooks
import {useSelector, useDispatch} from "react-redux";
import { useNavigate } from 'react-router-dom';

// reducers and actions
import {showLoading,hideLoading} from '../redux/features/alertSlice'
import {auhtenticateOrUpdateUser} from '../redux/features/authSlice'

// components
import Layout from "../components/Ui/Layout";

export default function NotificationsPage() {
	// ALL HANDLERS ARE AT BOTTOM

	const dispatch = useDispatch();
	const navigate = useNavigate()

	//all state
	const {user, jwt} = useSelector((state) => state.auth);

	return (
		<Layout>
			<div className="p-4 sm:ml-64">
				<div className="flex items-center justify-center">
					<h1 className="text-3xl text-gray-800 font-bold">
						All Your Notifications
					</h1>
				</div>
				<div className="p-4">
					<div className="p-4 border-2 border-gray-200 border-dashed rounded-lg">
						<Tabs className="font-semibold">
							<Tabs.TabPane tab="Unread" key={0}>
								<div className="flex justify-end">
									<h4
										className="p-2 text-base font-bold text-gray-800 cursor-pointer"
										onClick={handelMarkAllRead}>
										Mark All Read
									</h4>
								</div>
								{user?.notifications.map((item, index) => (
									<div
										key={index}
										onClick={() =>
											navigate(item.data.onClickPath)
										}
										className="border-2 mb-1 rounded-lg shadow-sm bg-gray-100 p-2 cursor-pointer">
										<span className="text-base font-medium">
											{item.message}
										</span>
									</div>
								))}
							</Tabs.TabPane>
							<Tabs.TabPane tab="Read" key={1}>
								<div className="flex justify-end">
									<h4
										className="p-2 text-base font-bold text-gray-800 cursor-pointer"
										onClick={handelDeleteAllRead}>
										Delete All Read
									</h4>
								</div>
								{user?.seen_notifications.map((item,index) => (
									<div
										key={index}
										onClick={() =>
											navigate(item.data.onClickPath)
										}
										className="border-2 mb-1 rounded-lg shadow-sm bg-gray-100 p-2 cursor-pointer">
										<span className="text-base font-medium">
											{item.message}
										</span>
									</div>
								))}
							</Tabs.TabPane>
						</Tabs>
					</div>
				</div>
			</div>
		</Layout>
	);
	//handle nuread notifications
	async function handelMarkAllRead() {
		if (user.notifications.length === 0) {
			return message.error("No notifations are there!");
		}

		dispatch(showLoading());
		try {
			const res = await axios.post(
				"api/v1/user/get_markread-allnotifications",
				{userId: user._id},
				{
					headers: {
						Authorization: "Bearer " + jwt,
						"Content-Type": "application/json",
						"Access-Control-Allow-Credentials": true,
					},
					withCredentials: true,
				}
			);

			dispatch(hideLoading());
			if (res.data?.success) {
				message.success(res.data.message || "Notifications recived!");
				dispatch(auhtenticateOrUpdateUser({user: res.data.user}));
			} else {
				message.error(res.data.message || "Notifications not recived!");
			}
		} catch (error) {
			dispatch(hideLoading());
			message.error("Something went wrong");
		}
	}
	//handle read notifications
	async function handelDeleteAllRead() {
		if (user.seen_notifications.length === 0) {
			return message.error("No notifations are there!");
		}

		dispatch(showLoading());
		try {
			const res = await axios.post(
				"api/v1/user/delete_allread-notifications",
				{userId: user._id},
				{
					headers: {
						Authorization: "Bearer " + jwt,
						"Content-Type": "application/json",
						"Access-Control-Allow-Credentials": true,
					},
					withCredentials: true,
				}
			);

			dispatch(hideLoading());
			if (res.data?.success) {
				message.success(
					res.data.message || "Notifications deleted successfully!"
				);
				dispatch(auhtenticateOrUpdateUser({user: res.data.user}));
			} else {
				message.error(
					res.data.message || "Notifications not deleted yet!"
				);
			}
		} catch (error) {
			dispatch(hideLoading());
			//console.log(error);
			message.error("Something went wrong");
		}
	}
}
