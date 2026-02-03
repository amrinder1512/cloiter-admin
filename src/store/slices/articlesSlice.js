import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../services/axios";

// --- Articles Thunks ---
export const getArticles = createAsyncThunk(
    "articles/getArticles",
    async ({ search = '' } = {}, { rejectWithValue }) => {
        try {
            const query = search ? `?search=${search}` : '';
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/article${query}`);
            return response.data.data || response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

export const createArticle = createAsyncThunk(
    "articles/createArticle",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/article`, data);
            return response.data.data || response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

export const updateArticle = createAsyncThunk(
    "articles/updateArticle",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/article/${id}`, data);
            return response.data.data || response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

export const deleteArticle = createAsyncThunk(
    "articles/deleteArticle",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/article/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

const articlesSlice = createSlice({
    name: "articles",
    initialState: {
        articles: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Articles
            .addCase(getArticles.pending, (state) => { state.loading = true; })
            .addCase(getArticles.fulfilled, (state, action) => {
                state.loading = false;
                state.articles = action.payload;
            })
            .addCase(getArticles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteArticle.fulfilled, (state, action) => {
                state.articles = state.articles.filter(a => a._id !== action.payload);
            });
    },
});

export default articlesSlice.reducer;
