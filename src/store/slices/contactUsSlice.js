import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../services/axios";

export const getContactUsPage = createAsyncThunk(
    "contact/getContactUsPage",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/contact-page`);
            const data = response.data.data || response.data;
            return Array.isArray(data) ? data[0] : data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

export const updateContactUsPage = createAsyncThunk(
    "contact/updateContactUsPage",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/contact-page`, data);
            return response.data.data || response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

export const getContactLogs = createAsyncThunk(
    "contact/getContactLogs",
    async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/contact-us?page=${page}&limit=${limit}`);
            // If response has items (pagination), return full object
            if (response.items) {
                return response;
            }
            return response.data || response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

export const deleteContactLog = createAsyncThunk(
    "contact/deleteContactLog",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/contact/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

const contactUsSlice = createSlice({
    name: "contact",
    initialState: {
        contact: null,
        logs: [],
        pagination: {
            currentPage: 1,
            totalPages: 1,
            totalContacts: 0,
        },
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getContactUsPage.pending, (state) => {
                state.loading = true;
            })
            .addCase(getContactUsPage.fulfilled, (state, action) => {
                state.loading = false;
                state.contact = action.payload;
            })
            .addCase(getContactUsPage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateContactUsPage.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateContactUsPage.fulfilled, (state, action) => {
                state.loading = false;
                state.contact = action.payload;
            })
            .addCase(updateContactUsPage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getContactLogs.pending, (state) => {
                state.loading = true;
            })
            .addCase(getContactLogs.fulfilled, (state, action) => {
                state.loading = false;
                // Handle paginated response
                if (action.payload.items) {
                    state.logs = action.payload.items;
                    state.pagination = {
                        currentPage: action.payload.currentPage || 1,
                        totalPages: action.payload.totalPages || 1,
                        totalContacts: action.payload.totalContacts || 0,
                    };
                } else if (Array.isArray(action.payload)) {
                    // Fallback for non-paginated array response
                    state.logs = action.payload;
                } else {
                    state.logs = [];
                }
            })
            .addCase(getContactLogs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteContactLog.fulfilled, (state, action) => {
                state.logs = state.logs.filter((log) => log._id !== action.payload);
            });
    },
});

export default contactUsSlice.reducer;
