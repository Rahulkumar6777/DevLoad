import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BaseUrl } from "../../api/ApiUrl";

// Fetch project data
export const fetchProjectData = createAsyncThunk(
  "projectdata/fetchProjectData",
  async ({ projectId, makeAuthenticatedRequest }, { rejectWithValue }) => {
    try {
      const res = await makeAuthenticatedRequest(`${BaseUrl}/project/${projectId}`, {
        method: "GET",
      });
      return { projectId, data: res.data };
    } catch (err) {
      return rejectWithValue({ projectId, error: err.response.data?.message || err.response.data?.error });
    }
  }
);

// Update MIME type (filetype)
export const updateFileType = createAsyncThunk(
  "projectdata/updateFileType",
  async ({ projectId, type, state, makeAuthenticatedRequest }, { rejectWithValue }) => {
    try {
      const res = await makeAuthenticatedRequest(
        `${BaseUrl}/project/${projectId}/settings/filetype?${type}=${state}`,
        { method: "PUT" }
      );
      return { projectId, type, state: state === "on" };
    } catch (err) {
      return rejectWithValue({ projectId, error: err.response.data?.message || err.response.data?.error });
    }
  }
);

// Update project name
export const updateProjectName = createAsyncThunk(
  "projectdata/updateProjectName",
  async ({ projectId, projectname, makeAuthenticatedRequest }, { rejectWithValue }) => {
    try {
      const res = await makeAuthenticatedRequest(
        `${BaseUrl}/project/${projectId}/settings/name`,
        {
          method: "PUT",
          data: JSON.stringify({ projectname }),
          headers: { "Content-Type": "application/json" },
        }
      );
      return { projectId, projectname };
    } catch (err) {
      return rejectWithValue({ projectId, error: err.response.data?.message || err.response.data?.error });
    }
  }
);

// Update project description
export const updateProjectDescription = createAsyncThunk(
  "projectdata/updateProjectDescription",
  async ({ projectId, description, makeAuthenticatedRequest }, { rejectWithValue }) => {
    try {
      const res = await makeAuthenticatedRequest(
        `${BaseUrl}/project/${projectId}/settings/description`,
        {
          method: "PUT",
          data: JSON.stringify({ description }),
          headers: { "Content-Type": "application/json" },
        }
      );
      return { projectId, description };
    } catch (err) {
      return rejectWithValue({ projectId, error: err.response.data?.message || err.response.data?.error, });
    }
  }
);


export const updateProjectStorage = createAsyncThunk(
  "projectdata/updateProjectStorage",
  async ({ projectId, storage, makeAuthenticatedRequest }, { rejectWithValue }) => {
    try {
      const res = await makeAuthenticatedRequest(
        `${BaseUrl}/project/${projectId}/settings/storage`,
        {
          method: "PUT",
          data: JSON.stringify({ storage }),
          headers: { "Content-Type": "application/json" },
        }
      );
      return { projectId, storage };
    } catch (err) {
      return rejectWithValue({ projectId, error: err.response.data?.message || err.response.data?.error });
    }
  }
);


export const addDomain = createAsyncThunk(
  "projectdata/addDomain",
  async ({ projectId, domain, makeAuthenticatedRequest }, { rejectWithValue }) => {
    try {
      await makeAuthenticatedRequest(
        `${BaseUrl}/project/${projectId}/domain`,
        {
          method: "POST",
          data: JSON.stringify({ domains: [domain] }),
          headers: { "Content-Type": "application/json" },
        }
      );
      return { projectId, domain };
    } catch (err) {
      return rejectWithValue({ projectId, error: err.response.data?.message || err.response.data?.error });
    }
  }
);

export const deleteDomain = createAsyncThunk(
  "projectdata/deleteDomain",
  async ({ projectId, domain, makeAuthenticatedRequest }, { rejectWithValue }) => {
    try {
      await makeAuthenticatedRequest(
        `${BaseUrl}/project/${projectId}/domain`,
        {
          method: "DELETE",
          data: JSON.stringify({ domains: [domain] }),
          headers: { "Content-Type": "application/json" },
        }
      );
      return { projectId, domain };
    } catch (err) {
      return rejectWithValue({ projectId, error: err.response.data?.message || err.response.data?.error });
    }
  }
);



export const updateProcessingSettings = createAsyncThunk(
  'projectdata/updateProcessingSettings',
  async ({ projectId, settings, makeAuthenticatedRequest }, { rejectWithValue }) => {
    try {
      const response = await makeAuthenticatedRequest(`${BaseUrl}/project/${projectId}/settings/processing`, {
        method: 'PATCH',
        data: settings
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const projectdataSlice = createSlice({
  name: "projectdata",
  initialState: {},
  reducers: {
    
    addFile: (state, action) => {
      const { projectId, file } = action.payload;
      if (!state[projectId]) {
        state[projectId] = { files: [], settings: { uploading: { filetype: [] } } };
      }
      state[projectId].files = [...(state[projectId].files || []), file];
    },
   
    removeFile: (state, action) => {
      const { projectId, fileId } = action.payload;
      if (state[projectId] && state[projectId].files) {
        state[projectId].files = state[projectId].files.filter(
          (file) => file.fileid !== fileId
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProcessingSettings.fulfilled, (state, action) => {
        const { projectId, processing } = action.payload;
        if (state[projectId]) {
          state[projectId].settings.processing = processing;
        }
      })
      .addCase(fetchProjectData.pending, (state, action) => {
        const pid = action.meta.arg.projectId;
        if (!state[pid]) state[pid] = {};
        state[pid].loading = true;
        state[pid].error = null;
      })
      .addCase(fetchProjectData.fulfilled, (state, action) => {
        const { projectId, data } = action.payload;
        state[projectId] = {
          ...data,
          loading: false,
          error: null,
          fetchedOnce: true,
        };
      })
      .addCase(fetchProjectData.rejected, (state, action) => {
        const { projectId, error } = action.payload || {};
        if (!projectId) return;
        if (!state[projectId]) state[projectId] = {};
        state[projectId].loading = false;
        state[projectId].error = error;
        state[projectId].fetchedOnce = false;
      })
      // Update File Type
      .addCase(updateFileType.pending, (state, action) => {
        const pid = action.meta.arg.projectId;
        if (!state[pid]) state[pid] = {};
        state[pid].loading = true;
        state[pid].error = null;
      })
      .addCase(updateFileType.fulfilled, (state, action) => {
        const { projectId, type, state: newState } = action.payload;
        if (!state[projectId]) state[projectId] = { settings: { uploading: { filetype: [] } } };
        const currentFileTypes = state[projectId].settings.uploading.filetype || [];
        if (newState && !currentFileTypes.includes(type)) {
          state[projectId].settings.uploading.filetype = [...currentFileTypes, type];
        } else if (!newState && currentFileTypes.includes(type)) {
          state[projectId].settings.uploading.filetype = currentFileTypes.filter((t) => t !== type);
        }
        state[projectId].loading = false;
        state[projectId].error = null;
      })
      .addCase(updateFileType.rejected, (state, action) => {
        const { projectId, error } = action.payload || {};
        if (!projectId) return;
        if (!state[projectId]) state[projectId] = {};
        state[projectId].loading = false;
        state[projectId].error = error;
      })
      // Update Project Name
      .addCase(updateProjectName.fulfilled, (state, action) => {
        const { projectId, projectname } = action.payload;
        if (!state[projectId]) state[projectId] = { settings: { project: {} } };
        state[projectId].settings.project.projectname = projectname;
        state[projectId].loading = false;
        state[projectId].error = null;
      })
      .addCase(updateProjectName.rejected, (state, action) => {
        const { projectId, error } = action.payload || {};
        if (!projectId) return;
        if (!state[projectId]) state[projectId] = {};
        state[projectId].loading = false;
        state[projectId].error = error;
      })
      // Update Project Description
      .addCase(updateProjectDescription.fulfilled, (state, action) => {
        const { projectId, description } = action.payload;
        if (!state[projectId]) state[projectId] = { settings: { project: {} } };
        state[projectId].settings.project.projectdescription = description;
        state[projectId].loading = false;
        state[projectId].error = null;
      })
      .addCase(updateProjectDescription.rejected, (state, action) => {
        const { projectId, error } = action.payload || {};
        if (!projectId) return;
        if (!state[projectId]) state[projectId] = {};
        state[projectId].loading = false;
        state[projectId].error = error;
      })
      // Update Project Storage
      .addCase(updateProjectStorage.fulfilled, (state, action) => {
        const { projectId, storage } = action.payload;
        if (!state[projectId]) state[projectId] = { settings: { project: {} } };
        state[projectId].settings.project.maxstorage = storage;
        state[projectId].loading = false;
        state[projectId].error = null;
      })
      .addCase(updateProjectStorage.rejected, (state, action) => {
        const { projectId, error } = action.payload || {};
        if (!projectId) return;
        if (!state[projectId]) state[projectId] = {};
        state[projectId].loading = false;
        state[projectId].error = error;
      })

      .addCase(addDomain.pending, (state, action) => {
        const pid = action.meta.arg.projectId;
        if (!state[pid]) state[pid] = { settings: { project: {} } };
        state[pid].domainLoading = true;
      })
      .addCase(addDomain.fulfilled, (state, action) => {
        const { projectId, domain } = action.payload;
        if (!state[projectId]) state[projectId] = { settings: { project: {} } };

        // Initialize if doesn't exist
        if (!state[projectId].settings.project.alloweddomain) {
          state[projectId].settings.project.alloweddomain = [];
        }

        // Add domain if not already present
        if (!state[projectId].settings.project.alloweddomain.includes(domain)) {
          state[projectId].settings.project.alloweddomain.push(domain);
        }

        state[projectId].domainLoading = false;
      })

      .addCase(addDomain.rejected, (state, action) => {
        const pid = action.meta.arg.projectId;
        if (state[pid]) {
          state[pid].domainLoading = false;
          state[pid].error = "invalid Domain name";
        }
      })
      .addCase(deleteDomain.pending, (state, action) => {
        const pid = action.meta.arg.projectId;
        if (state[pid]) state[pid].domainLoading = true;
      })
      .addCase(deleteDomain.fulfilled, (state, action) => {
        const { projectId, domain } = action.payload;
        if (state[projectId] && state[projectId].settings.project.alloweddomain) {
          state[projectId].settings.project.alloweddomain =
            state[projectId].settings.project.alloweddomain.filter(d => d !== domain);
        }
        state[projectId].domainLoading = false;
      })
      .addCase(deleteDomain.rejected, (state, action) => {
        const pid = action.meta.arg.projectId;
        if (state[pid]) {
          state[pid].domainLoading = false;
          state[pid].error = action.payload?.error || "Failed to delete domain";
        }
      });
  },
});

// Export actions
export const { addFile, removeFile } = projectdataSlice.actions;

export default projectdataSlice.reducer;