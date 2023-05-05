import React from 'react'

import DoctorCard from './DoctorCard';


export default function DoctorList({doctors}) {
    return (
		<div className='grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'>
			{doctors?.map((item) => (
				<DoctorCard key={item._id} item={item}/>
			))}
		</div>
	);
}
