import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../services/axios";

// --- Jobs Thunks ---
export const getJobs = createAsyncThunk(
    "jobs/getJobs",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/career/jobs`);
            return response.data.data || response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

export const createJob = createAsyncThunk(
    "jobs/createJob",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/career/jobs`, data);
            return response.data.data || response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

export const updateJob = createAsyncThunk(
    "jobs/updateJob",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/career/jobs/${id}`, data);
            return response.data.data || response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

export const deleteJob = createAsyncThunk(
    "jobs/deleteJob",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/career/jobs/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

// --- Applications Thunks ---
export const getJobApplications = createAsyncThunk(
    "jobs/getJobApplications",
    async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/job-application?page=${page}&limit=${limit}`);
            // The axios interceptor returns response.data, so 'response' here IS the body.
            // If the body has { items: [...] }, it also has pagination metadata, so return the whole object.
            if (response.items) {
                return response;
            }
            return response.data || response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

const jobsSlice = createSlice({
    name: "jobs",
    initialState: {
        jobs: [],
        applications: [],
        pagination: {
            currentPage: 1,
            totalPages: 1,
            totalApplications: 0,
        },
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Get Jobs
            .addCase(getJobs.pending, (state) => {
                state.loading = true;
            })
            .addCase(getJobs.fulfilled, (state, action) => {
                state.loading = false;
                state.jobs = action.payload;
            })
            .addCase(getJobs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create Job
            .addCase(createJob.fulfilled, (state, action) => {
                state.jobs.push(action.payload);
            })
            // Update Job
            .addCase(updateJob.fulfilled, (state, action) => {
                const index = state.jobs.findIndex((job) => job._id === action.payload._id);
                if (index !== -1) {
                    state.jobs[index] = action.payload;
                }
            })
            // Delete Job
            .addCase(deleteJob.fulfilled, (state, action) => {
                state.jobs = state.jobs.filter((job) => job._id !== action.payload);
            })
            // Get Applications
            .addCase(getJobApplications.pending, (state) => {
                state.loading = true;
            })
            .addCase(getJobApplications.fulfilled, (state, action) => {
                state.loading = false;
                // If payload has items (server-side pagination response)
                if (action.payload.items) {
                    state.applications = action.payload.items;
                    state.pagination = {
                        currentPage: action.payload.currentPage || 1,
                        totalPages: action.payload.totalPages || 1,
                        totalApplications: action.payload.totalApplications || 0,
                    };
                } else if (Array.isArray(action.payload)) {
                    // Fallback for array response
                    state.applications = action.payload;
                } else {
                    // Fallback if structure is unknown but not array
                    state.applications = [];
                }
            })
            .addCase(getJobApplications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default jobsSlice.reducer;
