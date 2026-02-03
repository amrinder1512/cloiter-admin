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
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/job-applications`);
            return response.data.data || response.data;
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
                state.applications = action.payload;
            })
            .addCase(getJobApplications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default jobsSlice.reducer;
