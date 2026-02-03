import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../services/axios";

export const getAboutPage = createAsyncThunk(
    "about/getAboutPage",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/about-page`);
            const data = response.data.data || response.data;
            return Array.isArray(data) ? data[0] : data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

export const updateAboutPage = createAsyncThunk(
    "about/updateAboutPage",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/about-page`, data);
            return response.data.data || response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

const aboutPageSlice = createSlice({
    name: "about",
    initialState: {
        about: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAboutPage.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAboutPage.fulfilled, (state, action) => {
                state.loading = false;
                state.about = action.payload;
            })
            .addCase(getAboutPage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateAboutPage.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateAboutPage.fulfilled, (state, action) => {
                state.loading = false;
                state.about = action.payload;
            })
            .addCase(updateAboutPage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default aboutPageSlice.reducer;
