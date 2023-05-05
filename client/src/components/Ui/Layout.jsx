import React, {useState} from "react";
import Navbar from "../Navbar";

import Sidebar from "../Sidebar/Sidebar";

export default function Layout({children}) {
	return (
		<>
			<main>
				<Navbar />
				<Sidebar />
				<section    className="mt-28">
					{/* content */}
					<div>
						<header></header>
						<div>{children}</div>
					</div>
				</section>
			</main>
		</>
	);
}
