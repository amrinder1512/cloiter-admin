import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../services/axios";

export const getPrivacyPolicy = createAsyncThunk(
    "policy/getPrivacyPolicy",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/privacy-policy`);
            const data = response.data.data || response.data;
            return Array.isArray(data) ? data[0] : data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

export const updatePrivacyPolicy = createAsyncThunk(
    "policy/updatePrivacyPolicy",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/privacy-policy`, data);
            return response.data.data || response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

export const getTermsOfService = createAsyncThunk(
    "policy/getTermsOfService",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/terms-and-conditions`);
            const data = response.data.data || response.data;
            return Array.isArray(data) ? data[0] : data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

export const updateTermsOfService = createAsyncThunk(
    "policy/updateTermsOfService",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/terms-and-conditions`, data);
            return response.data.data || response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

const policySlice = createSlice({
    name: "policy",
    initialState: {
        privacy: null,
        terms: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Privacy Policy
            .addCase(getPrivacyPolicy.pending, (state) => { state.loading = true; })
            .addCase(getPrivacyPolicy.fulfilled, (state, action) => {
                state.loading = false;
                state.privacy = action.payload;
            })
            .addCase(getPrivacyPolicy.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updatePrivacyPolicy.fulfilled, (state, action) => {
                state.privacy = action.payload;
            })
            // Terms of Service
            .addCase(getTermsOfService.pending, (state) => { state.loading = true; })
            .addCase(getTermsOfService.fulfilled, (state, action) => {
                state.loading = false;
                state.terms = action.payload;
            })
            .addCase(getTermsOfService.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateTermsOfService.fulfilled, (state, action) => {
                state.terms = action.payload;
            });
    },
});

export default policySlice.reducer;
