import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    loading: false,
}

export const alertSlice = createSlice({
    name: 'alerts',
    initialState,
    reducers: {
        showLoading: (state) => {
            state.loading = true;
        },
        hideLoading: (state) => {
            state.loading = false
        },
    },
})

// Action creators are generated for each case reducer function
export const { showLoading, hideLoading } = alertSlice.actions

export default alertSlice.reducer