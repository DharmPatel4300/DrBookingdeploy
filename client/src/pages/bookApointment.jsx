import React,{useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import { useSelector,useDispatch } from 'react-redux';
import {message,DatePicker,TimePicker} from 'antd';
import moment from 'moment';
import axios from 'axios';

import Layout from '../components/Ui/Layout'

export default function BookApointment() {
	const {jwt,user} = useSelector(state=>state.auth);

	const params = useParams();
	const [doctor,setDoctor] = useState(null);
	const [time,setTime] = useState([]);
	const [date,setDate] = useState("");
	const [isAvailable,setIsAvailable] = useState(false);
	const navigate = useNavigate();

	useEffect(()=>{
		if(!doctor){
			getDoctorById(params.doctorId,)
		}
	},[])

  return (
		<Layout>
			<div className="flex items-center justify-center sm:ml-64">
				<div className="flex items-center justify-center">
					<h1 className="text-3xl text-gray-800 font-bold">
						Book Appointment
					</h1>
				</div>
			</div>
			<div className="p-4 sm:ml-64">
				<div className="p-4 border-2 border-gray-200 border-dashed rounded-lg">
					{doctor && (
						<div>
							<h4 className="text-lg text-gray-800 font-semibold ">{`${doctor.firstName} ${doctor.lastName}`}</h4>
							<h4 className="text-lg text-gray-800 font-semibold ">
								{" "}
								Fees: ₹ {doctor.feesPerConsultation}
							</h4>
							<h4 className="text-lg text-gray-800 font-semibold ">
								Timings:{" "}
								{`${doctor.timings[0]} to ${doctor.timings[1]}`}
							</h4>
							<div className="flex flex-col gap-3 mt-3 max-w-sm">
								<DatePicker
									format="DD-MM-YYYY"
									onChange={(value) =>
										setDate(
											moment(value).format("DD-MM-YYYY")
										)
									}
								/>
								<TimePicker
									format="HH:mm"
									onChange={(value) =>
										setTime(moment(value).format("HH:mm"))
									}
								/>
								<button onClick={handleAvailability} className="bg-blue-600 py-3 text-lg font-semibold text-white shadow-md rounded-sm hover:bg-blue-600/90">
									Check Availability
								</button>
								{isAvailable && (
									<button
										onClick={handleBooking}
										className="bg-gray-600 py-3 text-lg font-semibold text-white shadow-md rounded-sm hover:bg-gray-600/90">
										Book Now
									</button>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</Layout>
  );

  async function getDoctorById(doctorId) {
		try {
			const res = await axios.get("api/v1/get-doctor", {
				
				params: {
					doctorId
				},
			});

			if (res.data.success) {
				message.success(res.data.message || "Doctor info recived");
				setDoctor(res.data.data);
			} else {
				message.error(res.data.message);
			}
		} catch (err) {
			//console.log(err);
			message.error("Something went wrong!");
		}
  }

  async function handleBooking() {
		try {
			
			const res = await axios.post(
				"api/v1/user/book-appointment",
				{
					doctorId:params.doctorId,
					userId:user.id,
					time,
					date
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
				message.success(res.data.message || "Request sent to doctor");
				navigate(`/book-appointment/${params.doctorId}`);
				//window.location.reload(false);
			} else {
				message.error(res.data.message || "Error while booking");
			}
		} catch (err) {
			//console.log(err);
			message.error("Something went wrong!");
		}
  }

  async function handleAvailability(){
	try {
		const res = await axios.post(
			"api/v1/user/book-availability",
			{doctorId: params.doctorId,time,date},
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
			if (res.data.data?.isAvailable) {
				message.success(res.data.message || "Booking available at this time");
				setIsAvailable(true);
			}else{
				message.success(
					res.data.message || "Booking not available at this time"
				);
				setIsAvailable(false);
			}
		} else {
			message.error(res.data.message || "Error while booking");
		}

	} catch (err) {
		//console.log(err);
		message.error("Something went wrong!");
	}
  }
}
