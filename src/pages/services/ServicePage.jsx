import { useEffect, useState, useRef } from "react"; // 👈 Added useRef
import { useDispatch, useSelector } from "react-redux";
import { AiTwotoneEdit } from "react-icons/ai";
import { RiDeleteBin5Line } from "react-icons/ri";
import { LuFileUp, LuPlus } from "react-icons/lu";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

import PageHeader from "../../components/PageHeader";
import Pagination from "../../UI/pagination";

import {
  getServices,
  deleteService,
  createService,
  importServices,
} from "../../store/slices/servicesSlice";
import { ROUTES } from "../../consts/routes";
import { FaRegEye } from "react-icons/fa";

export const Service = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { Services, loading, error } = useSelector((state) => state.Services);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ServiceToDelete, setServiceToDelete] = useState(null);
  const [showUploadingFileLoader, setShowUploadingFileLoader] = useState(false);
  const [search, setSearch] = useState("");
  const [manualService, setManualService] = useState({
    name: "",
    slug: "",
    countyId: "",
    title: "",
    excerpt: "",
    description: "",
  });

  const [uploadFile, setUploadFile] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await dispatch(
          getServices({ page, limit, search })
        ).unwrap();
        setTotalPages(res.totalPages || 1);
      } catch (err) {
        console.error(err);
      }
    };
    fetchServices();
  }, [dispatch, page, limit, search]);

  const handleDeleteService = async () => {
    if (!ServiceToDelete) return;

    try {
      const res = await dispatch(deleteService(ServiceToDelete._id)).unwrap();
      toast.success(res.message || "Service deleted");
      setShowDeleteModal(false);
      dispatch(getServices({ page, limit }));
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const handleAddService = async () => {
    if (!manualService.name || !manualService.slug) {
      return toast.error("Fill required fields");
    }

    try {
      await dispatch(createService(manualService)).unwrap();
      toast.success("Service added");
      setShowAddModal(false);
      setManualService({

        title: "",
        excerpt: "",
        description: "",
      });
      dispatch(getServices({ page, limit }));
    } catch (err) {
      toast.error("Failed to add Service");
    }
  };



  const headerButtons = [
    {
      value: "Add Service",
      variant: "primary",
      icon: <LuPlus size={18} />,
      className:
        "!bg-primary  !text-white !border-primary hover:!bg-secondary hover:!border-secondary",
      onClick: () => navigate(ROUTES.SERVICES_CREATE),
    },
  ];

  const totalServices = Services?.data?.length || 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Services"
        description="Manage Services and related information."
        buttonsList={headerButtons}
      />

      <input
        ref={fileInputRef}
        id="Service-import-input"
        type="file"
        className="hidden"
        accept=".csv, .xlsx"
        onChange={(e) => {
          const selectedFile = e.target.files[0];

          if (selectedFile) {
            if (isValidFileExtension(selectedFile)) {
              setUploadFile(selectedFile);
            } else {
              toast.error(
                "Invalid file type. Only CSV (.csv) and Excel (.xlsx) files are allowed."
              );

              e.target.value = "";
              setUploadFile(null);
            }
          }
        }}
      />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 py-4">
          <div className="ml-4">
            <p className="text-sm font-semibold text-slate-900">
              Services overview
            </p>
            <p className="text-xs text-slate-500">
              {loading ? "Loading..." : `${totalServices} items`}
            </p>
          </div>
          <input
            type="text"
            placeholder="Search Services..."
            value={search}
            onChange={(e) => {
              setPage(1); // reset to first page
              setSearch(e.target.value);
            }}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-left text-[11px] font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Exerpt</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-600">
              {loading ? (
                [...Array(10)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {[...Array(10)].map((__, idx) => (
                      <td key={idx} className="px-6 py-6">
                        <div className="h-4 bg-slate-100 rounded"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td
                    className="px-6 py-6 text-center text-red-500"
                    colSpan="6"
                  >
                    {error}
                  </td>
                </tr>
              ) : totalServices > 0 ? (
                Services.data.map((Service, index) => (
                  <tr key={Service._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-500">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {Service.title}
                    </td>

                    <td className="px-6 py-4 truncate-2 break-words line-clamp-1">
                      {Service.excerpt?.replace(/<[^>]*>?/gm, "").replace(/&nbsp;/g, " ")}
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="line-clamp-1 text-slate-700 text-sm break-words">
                        {Service.description?.replace(/<[^>]*>?/gm, "").replace(/&nbsp;/g, " ")}
                      </div>
                    </td>



                    <td className="px-6 py-4 text-left">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="rounded-full border border-slate-200 p-2 text-slate-500 hover:text-slate-900"
                          onClick={() => navigate(`/service/${Service._id}`)}
                          title="Preview"
                        >
                          <FaRegEye size={16} />
                        </button>
                        <button
                          className="rounded-full border p-2 text-slate-500 hover:text-slate-900"
                          onClick={() =>
                            navigate(`/service/${Service._id}/Edit`)
                          }
                        >
                          <AiTwotoneEdit size={16} />
                        </button>
                        <button
                          className="rounded-full border border-red-200 p-2 text-red-500 hover:bg-red-50"
                          onClick={() => {
                            setServiceToDelete(Service);
                            setShowDeleteModal(true);
                          }}
                        >
                          <RiDeleteBin5Line size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-6 text-center text-slate-500"
                  >
                    No Services found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalServices > 0 && (
          <div className=" px-6 py-4">
            <Pagination totalPages={totalPages} page={page} setPage={setPage} />
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <p className="mb-6 text-center text-lg font-semibold">
              Are you sure you want to delete this Service?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="rounded-full border px-4 py-2"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-full bg-red-600 px-4 py-2 text-white"
                onClick={handleDeleteService}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Service;
