import React, {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {message, Table} from "antd";
import axios from "axios";
import {
	MdPendingActions,
	MdLockPerson,
	MdTaskAlt,
} from "react-icons/md";

// actions and reducers
import {showLoading, hideLoading} from "../../redux/features/alertSlice";
import {setDoctors} from "../../redux/features/adminSlice";

// components
import Layout from "../../components/Ui/Layout";
import { useNavigate } from "react-router-dom";


export default function DoctorsPage() {
	const dispatch = useDispatch();
	const {doctors} = useSelector((state) => state.admin);
	const {jwt} = useSelector((state) => state.auth);
	const navigate = useNavigate()
	

	useEffect(() => {
		let mounted =true;
		if (doctors.length === 0) {
			getAllDoctors();
		}
		return () => (mounted = false);
	}, []);

	const columns = [
		{
			title: "Name",
			dataIndex: "firstName",
			render: (text, record) => (
				<span>{record.firstName + " " + record.lastName}</span>
			),
		},
		{
			title: "Email",
			key: "userId",
			render: (text, record) => (
				<span>{record.userId.email ? record.userId.email : ""}</span>
			),
		},
		{
			title: "Active",
			key: "userId",
			render: (text, record) => (
				<span>
					{record.status === "active" ? (
						<MdTaskAlt color="green" size={30} />
					) : record.status === "blocked" ? (
						<MdLockPerson color="red" size={30} />
					) : (
						<MdPendingActions color="gray" size={30} />
					)}
				</span>
			),
		},
		{
			title: "Actions",
			dataIndex: "actions",
			render: (text, record) => (
				<div className="flex gap-2">
					{record.status === "pending" ? (
						<>
							<button
								onClick={() => handleAcceptApplication(record)}
								className="bg-blue-600 px-4 py-2 hover:bg-blue-700 rounded-lg font-bold text-gray-900">
								Accept
							</button>
							<button
								onClick={() => handleRejectApplication(record)}
								className="bg-red-600 px-4 py-2 hover:red-blue-700 rounded-lg font-bold text-gray-900">
								Reject
							</button>
						</>
					) : record.status === "active" ? (
						<button
							onClick={() => handBlockDoctor(record)}
							className="bg-red-600 px-4 py-2 hover:red-blue-700 rounded-lg font-bold text-gray-900">
							Block
						</button>
					) : (
						<button
							onClick={() => handUnblockDoctor(record)}
							className="bg-red-600 px-4 py-2 hover:red-blue-700 rounded-lg font-bold text-gray-900">
							Unlock
						</button>
					)}
				</div>
			),
		},
	];
	

	return (
		<Layout>
			<div className="p-4 sm:ml-64">
				<div className="flex items-center justify-center">
					<h1 className="text-3xl text-gray-800 font-bold">
						Manage Doctors
					</h1>
				</div>
				<div className="p-4 overflow-auto">
					<div className="p-4 border-2 border-gray-200 border-dashed rounded-lg">
						<Table columns={columns} dataSource={doctors}></Table>
					</div>
				</div>
			</div>
		</Layout>
	);

	async function getAllDoctors() {
		dispatch(showLoading());
		axios
			.get("api/v1/admin/getall-doctors", {
				headers: {
					Authorization: "Bearer " + jwt,
				},
			})
			.then(({data}) => {
				dispatch(hideLoading());
				if (data.success) {
					dispatch(setDoctors({doctors: data.data}));
				} else {
					message.error(
						data.message ||
							"Something went wrong while fetching doctors"
					);
				}
			})
			.catch((error) => {
				//console.log(error);
				message.error("Something went wrong while fetching doctors");
			});
	}

	async function handleAcceptApplication(record){
		const doctorId = record._id;
		if(!doctorId){
			return;
		}
		try {
			const res = await axios.post(
				`api/v1/admin/approve-doctor?doctorId=${doctorId}`,
				{},
				{
					headers: {
						Authorization: "Bearer " + jwt,
					},
				}
			);

			if (res.data.success) {
				message.success(res.data.message || "Doctor is approved !");
				getAllDoctors();
				//upadate user & doctor in redux-store
				navigate(0);
			} else {
				message.error(res.data.message || "Something went wrong!");
			}
		} catch (error) {
			message.error(res.data.message || "Something went wrong!");
		}
		
	}

	async function handleRejectApplication(record) {
		const doctorId = record._id;
		if (!doctorId) {
			return;
		}
		try {
			const res = await axios.post(
				`api/v1/admin/reject-doctor?doctorId=${doctorId}`,
				{},
				{
					headers: {
						Authorization: "Bearer " + jwt,
					},
				}
			);

			if (res.data.success) {
				message.success(res.data.message || "Doctor is rejected !");
				//window.location.reload();
				getAllDoctors();
				navigate(0);
			} else {
				message.error(res.data.message || "Something went wrong!");
			}
		} catch (error) {
			message.error(res.data.message || "Something went wrong!");
		}
	}

	async function handBlockDoctor(record) {
		const doctorId = record._id;
		if (!doctorId) {
			return;
		}
		try {
			const res = await axios.post(
				`api/v1/admin/block-doctor?doctorId=${doctorId}`,
				{},
				{
					headers: {
						Authorization: "Bearer " + jwt,
					},
				}
			);

			if (res.data.success) {
				message.success(res.data.message || "Doctor is blocked !");
				//window.location.reload();
				getAllDoctors();
				navigate(0);
			} else {
				message.error(res.data.message || "Something went wrong!");
			}
		} catch (error) {
			message.error(res.data.message || "Something went wrong!");
		}
	}

	async function handUnblockDoctor(record) {
		const doctorId = record._id;
		if (!doctorId) {
			return;
		}
		try {
			const res = await axios.post(
				`api/v1/admin/unblock-doctor?doctorId=${doctorId}`,
				{},
				{
					headers: {
						Authorization: "Bearer " + jwt,
					},
				}
			);

			if (res.data.success) {
				message.success(res.data.message || "Doctor is unblocked !");
				//window.location.reload();
				getAllDoctors();
				navigate(0);
			} else {
				message.error(res.data.message || "Something went wrong!");
			}
		} catch (error) {
			message.error(res.data.message || "Something went wrong!");
		}
	}
}
