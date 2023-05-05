import { createSlice } from '@reduxjs/toolkit'

//
const initialState = {
    isSidebar: false,
}

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        showSidebar: (state) => {
            state.isSidebar = true;
        },
        hideSidebar: (state) => {
            state.isSidebar = false;
        },
        
    },
})

// Action creators are generated for each case reducer function
export const { showSidebar, hideSidebar } = uiSlice.actions

export default uiSlice.reducer