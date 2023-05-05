import { configureStore } from '@reduxjs/toolkit'
import alertReducer from './features/alertSlice'
import authReducer from './features/authSlice'
import uiReducer from './features/uiSlice'
import adminReducer from './features/adminSlice'


export const store = configureStore({
    reducer: {
        alerts:alertReducer,
        auth:authReducer,
        ui:uiReducer,
        admin:adminReducer,
        
    },
})