import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../services/axios";

export const getCareerPage = createAsyncThunk(
    "career/getCareerPage",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/career`);
            return response.data.data || response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

export const updateCareerPage = createAsyncThunk(
    "career/updateCareerPage",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/career`, data);
            return response.data.data || response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

const careerPageSlice = createSlice({
    name: "career",
    initialState: {
        career: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCareerPage.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCareerPage.fulfilled, (state, action) => {
                state.loading = false;
                state.career = action.payload;
            })
            .addCase(getCareerPage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateCareerPage.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateCareerPage.fulfilled, (state, action) => {
                state.loading = false;
                state.career = action.payload;
            })
            .addCase(updateCareerPage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default careerPageSlice.reducer;
