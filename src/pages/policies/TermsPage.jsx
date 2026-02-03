import { useEffect, useState } from "react";
import Section from "../../UI/Section";
import Input from "../../UI/Input";
import { useDispatch, useSelector } from "react-redux";
import { getTermsOfService, updateTermsOfService } from "../../store/slices/policySlice";
import { toast } from "react-toastify";
import ReactQuill from "react-quill-new";

const TermsPage = () => {
    const dispatch = useDispatch();
    const { terms, loading } = useSelector((state) => state.policy);
    const [form, setForm] = useState({
        title: "",
        description: "",
    });

    useEffect(() => {
        dispatch(getTermsOfService());
    }, [dispatch]);

    useEffect(() => {
        if (terms) {
            setForm({
                title: terms.title || "",
                description: terms.description || "",
            });
        }
    }, [terms]);

    const handleSave = async () => {
        const res = await dispatch(updateTermsOfService(form));
        if (res?.payload) toast.success("Terms and conditions updated successfully");
    };

    return (
        <Section title="Terms & Conditions" onSave={handleSave} loading={loading}>
            <div className="space-y-6">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Title</label>
                    <input
                        className="w-full px-4 py-2 rounded-xl border border-slate-200"
                        value={form.title}
                        onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Content</label>
                    <ReactQuill
                        theme="snow"
                        value={form.description}
                        onChange={(val) => setForm(prev => ({ ...prev, description: val }))}
                        className="bg-white rounded-xl"
                    />
                </div>
            </div>
        </Section>
    );
};

export default TermsPage;
