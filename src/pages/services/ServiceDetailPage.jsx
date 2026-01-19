import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import {
  clearSelectedService,
  getServiceById,
} from "../../store/slices/servicesSlice";

const ServiceDetailPage = () => {
  const { serviceId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedService, loading } = useSelector((state) => state.Services);

console.log("selectedService", selectedService);

  useEffect(() => {
    if (serviceId) {
      dispatch(getServiceById(serviceId));
    }
    return () => {
      dispatch(clearSelectedService());
    };
  }, [dispatch, serviceId]);

  const headerButtons = [
    {
      value: "Back to Services",
      variant: "white",
      className:
        "border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-white",
      onClick: () => navigate(-1),
    },
    {
      value: "Edit Service",
      variant: "primary",
      className:
        "!bg-primary !text-white !border-primary hover:!bg-secondary hover:!border-secondary",
      onClick: () => navigate(`/service/${serviceId}/Edit`),
    },
  ];

  if (loading && !selectedService) {
    return (
      <div className="space-y-6">
        <PageHeader title="Service details" />
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="h-6 w-48 animate-pulse rounded bg-slate-100" />
          <div className="mt-4 h-4 w-32 animate-pulse rounded bg-slate-100" />
          <div className="mt-6 h-48 animate-pulse rounded-xl bg-slate-100" />
        </div>
      </div>
    );
  }

  if (!selectedService) {
    return (
      <div className="space-y-6">
        <PageHeader title="Service details" buttonsList={headerButtons} />
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
          Service not found.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={selectedService.title}
        description="Preview the full content for this Service."
        buttonsList={headerButtons}
      />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {selectedService.icon ? (
          <img
            src={selectedService.icon}
            alt={selectedService.title}
            className="h-64 w-full bg-black object-contain"
          />
        ) : (
          <div className="h-64 w-full flex items-center justify-center bg-slate-100 text-slate-400 text-sm">
            No image uploaded
          </div>
        )}

          {selectedService.excerpt && (
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
              <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
                Excerpt
              </p>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                {selectedService.excerpt}
              </p>
            </div>
          )}
        <div className="space-y-6 p-6">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: "Point Heading", value: selectedService.pointHeading },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-xl bg-slate-50 p-4 border border-slate-100"
              >
                <label htmlFor="label" className="font-semibold text-md">{item.label}</label>
                <p className="mt-1 text-sm text-slate-900 font-medium">
                  {item.value === false ? "No" : item.value === true ? "Yes" : item.value|| item.value || "N/A"}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
            <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
              Points
            </p>

            <div className="mt-2 space-y-1">
              {Array.isArray(selectedService.points) &&
              selectedService.points.length > 0 ? (
                selectedService.points.map((item, idx) => (
                  <div key={idx} className="flex gap-2 text-sm text-slate-900">
                    <span className="text-slate-400">•</span>
                    <span>{item}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-900 font-medium">N/A</p>
              )}
            </div>
          </div>


          <div className="rounded-xl p-5 border border-slate-100 bg-white shadow-inner">
            <p className="text-xs font-semibold uppercase text-slate-500 tracking-wide">
              Description
            </p>

            <div
              className="prose mt-3 max-w-none text-slate-700"
              dangerouslySetInnerHTML={{
                __html:
                  selectedService.description ||
                  "<p>No description provided.</p>",
              }}
            />
          </div>
          <div className="rounded-xl p-5 border border-slate-100 bg-white shadow-inner">
            <p className="text-xs font-semibold uppercase text-slate-500 tracking-wide">
              Description Bottom
            </p>

            <div
              className="prose mt-3 max-w-none text-slate-700"
              dangerouslySetInnerHTML={{
                __html:
                  selectedService.descriptionBottom ||
                  "<p>No description provided.</p>",
              }}
            />
          </div>
        
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
