import React from 'react'
import {PacmanLoader} from "react-spinners";

export default function Spinner() {
  return (
		<div    className="w-full h-screen absolute top-0 left-0 bg-gray-900/30 flex items-center justify-center z-10">
			<PacmanLoader
				   className=" absolute z-20 shadow-2xl"
				color="rgb(59 130 246)"
			/>
		</div>
  );
}
