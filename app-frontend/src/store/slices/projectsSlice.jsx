// store/slices/projectsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BaseUrl } from '../../api/ApiUrl';
import { removeProjectFromBootstrap } from './bootstrapSlice';

export const createProject = createAsyncThunk(
  'projects/create',
  async ({ makeAuthenticatedRequest, data }, thunkAPI) => {
    try {
      const response = await makeAuthenticatedRequest(`${BaseUrl}/project`, {
        method: 'POST',
        data,
      });
      
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/delete',
  async ({ makeAuthenticatedRequest, projectId }, { dispatch }) => {
    try {
      const res = await makeAuthenticatedRequest(`${BaseUrl}/project/${projectId}`, {
        method: 'DELETE',
      });
      
      dispatch(removeProjectFromBootstrap(projectId));
      return { projectId, status: res.status }; 
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetProjects: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProject.fulfilled, (state, action) => {
        state.items.push(action.payload); // New project added
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      });
  },
});

export const { resetProjects } = projectsSlice.actions;
export default projectsSlice.reducer;