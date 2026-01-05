import { configureStore } from '@reduxjs/toolkit';
import subscriptionReducer from './slices/subscriptionSlice';
import bootstrapReducer  from './slices/bootstrapSlice'
import projectReducer from './slices/projectsSlice'
import projectdataReducer from './slices/projectdataSlice'

const store = configureStore({
  reducer: {
    bootstrap: bootstrapReducer,
    project: projectReducer,
    projectdata: projectdataReducer
  },
});

export default store;
