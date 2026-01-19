import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axios from "../../services/axios";

const initialState = {
  is_loading: false,
  errors: null,
  sections: {
    heroSection: null,
    trustedByData: null,          // ✅ ADDED
    processData: null,
    webFeature: null,
    services: null,
    statsFeature: null,
    threePillarsSection: [],
    testimonials: null,
  },
};

export const homepageSlice = createSlice({
  name: "homepage",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.is_loading = action.payload;
    },
    setErrors: (state, action) => {
      state.errors = action.payload;
    },
    clearMessages: (state) => {
      state.errors = null;
    },
    setSectionData: (state, action) => {
      const { sectionKey, data } = action.payload;
      state.sections[sectionKey] = data;
    },
  },
});

export const {
  setLoading,
  setErrors,
  clearMessages,
  setSectionData,
} = homepageSlice.actions;

// ✅ Slug → Redux key mapping (MATCHES BACKEND ROUTES)
const slugToKey = {
  "hero": "heroSection",
  "trusted-by": "trustedByData",      // ✅ ADDED
  "process": "processData",
  "web-feature": "webFeature",
  "services-header": "services",
  "stats-feature": "statsFeature",
  "pillars": "threePillarsSection",
  "testimonials": "testimonials",
};

export const fetchHomepageSection = (slug) => async (dispatch) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/homepage/${slug}`
    );

    dispatch(
      setSectionData({
        sectionKey: slugToKey[slug],
        data: res?.data?.data || res?.data,
      })
    );
  } catch (error) {
    console.error(`Error fetching ${slug}:`, error);
  }
};

export const fetchAllHomepageSections = () => async (dispatch) => {
  dispatch(setLoading(true));
  const slugs = Object.keys(slugToKey);

  try {
    await Promise.all(slugs.map((slug) => dispatch(fetchHomepageSection(slug))));
  } catch (error) {
    dispatch(setErrors(error));
  } finally {
    dispatch(setLoading(false));
  }
};

export const updateHomepageSection = (slug, body) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await axios.put(
      `${import.meta.env.VITE_API_URL}/homepage/${slug}`,
      body
    );

    toast.success(res?.data?.message || "Updated successfully");
    dispatch(fetchHomepageSection(slug));
  } catch (error) {
    toast.error(error?.response?.data?.message || "Update failed");
  } finally {
    dispatch(setLoading(false));
  }
};

export default homepageSlice.reducer;
