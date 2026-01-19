import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { RiDeleteBin5Line } from "react-icons/ri";
import {
  clearSelectedService,
  createService,
  getServiceById,
  updateService,
} from "../../store/slices/servicesSlice";
import { uploadImage } from "../../store/slices/imageUpload";
import { toast } from "react-toastify";
import ImageUploader from "../../UI/ImageUpload";

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
    [{ align: [] }],
    ["link", "image"],
    ["clean"],
  ],
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "blockquote",
  "code-block",
  "align",
  "link",
  "image",
];

const requiredFields = [
  "title",
  "excerpt",
  "pointHeading",
  "description",
  "icon"
];

const ServiceFormPage = () => {
  const { serviceId } = useParams();
  const isEditMode = Boolean(serviceId);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedService } = useSelector((state) => state.Services || {});

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    pointHeading: "",
    description: "",
    descriptionBottom: "",
    icon: "",
    points: [],
  });

  const [previewImage, setPreviewImage] = useState("");
  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode && serviceId) {
      dispatch(getServiceById(serviceId));
    } else {
      dispatch(clearSelectedService());
    }
    return () => {
      dispatch(clearSelectedService());
    };
  }, [dispatch, isEditMode, serviceId]);

  useEffect(() => {
    if (isEditMode && selectedService) {
      setForm({
        title: selectedService.title || "",
        excerpt: selectedService.excerpt || "",
        pointHeading: selectedService.pointHeading || "",
        description: selectedService.description || "",
        descriptionBottom: selectedService.descriptionBottom || "",
        icon: selectedService.icon || "",
        points: Array.isArray(selectedService.points) ? selectedService.points : [],
      });
      setPreviewImage(selectedService.icon || "");
    }
  }, [isEditMode, selectedService]);

  const validateField = (name, value) => {
    let message = "";
    if (requiredFields.includes(name)) {
      if (!value || !String(value).trim()) {
        message = `${labelFor(name)} is required`;
      }
    }
    setErrors((prev) => ({ ...prev, [name]: message }));
    return message === "";
  };

  const validateAll = () => {
    const newErrors = {};
    requiredFields.forEach((f) => {
      const v = form[f];
      if (!v || !String(v).trim()) newErrors[f] = `${labelFor(f)} is required`;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  function labelFor(name) {
    const map = {
      Title: "title",

     
    };
    return map[name] || name;
  }

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;

    const newValue = type === "checkbox" ? checked : value;

    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    validateField(name, newValue);
  };

  const handlePointChange = (index, value) => {
    setForm((prev) => ({
      ...prev,
      points: prev.points.map((point, i) => (i === index ? value : point)),
    }));
  };

  const addPoint = () => {
    setForm((prev) => ({
      ...prev,
      points: [...prev.points, ""],
    }));
  };

  const removePoint = (index) => {
    setForm((prev) => ({
      ...prev,
      points: prev.points.filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "image/x-icon",
    ];
    if (!allowed.includes(file.type)) {
      toast.error("Invalid file type. Please upload an image.");
      return;
    }

    try {
      setIsUploading(true);
      const result = await uploadImage(file);
      const imageUrl =
        typeof result === "string"
          ? result
          : result?.url || result?.data || result;
      if (!imageUrl) {
        throw new Error("Image upload failed: no URL returned");
      }
      setForm((prev) => ({ ...prev, icon: imageUrl }));
      setPreviewImage(imageUrl);
    } catch (err) {
      console.error("Image upload error:", err);
      toast.error(err?.message || "Failed to upload ServiceImage");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setForm((prev) => ({ ...prev, icon: "" }));
    setPreviewImage("");
  };

  const buildPayload = () => {
    const payload = {
      title: form.title?.trim() || "",
      excerpt: form.excerpt?.trim() || "",
      pointHeading: form.pointHeading?.trim() || "",
      icon: form.icon || "",
      description: form.description || "",
      descriptionBottom: form.descriptionBottom || "",
      points: form.points || [],
    };

    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAll()) {
      toast.error("Please fill required fields before saving.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = buildPayload();

      if (isEditMode) {
        await dispatch(
          updateService({ id: serviceId, ServiceData: payload })
        ).unwrap();
        toast.success("Service updated!");
      } else {
        await dispatch(createService(payload)).unwrap();
        toast.success("Service created!");
      }

      navigate("/service");
    } catch (err) {
      console.error(err);
      toast.error(
        err?.data?.message || err?.message || "Failed to save the Service."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const hasErrors = Object.values(errors).some(Boolean);
  const isDisabled = hasErrors || submitting || isUploading;

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditMode ? "Edit Service Details" : "Add Service"}
        description={
          isEditMode
            ? "Update content for this Service."
            : "Add a new Service to the database."
        }
        buttonsList={useMemo(
          () => [
            {
              value: "Back to Services",
              variant: "white",
              className:
                "border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-white",
              onClick: () => navigate("/service"),
            },
          ],
          [navigate]
        )}
      />

      <form
        onSubmit={handleSubmit}
        className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]"
      >
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { label: "Title", name: "title" },
              { label: "Excerpt", name: "excerpt" },
              { label: "Point Heading", name: "pointHeading" },
              
            ].map((field) => (
              <div key={field.name}>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {field.label}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type={field.type || "text"}
                  name={field.name}
                  value={form[field.name] ?? ""}
                  onChange={handleChange}
                  className={`mt-1 w-full rounded-xl border px-3 py-2 text-sm text-slate-900 outline-none transition
                    ${
                      errors[field.name]
                        ? "border-red-400 focus:border-red-500"
                        : "border-slate-200 focus:border-primary"
                    }`}
                />
                {errors[field.name] && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors[field.name]}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Points
            </label>
            <div className="mt-2 space-y-2">
              {form.points.map((point, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={point}
                    onChange={(e) => handlePointChange(index, e.target.value)}
                    placeholder="Enter point"
                    className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => removePoint(index)}
                    className="rounded-full border border-red-200 p-2 text-red-500 hover:bg-red-50"
                    title="Remove point"
                  >
                    <RiDeleteBin5Line size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addPoint}
                className="mt-2 rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Add Point
              </button>
            </div>
          </div>

          <div className="mt-4">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Description
            </label>
            <div className="mt-2 rounded-2xl border border-slate-200 p-1">
              <ReactQuill
                value={form.description}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, description: value }))
                }
                modules={quillModules}
                formats={quillFormats}
                className="rounded-2xl [&_.ql-container]:rounded-b-2xl [&_.ql-toolbar]:rounded-t-2xl"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Description Bottom
            </label>
            <div className="mt-2 rounded-2xl border border-slate-200 p-1">
              <ReactQuill
                value={form.descriptionBottom}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, descriptionBottom: value }))
                }
                modules={quillModules}
                formats={quillFormats}
                className="rounded-2xl [&_.ql-container]:rounded-b-2xl [&_.ql-toolbar]:rounded-t-2xl"
              />
            </div>
          </div>
      
        </div>

        <div className="space-y-6">
          <div className="space-y-6">
           <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
               Image
            </label>

            {previewImage ? (
              <div className="mt-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-3">
                <div className="relative">
                  <img
                    src={`${
                      import.meta.env.VITE_API_URL_IMAGE
                    }${previewImage}`}
                    alt="Preview"
                    className="h-56 w-full rounded-xl object-cover"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 rounded-full bg-red-600 p-2 text-white shadow hover:bg-red-500"
                    onClick={handleRemoveImage}
                    title="Remove ServiceImage"
                  >
                    <RiDeleteBin5Line size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <label className="mt-3 flex h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 text-sm text-slate-500 hover:border-slate-300">
                <span>Click to upload Image</span>
                <input
                  type="file"
                  accept="ServiceImage/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            )}

            {isUploading && (
              <p className="mt-2 text-sm text-slate-500">
                Uploading ServiceImage...
              </p>
            )}
          </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <button
              type="submit"
              disabled={isDisabled}
              className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting
                ? "Saving..."
                : isEditMode
                ? "Save Changes"
                : "Create Service"}
            </button>

            {isDisabled && (
              <p className="mt-2 text-xs text-red-600">
                {isUploading
                  ? "Please wait ServiceImage is uploading..."
                  : hasErrors
                  ? "Please fill all required fields to enable Save"
                  : ""}
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ServiceFormPage;
