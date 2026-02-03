import { useEffect, useState } from "react";
import Section from "../../UI/Section";
import Input from "../../UI/Input";
import ImageUploader from "../../UI/ImageUpload";
import { useDispatch, useSelector } from "react-redux";
import {
    getCareerPage,
    updateCareerPage,
} from "../../store/slices/careerPageSlice";
import { toast } from "react-toastify";
import ReactQuill from "react-quill-new";

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
    "bullet",
    "blockquote",
    "code-block",
    "align",
    "link",
    "image",
];

const CareersPage = () => {
    const dispatch = useDispatch();
    const { career, loading } = useSelector((state) => state.career || {});

    const [form, setForm] = useState({
        heading: "",
        subHeading: "",
        image: "",

        heading1: "",
        subHeading1: "",

        metaTitle: "",
        metaDescription: "",
        metaKeywords: "",
        metaImage: "",

        ogTitle: "",
        ogDescription: "",
        ogImage: "",
        ogType: "website",

        robots: {
            noindex: false,
            nofollow: false,
            noarchive: false,
            nosnippet: false,
            noimageindex: false,
            notranslate: false,
        },
    });

    useEffect(() => {
        dispatch(getCareerPage());
    }, [dispatch]);

    useEffect(() => {
        if (career) {
            setForm({
                ...form,
                ...career,
                metaKeywords: career.metaKeywords || "",
                robots: career.robots || form.robots,
            });
        }
    }, [career]);

    const handleSave = async () => {
        const res = await dispatch(updateCareerPage(form));

        res?.payload
            ? toast.success("Career Page Updated Successfully!")
            : toast.error("Failed to update Career Page");
    };

    return (
        <Section title="Career Page" onSave={handleSave} loading={loading}>
            {loading ? (
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                </div>
            ) : (
                <div className="space-y-8">
                    <Input
                        label="Heading"
                        value={form.heading}
                        onChange={(e) => setForm({ ...form, heading: e.target.value })}
                    />
                    <Input
                        label="Sub Heading"
                        value={form.subHeading}
                        onChange={(e) => setForm({ ...form, subHeading: e.target.value })}
                    />

                    <ImageUploader
                        label="Main Image"
                        value={form.image}
                        onChange={(img) => setForm({ ...form, image: img })}
                    />

                    <Input
                        label="Heading 1"
                        value={form.heading1}
                        onChange={(e) => setForm({ ...form, heading1: e.target.value })}
                    />
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Sub Heading 1
                    </label>
                    <ReactQuill
                        value={form.subHeading1}
                        onChange={(value) => setForm({ ...form, subHeading1: value })}
                        modules={quillModules}
                        formats={quillFormats}
                        className="rounded-2xl [&_.ql-container]:rounded-b-2xl [&_.ql-toolbar]:rounded-t-2xl"
                    />


                </div>
            )}
        </Section>
    );
};

export default CareersPage;
