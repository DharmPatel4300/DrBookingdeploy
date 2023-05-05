import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function DoctorCard({item}) {
  const navigate = useNavigate();


  return (
		<div
			onClick={() => navigate(`/book-appointment/${item._id}`)}
			className="p-2 border border-gray-400 shadow-xl rounded-md bg-gray-100/70 hover:bg-white hover:scale-95 transition-all cursor-pointer">
			<h3 className="mb-3 text-center font-semibold text-lg text-gray-800">
				{item.firstName + " " + item.lastName}
			</h3>
			<div>
				<p className="grid grid-cols-2 gap-2">
					<span className="font-semibold text-gray-700">
						Specialization
					</span>
					<span className="font-semibold text-gray-500">
						{item.specialization}
					</span>
				</p>
				<p className="grid grid-cols-2 gap-2">
					<span className="font-semibold text-gray-700">
						Experiance
					</span>
					<span className="font-semibold text-gray-500">
						{item.experience} years
					</span>
				</p>
				<p className="grid grid-cols-2 gap-2">
					<span className="font-semibold text-gray-700">
						Fees per consultation
					</span>
					<span className="font-semibold text-gray-500">
						₹ {item.feesPerConsultation}
					</span>
				</p>
				<p className="grid grid-cols-2 gap-2">
					<span className="font-semibold text-gray-700">
						Opening hours
					</span>
					<span className="font-semibold text-gray-500">
						{item.timings[0]} TO {item.timings[1]}
					</span>
				</p>
			</div>
		</div>
  );
}
