/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { Route, Routes as RouteWrapper, useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import Layout from "../layouts/Layout";
import { ROUTES } from "../consts/routes";
import LoginForm from "../components/LoginForm";
import { useSelector } from "react-redux";
import Settings from "../pages/settings/Settings";
import Faq from "../pages/helpcenter/Faq";
import HomePage from "../pages/homepage/homepage";
import Service from "../pages/services/ServicePage";
import ServiceDetailPage from "../pages/services/ServiceDetailPage";
import ServiceFormPage from "../pages/services/ServiceFormPage";
import FooterListPage from "../pages/footer/FooterListPage";
import CreateFooterItemPage from "../pages/footer/CreateFooterItemPage";
import CreateFooterArticlePage from "../pages/footer/CreateFooterArticlePage";
import EditFooterItemPage from "../pages/footer/EditFooterItemPage";
import AddFaq from "../pages/helpcenter/AddFaq";
import EditFaq from "../pages/helpcenter/EditFaq";

import Dashboard from "../pages/dashboard/dashboard";


const Routes = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user);

  useEffect(() => {
    if (!token && window.location.pathname !== "/login") {
      navigate("/login");
    }

    if (token && window.location.pathname === "/login") {
      navigate("/homepage", { replace: true });
    }
  }, [token, navigate]);

  useEffect(() => {
    if (token && window.location.pathname === "/") {
      navigate("/homepage");
    }
  }, [token, navigate]);
  return (
    <RouteWrapper>
      <Route element={token ? <Layout /> : <AuthLayout />}>


        <Route path={ROUTES.HOMEPAGE} element={<HomePage />} />

        <Route path={ROUTES.FAQ} element={<Faq />} />

        <Route path="/faqs/add" element={<AddFaq />} />
        <Route path="/faqs/edit/:id" element={<EditFaq />} />

        <Route path={ROUTES.SERVICES} element={<Service />} />
        <Route path={ROUTES.SERVICES_CREATE} element={<ServiceFormPage />} />
        <Route path={ROUTES.SERVICES_VIEW} element={<ServiceDetailPage />} />
        <Route path={ROUTES.SERVICES_EDIT} element={<ServiceFormPage />} />

        <Route path={ROUTES.LOGIN} element={<LoginForm />} />
        <Route path={ROUTES.FOOTER} element={<FooterListPage />} />
        <Route path={ROUTES.FOOTER_CREATE} element={<CreateFooterItemPage />} />
        <Route
          path={ROUTES.FOOTER_VIEW}
          element={<CreateFooterArticlePage />}
        />
        <Route path={ROUTES.FOOTER_EDIT} element={<EditFooterItemPage />} />
        <Route path={ROUTES.FOOTER_EDIT_FOR_HEADER_AND_ADDRESS} element={<EditFooterItemPage />} />
        <Route path={ROUTES.HOME} element={<Dashboard />} />
        <Route path={ROUTES.SETTINGS} element={<Settings />} />
      </Route>
    </RouteWrapper>
  );
};

export default Routes;
