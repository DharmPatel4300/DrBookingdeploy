import React from "react";

import {useSelector} from "react-redux";
import {Navigate} from "react-router-dom";

export default function ProtectedRoutes({children}) {
	const {user} = useSelector((state) => state.auth);

	if (!user) {
		return <Navigate to="/login" />;
	} else {
		return children;
	}
}
