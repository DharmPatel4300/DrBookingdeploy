import React, {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {message, Table} from "antd";
import axios from "axios";
import { MdLockPerson, MdTaskAlt} from "react-icons/md";

// actions and reducers
import {showLoading, hideLoading} from "../../redux/features/alertSlice";
import {setUsers} from "../../redux/features/adminSlice";

// components
import Layout from "../../components/Ui/Layout";


export default function UsersPage() {
	const dispatch = useDispatch();
	const {jwt} = useSelector((state) => state.auth);
	const {users} = useSelector((state) => state.admin);

	//antd table col
	const columns = [
		{
			title: "Name",
			dataIndex: "name",
		},
		{
			title: "Email",
			dataIndex: "email",
		},
		{
			title: "Status",
			dataIndex: "status",
			render: (text, record) => (
				<span>
					{record.status === "active" ? (
						<MdTaskAlt color="green" size={30} />
					) : (
						<MdLockPerson color="red" size={30} />
					)}
				</span>
			),
		},
		{
			title: "Actions",
			dataIndex: "actions",
			render: (text, record) => (
				<div className="flex">
					{record.status === "active" ? (
						<button
							onClick={() => blockUserHandler(record)}
							className="bg-red-600 px-4 py-2 hover:bg-red-700 rounded-lg font-bold text-gray-900">
							Block
						</button>
					) : (
						<button
							onClick={() => unblockUserHandler(record)}
							className="bg-red-600 px-4 py-2 hover:bg-red-700 rounded-lg font-bold text-gray-900">
							Unblock
						</button>
					)}
				</div>
			),
		},
	];

	useEffect(() => {
		let mounted = true;
		if (users.length === 0) {
			getAllUsers();
		}

		return () => (mounted = false);
	}, []);

	return (
		<Layout>
			<div className="p-4 sm:ml-64">
				<div className="flex items-center justify-center">
					<h1 className="text-3xl text-gray-800 font-bold">
						Manage Users
					</h1>
				</div>
				<div className="p-4">
					<div className="p-4 border-2 border-gray-200 border-dashed rounded-lg">
						<Table columns={columns} dataSource={users}></Table>
					</div>
				</div>
			</div>
		</Layout>
	);

	async function getAllUsers() {
		dispatch(showLoading());
		axios
			.get("api/v1/admin/getall-users", {
				headers: {
					Authorization: "Bearer " + jwt,
					"Content-Type": "application/json",
					"Access-Control-Allow-Credentials": true,
				},
				withCredentials: true,
			})
			.then(({data}) => {
				dispatch(hideLoading());
				if (data.success) {
					dispatch(setUsers({users: data.data}));
				} else {
					message.error(
						data.message ||
							"Something went wrong while fetching users"
					);
				}
			})
			.catch((error) => {
				//console.log(error);
				message.error("Something went wrong while fetching users");
			});
	}

	async function blockUserHandler(record) {
		const userId = record._id;
		if (!userId) {
			return;
		}
		try {
			const res = await axios.post(
				`api/v1/admin/block-user?userId=${userId}`,
				{},
				{
					headers: {
						Authorization: "Bearer " + jwt,
					},
				}
			);

			if (res.data.success) {
				message.success(res.data.message || "User is blocked !");
				//window.location.reload();
				getAllUsers();
				navigate(0);
			} else {
				message.error(res.data.message || "Something went wrong!");
			}
		} catch (error) {
			message.error(res.data.message || "Something went wrong!");
		}
	}

	async function unblockUserHandler(record) {
		const userId = record._id;
		if (!userId) {
			return;
		}
		try {
			const res = await axios.post(
				`api/v1/admin/unblock-user?userId=${userId}`,
				{},
				{
					headers: {
						Authorization: "Bearer " + jwt,
					},
				}
			);

			if (res.data.success) {
				message.success(res.data.message || "User is unblocked !");
				//window.location.reload();
				getAllUsers();
				navigate(0);
			} else {
				message.error(res.data.message || "Something went wrong!");
			}
		} catch (error) {
			message.error(res.data.message || "Something went wrong!");
		}
	}

}
