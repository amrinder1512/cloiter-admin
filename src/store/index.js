import { configureStore } from "@reduxjs/toolkit";
import user from "./slices/user";
import homePageReducer from "./slices/homepageSlice";
import faqReducer from "./slices/faq";
import ServiceSlice from "./slices/servicesSlice";
import footerReducer from "./slices/footerSlice";
import aboutReducer from "./slices/aboutPageSlice";
import contactReducer from "./slices/contactUsSlice";
import careerReducer from "./slices/careerPageSlice";
import jobsReducer from "./slices/jobsSlice";
import policyReducer from "./slices/policySlice";
import articlesReducer from "./slices/articlesSlice";

export default configureStore({
  reducer: {
    user,
    homepage: homePageReducer,
    faq: faqReducer,
    Services: ServiceSlice,
    footer: footerReducer,
    about: aboutReducer,
    contact: contactReducer,
    career: careerReducer,
    jobs: jobsReducer,
    policy: policyReducer,
    articles: articlesReducer,
  },
});
