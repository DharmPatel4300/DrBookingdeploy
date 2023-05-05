import Layout from "../components/Ui/Layout";
import {useSelector} from "react-redux";
import DoctorList from "../components/DoctorList";
import { useEffect, useState } from "react";
import {message} from 'antd'
import axios from 'axios';


export default function HomePage() {

	const {user,jwt} = useSelector((state) => state.auth);
	const [doctors,setDoctors] = useState([]);
	useEffect(()=>{
		if(doctors.length===0){
			getAllDoctors();
		}
	},[])
	return (
		<Layout>
			<div className="flex items-center justify-center">
				Welcome {user?.name}
			</div>
			<div className="p-4 sm:ml-64">
				<div className="p-4 border-2 border-gray-200 border-dashed rounded-lg">
					<DoctorList doctors={doctors}/>
				</div>
			</div>
		</Layout>
	);

	async function getAllDoctors(){
		try {
			const res = await axios.get("api/v1/user/get-all-doctors", {
				headers: {
					Authorization: "Bearer " + jwt,
					"Content-Type": "application/json",
					"Access-Control-Allow-Credentials": true,
				},
				withCredentials: true,
			});

			
			if (res.data?.success) {
				message.success(res.data?.message);
				setDoctors(res.data?.data);
			} else {
				message.error(res.data.message || "Please try again");
			}
		} catch (error) {
			//console.log(error);
			message.error("Something went wrong!");
		}
	}
}
