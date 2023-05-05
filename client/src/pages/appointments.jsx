import React, { useEffect, useState } from 'react'
import Layout from "../components/Ui/Layout";
import { useSelector } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import {message,Table} from 'antd'
import {MdPendingActions, MdLockPerson, MdTaskAlt} from "react-icons/md";
import { useNavigate } from 'react-router-dom';

export default function Appointments() {
    const {jwt,user} = useSelector(state=>state.auth)
	const isDoctor = user.role === "DOCTOR";
    const [appointments,setAppointments] = useState([]);
	const navigate = useNavigate();


    useEffect(() => {
		if (appointments.length === 0) {
			getAppointments();
		}
	}, [appointments]);

	const REQ_URL = `/api/v1/${isDoctor ? "doctor" : "user"}/get-all-appointments`;
    const columns = [
		{
			title: "Booking ID",
			dataIndex: "_id",
		},
		{
			title: `${!isDoctor ? "Doctor" : "User"} Name`,
			dataIndex: "name",
			render: (text, record) => {
				if (isDoctor) {
					return <span>{record.userId.name} &nbsp;</span>;
				} else {
					return (
						<span>
							{record.doctorId.firstName} &nbsp;
							{record.doctorId.lastName}
						</span>
					);
				}
			},
		},
		{
			title: "Date & Time",
			dataIndex: "date",
			render: (text, record) => (
				<span>
					{moment(record.date).format("DD-MM-YYYY")}{" "}
					{moment(record.time).format("HH:mm")}
				</span>
			),
		},
		{
			title: "Status",
			key: "status",
			render: (text, record) => (
				<span>
					{record.status === "active" ? (
						<MdTaskAlt color="green" size={30} />
					) : (
						<MdPendingActions color="gray" size={30} />
					)}
				</span>
			),
		},
		{
			title: "Actions",
			key: "actions",
			render: (text, record) => (
				<div className="flex gap-2">
					{record.status === "pending" ? (
						<>
							<button
								onClick={() =>
									handleApproveBooking(record, "APPROVE")
								}
								className="bg-blue-600 px-4 py-2 hover:bg-blue-700 rounded-lg font-bold text-gray-900">
								Accept
							</button>
							<button
								onClick={() =>
									handleApproveBooking(record, "REJECT")
								}
								className="bg-red-600 px-4 py-2 hover:red-blue-700 rounded-lg font-bold text-gray-900">
								Reject
							</button>
						</>
					) : (
						<button
							onClick={() =>
								handleApproveBooking(record, "PENDING")
							}
							className="bg-red-600 px-4 py-2 hover:red-blue-700 rounded-lg font-bold text-gray-900">
							Cancel
						</button>
					)}
				</div>
			),
		},
	];
    
    return (
		<Layout>
			<div className="flex items-center justify-center sm:ml-64">
				<div className="flex items-center justify-center">
					<h1 className="text-3xl text-gray-800 font-bold">
						Your Appointments
					</h1>
				</div>
			</div>
			<div className="p-4 sm:ml-64 overflow-auto">
				<div className="p-4 border-2 border-gray-200 border-dashed rounded-lg">
					<Table
						columns={columns}
						dataSource={appointments.map((item,index) => ({
							...item,
							key:index
						}))}></Table>
				</div>
			</div>
		</Layout>
	);

  async function getAppointments(){
        try {
            const res = await axios.get(REQ_URL, {
				headers: {
					Authorization: "Bearer " + jwt,
					"Content-Type": "application/json",
					"Access-Control-Allow-Credentials": true,
				},
				withCredentials: true,
			});

            if(res.data.success){
                setAppointments(res.data.data);
            }else{
                message.error(res.data.message || "It seems you have no appointments")
            }

        } catch (error) {
            //console.log(error);
			message.error("Something went wrong!");
        }
  }

  async function handleApproveBooking(record,action){
	try {
		const res = await axios.post(
			"/api/v1/doctor/approve-booking",
			{
				bookingId: record._id,
				action
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
			const updatedBooking = appointments.map(item=>{
				if(item._id === record._id){
					return res.data.data;
				}
				return item;
			})
			message.success(res.data.message || "You confirmed appointment")
			setAppointments(updatedBooking);
		} else {
			message.error(
				res.data.message || "It seems you have no appointments"
			);
		}
	} catch (error) {
		//console.log(error);
		message.error("Something went wrong!");
	}
  }
}
