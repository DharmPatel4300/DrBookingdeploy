import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    jwt: localStorage.getItem("jwt"),
    user:null,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginUser:(state,actions)=>{
            state.jwt = actions.payload.jwt;
            state.user = actions.payload.user;
        },
        auhtenticateOrUpdateUser: (state,actions) => {
            state.jwt = state.jwt;
            state.user = actions.payload.user;
        },
        logOutUser: (state) => {
            state.jwt = null
            state.user = null
        },
    },
})

// Action creators are generated for each case reducer function
export const { auhtenticateOrUpdateUser, logOutUser, loginUser } = authSlice.actions

export default authSlice.reducer