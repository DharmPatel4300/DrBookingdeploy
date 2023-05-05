import React from 'react'

export default function Badge({children}) {
	return (
		<span
			className={`inline-flex items-center justify-center w-3 h-3 p-1 ml-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full`}>
			{children}
		</span>
	);
}
