import { combineReducers } from "@reduxjs/toolkit";
import test from "../features/userSlice";


const rootReducer = combineReducers({
    user: test.reducer,
})

export default rootReducer;