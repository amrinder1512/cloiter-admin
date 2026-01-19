import { configureStore } from "@reduxjs/toolkit";
import user from "./slices/user";
import homePageReducer from "./slices/homepageSlice";
import faqReducer from "./slices/faq";
import ServiceSlice from "./slices/servicesSlice"
import footerReducer from "./slices/footerSlice";

export default configureStore({
  reducer: {
    user,
    homepage: homePageReducer,
    faq: faqReducer,
    Services: ServiceSlice,
    footer: footerReducer,
 
  },
});
