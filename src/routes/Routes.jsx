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
import AboutPage from "../pages/about/AboutPage";
import ContactUsPage from "../pages/contact/ContactUsPage";
import CareersPage from "../pages/careers/CareersPage";
import JobsPage from "../pages/jobs/JobsPage";
import JobApplicationsPage from "../pages/jobs/JobApplicationsPage";
import PrivacyPolicyPage from "../pages/policies/PrivacyPolicyPage";
import TermsPage from "../pages/policies/TermsPage";
import ArticleListPage from "../pages/articles/ArticleListPage";
import ArticleFormPage from "../pages/articles/ArticleFormPage";
import ContactLogsPage from "../pages/contact/ContactLogsPage";
// import ArticleCategoryPage from "../pages/articles/ArticleCategoryPage";

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
        <Route path={ROUTES.ABOUT} element={<AboutPage />} />
        <Route path={ROUTES.CONTACT_US} element={<ContactUsPage />} />
        <Route path={ROUTES.CAREER} element={<CareersPage />} />
        <Route path={ROUTES.JOBS} element={<JobsPage />} />
        <Route path={ROUTES.JOB_APPLICATIONS} element={<JobApplicationsPage />} />
        <Route path={ROUTES.PRIVACY_POLICY} element={<PrivacyPolicyPage />} />
        <Route path={ROUTES.TERM_OF_SERVICE} element={<TermsPage />} />
        <Route path={ROUTES.ARTICLE} element={<ArticleListPage />} />
        <Route path={ROUTES.ARTICLE_CREATE} element={<ArticleFormPage />} />
        <Route path={ROUTES.ARTICLE_EDIT} element={<ArticleFormPage />} />
        <Route path={ROUTES.CONTACTUS} element={<ContactLogsPage />} />
      </Route>
    </RouteWrapper>
  );
};

export default Routes;
