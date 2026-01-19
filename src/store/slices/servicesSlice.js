import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
const IMAGE_URL = import.meta.env.VITE_API_URL_IMAGE;

const fixImageUrl = (url) => {
  if (!url) return null;
  return url.startsWith("http") ? url : `${IMAGE_URL}${url}`;
};

export const getServices = createAsyncThunk(
  "Services/getServices",
  async ({ page = 1, limit = 10, search = "" } = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        `/services?page=${page}&limit=${limit}&search=${search}`
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getServicesAll = createAsyncThunk(
  "Services/getServicesAll",
  async ({ search = "" } = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/services/all?search=${search}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getServiceById = createAsyncThunk(
  "Services/getServiceById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/services/detail/${id}`);
      // return data;
      return {
        ...res.data.data,
        icon: fixImageUrl(res.data.data.icon),
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createService = createAsyncThunk(
  "Services/createService",
  async (ServiceData, { rejectWithValue }) => {
    try {
      console.log(ServiceData);
      const { data } = await api.post("/services/create", ServiceData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateService = createAsyncThunk(
  "Services/updateService",
  async ({ id, ServiceData }, { rejectWithValue }) => {
    try {
      console.log("ServiceData:", ServiceData);
      const { data } = await api.put(`/services/update/${id}`, ServiceData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteService = createAsyncThunk(
  "Services/deleteService",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/services/delete/${id}`);
      return { id, message: data.message };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const importServices = createAsyncThunk(
  "Services/importServices",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/upload/csv-Services", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const ServiceSlice = createSlice({
  name: "Services",
  initialState: {
    Services: { data: [], pagination: {} },
    selectedService: null,
    allServices: [],

    loading: false,
    error: null,
  },

  reducers: {
    clearSelectedService: (state) => {
      state.selectedService = null;
    },
    clearError: (state) => {
      state.error = null;
    },

    setServices: (state, action) => {
      state.Services = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getServices.fulfilled, (state, action) => {
        state.loading = false;
        state.Services = action.payload;
      })
      .addCase(getServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch Services";
      })
      .addCase(getServicesAll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getServicesAll.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allServices = action.payload.data;
      })

      .addCase(getServicesAll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload || "Failed to fetch all Services");
      })
      .addCase(getServiceById.fulfilled, (state, action) => {
        state.selectedService = action.payload.data || action.payload;
      })

      .addCase(createService.pending, (state) => {
        state.loading = true;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.loading = false;
        state.Services.data = [
          ...(state.Services.data || []),
          action.payload.data || action.payload,
        ];
      })
      .addCase(createService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create Service";
      })

      .addCase(updateService.fulfilled, (state, action) => {
        const updatedService = action.payload.data;

        if (!updatedService?._id) return;

        const index = state.Services.data.findIndex(
          (c) => c._id === updatedService._id
        );

        if (index !== -1) {
          state.Services.data[index] = updatedService;
        }

        if (state.selectedService?._id === updatedService._id) {
          state.selectedService = updatedService;
        }
      })

      .addCase(deleteService.fulfilled, (state, action) => {
        state.loading = false;

        state.Services.data = state.Services.data.filter(
          (c) => c._id !== action.payload.id
        );

        if (
          state.selectedService &&
          state.selectedService._id === action.payload.id
        ) {
          state.selectedService = null;
        }
      })

      .addCase(importServices.pending, (state) => {
        state.loading = true;
      })
      .addCase(importServices.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(importServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to import Services";
      })

      .addMatcher(
        (action) =>
          [
            createService.pending,
            updateService.pending,
            deleteService.pending,
          ].includes(action.type),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          [
            createService.rejected,
            updateService.rejected,
            deleteService.rejected,
          ].includes(action.type),
        (state, action) => {
          state.loading = false;
          state.error = action.payload?.message || "An action failed";
        }
      );
  },
});

export const { clearSelectedService, clearError, setServices } =
  ServiceSlice.actions;

export default ServiceSlice.reducer;
