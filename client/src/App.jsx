import "./App.css";
import React, {useEffect} from "react";
import axios from "axios";

import {BrowserRouter, Routes, Route} from "react-router-dom";

//pages
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import ApplyDoctorPage from "./pages/applyDoctor";
import LogoutPage from './pages/logout';
import NotificationsPage from './pages/notifications';
import DoctorsPage from	'./pages/admin/doctors';
import UsersPage from	'./pages/admin/users';
import Profile from "./pages/doctor/profile";
import BookApointment from "./pages/bookApointment";
import Appointments from "./pages/appointments";


//Hooks and states
import { useSelector , useDispatch} from "react-redux";
import {showLoading,hideLoading} from "./redux/features/alertSlice"
import {auhtenticateOrUpdateUser} from "./redux/features/authSlice";
import {showSidebar, hideSidebar} from "./redux/features/uiSlice";

//route security
import PublicRoute from "./components/PublicRoutes";
import ProtectedRoutes from "./components/ProtectedRoutes";



function App() {
	const dispatch = useDispatch();
	const {jwt, user} = useSelector((state) => state.auth);
	
	useEffect(() => {
		let mounted = true;
		dispatch(showLoading());
		axios
			.get("api/v1/user/get-user", {
				headers: {
					Authorization: "Bearer " + jwt,
					"Content-Type": "application/json",
					"Access-Control-Allow-Credentials": true,
				},
				withCredentials: true,
			})
			.then(({data}) => {
				const {user, message, success} = data;
				if (mounted) {
					dispatch(hideLoading());
					if (user) {
						dispatch(auhtenticateOrUpdateUser({user}));
					}
				}
			})
			.catch((err) => {
				if (mounted) {
					dispatch(hideLoading());
				}
			});

		//clear mounted to avoid conflict state changes
		return () => (mounted = false);
	}, []);

	return (
		<BrowserRouter>
			<Routes>
				{/* PUBLIC ROUTES  */}
				<Route
					path="/login"
					element={
						<PublicRoute>
							<LoginPage />
						</PublicRoute>
					}
				/>
				<Route
					path="/register"
					element={
						<PublicRoute>
							<RegisterPage />
						</PublicRoute>
					}
				/>
				{/* PROTECTED ROUTES  */}
				<Route
					path="/"
					element={
						<ProtectedRoutes>
							<HomePage />
						</ProtectedRoutes>
					}
				/>
				<Route
					path="/notifications"
					element={
						<ProtectedRoutes>
							<NotificationsPage />
						</ProtectedRoutes>
					}
				/>
				<Route
					path="/book-appointment/:doctorId"
					element={
						<ProtectedRoutes>
							<BookApointment />
						</ProtectedRoutes>
					}
				/>
				<Route
					path="/apply-doctor"
					element={
						<ProtectedRoutes>
							<ApplyDoctorPage />
						</ProtectedRoutes>
					}
				/>
				<Route
					path="/appointments"
					element={
						<ProtectedRoutes>
							<Appointments />
						</ProtectedRoutes>
					}
				/>
				<Route
					path="/logout"
					element={
						<ProtectedRoutes>
							<LogoutPage />
						</ProtectedRoutes>
					}
				/>

				{/* ADMIN PROTECTED ROUTES  */}
				<Route
					path="/admin/doctors"
					element={
						<ProtectedRoutes>
							<DoctorsPage />
						</ProtectedRoutes>
					}
				/>
				<Route
					path="/admin/users"
					element={
						<ProtectedRoutes>
							<UsersPage />
						</ProtectedRoutes>
					}
				/>

				{/* DOCTOR PROTECTED ROUTES  */}
				<Route
					path="/profile/:id"
					element={
						<ProtectedRoutes>
							<Profile />
						</ProtectedRoutes>
					}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
