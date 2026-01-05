import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BaseUrl } from '../../api/ApiUrl';
import { fetchSubscription } from './subscriptionSlice';
import { deleteProject } from './projectsSlice';

// Fetch bootstrap data
export const fetchBootstrapData = createAsyncThunk(
  'bootstrap/fetchData',
  async (makeAuthenticatedRequest, thunkAPI) => {
    try {
      const response = await makeAuthenticatedRequest(`${BaseUrl}/bootstrap`, {
        method: 'GET',
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update project name
export const updateProjectName = createAsyncThunk(
  'bootstrap/updateProjectName',
  async ({ projectId, projectname, makeAuthenticatedRequest }, thunkAPI) => {
    try {
      const response = await makeAuthenticatedRequest(`${BaseUrl}/project/${projectId}/settings/name`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({ projectname }),
      });
      return { id: projectId, projectname };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update project description
export const updateProjectDescription = createAsyncThunk(
  'bootstrap/updateProjectDescription',
  async ({ projectId, description, makeAuthenticatedRequest }, thunkAPI) => {
    try {
      const response = await makeAuthenticatedRequest(`${BaseUrl}/project/${projectId}/settings/description`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({ description: description }),
      });
      return { id: projectId, description };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update user full name
export const updateUserFullName = createAsyncThunk(
  'bootstrap/updateUserFullName',
  async ({ fullname, makeAuthenticatedRequest }, thunkAPI) => {
    try {
      const response = await makeAuthenticatedRequest(`${BaseUrl}/fullname`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({ fullname }),
      });
      return { fullname };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update user email
export const updateUserEmail = createAsyncThunk(
  'bootstrap/updateUserEmail',
  async ({ email, makeAuthenticatedRequest }, thunkAPI) => {
    try {
      const response = await makeAuthenticatedRequest(`${BaseUrl}/email`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({ email }),
      });
      return { email };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update user password
export const updateUserPassword = createAsyncThunk(
  'bootstrap/updateUserPassword',
  async ({ currentPassword, newPassword, makeAuthenticatedRequest }, thunkAPI) => {
    try {
      const response = await makeAuthenticatedRequest(`${BaseUrl}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({ currentPassword, newPassword }),
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const bootstrapSlice = createSlice({
  name: 'bootstrap',
  initialState: {
    profile: null,
    subscription: null,
    projects: [], 
    loading: false,
    error: null,
    fetchedOnce: false,
    updateLoading: false,
    updateError: null,
    updateSuccess: false,
  },
  reducers: {
    resetBootstrap: (state) => {
      state.profile = null;
      state.subscription = null;
      state.projects = [];
      state.loading = false;
      state.error = null;
      state.fetchedOnce = false;
      state.updateLoading = false;
      state.updateError = null;
      state.updateSuccess = false;
    },
    addProjectToBootstrap: (state, action) => {
      state.projects.push(action.payload);
    },
    removeProjectFromBootstrap: (state, action) => {
      state.projects = state.projects.filter((p) => p.id !== action.payload);
    },
    clearUpdateStatus: (state) => {
      state.updateError = null;
      state.updateSuccess = false;
      state.updateLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch bootstrap data
      .addCase(fetchBootstrapData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBootstrapData.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.profile;
        state.subscription = action.payload.subscription;
        state.projects = action.payload.projects; 
        state.fetchedOnce = true;
      })
      .addCase(fetchBootstrapData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch subscription
      .addCase(fetchSubscription.fulfilled, (state, action) => {
        state.subscription = action.payload;
      })
      
      // Update project name
      .addCase(updateProjectName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProjectName.fulfilled, (state, action) => {
        const { id, projectname } = action.payload;
        const projectIndex = state.projects.findIndex((p) => p.id === id);
        if (projectIndex !== -1) {
          state.projects[projectIndex].name = projectname;
        }
        state.loading = false;
      })
      .addCase(updateProjectName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update project description
      .addCase(updateProjectDescription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProjectDescription.fulfilled, (state, action) => {
        const { id, description } = action.payload;
        const projectIndex = state.projects.findIndex((p) => p.id === id);
        if (projectIndex !== -1) {
          state.projects[projectIndex].description = description;
        }
        state.loading = false;
      })
      .addCase(updateProjectDescription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update user full name
      .addCase(updateUserFullName.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateUserFullName.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;
        if (state.profile) {
          state.profile.name = action.payload.fullname;
        }
      })
      .addCase(updateUserFullName.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
        state.updateSuccess = false;
      })
      
      // Update user email
      .addCase(updateUserEmail.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateUserEmail.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;
        if (state.subscription) {
          state.subscription.email = action.payload.email;
        }
      })
      .addCase(updateUserEmail.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
        state.updateSuccess = false;
      })
      
      // Update user password
      .addCase(updateUserPassword.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateUserPassword.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;
      })
      .addCase(updateUserPassword.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
        state.updateSuccess = false;
      })
      
      // Delete project
      .addCase(deleteProject.fulfilled, (state, action) => {
        const projectId = action.payload.id;
        state.projects = state.projects.filter((p) => p.id !== projectId);
      });
  },
});

export const { 
  resetBootstrap, 
  addProjectToBootstrap, 
  removeProjectFromBootstrap,
  clearUpdateStatus 
} = bootstrapSlice.actions;

export default bootstrapSlice.reducer;