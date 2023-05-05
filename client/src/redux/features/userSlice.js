import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    profile: null,
    users: [],
    doctors: [],
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUsers: (state, actions) => {
            state.users = actions.payload.users;
            state.profile = state.profile;
            state.doctors = state.doctors;
        },
        setDoctors: (state, actions) => {
            state.doctors = actions.payload.doctors;
            state.users = state.users;
            state.profile = state.profile;
        },
        setProfile: (state, actions) => {
            state.profile = { ...state.profile, ...actions.payload };
            state.doctors = state.doctors;
            state.users = state.users;
        },
    },
})

// Action creators are generated for each case reducer function
export const { setUsers, setDoctors, setProfile } = userSlice.actions

export default userSlice.reducer