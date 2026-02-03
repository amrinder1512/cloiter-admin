import { useEffect, useState } from "react";
import Section from "../../UI/Section";
import Input from "../../UI/Input";
import { useDispatch, useSelector } from "react-redux";
import { getPrivacyPolicy, updatePrivacyPolicy } from "../../store/slices/policySlice";
import { toast } from "react-toastify";
import ReactQuill from "react-quill-new";

const PrivacyPolicyPage = () => {
    const dispatch = useDispatch();
    const { privacy, loading } = useSelector((state) => state.policy);
    const [form, setForm] = useState({
        title: "",
        description: "",
    });

    useEffect(() => {
        dispatch(getPrivacyPolicy());
    }, [dispatch]);

    useEffect(() => {
        if (privacy) {
            console.log("Privacy Data from Redux:", privacy);
            setForm({
                title: privacy.title || "",
                description: privacy.description || "",
            });
        }
    }, [privacy]);

    const handleSave = async () => {
        const res = await dispatch(updatePrivacyPolicy(form));
        if (res?.payload) toast.success("Privacy policy updated successfully");
    };

    return (
        <Section title="Privacy Policy" onSave={handleSave} loading={loading}>
            <div className="space-y-6">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Policy Title</label>
                    <input
                        className="w-full px-4 py-2 rounded-xl border border-slate-200"
                        value={form.title}
                        onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Policy Content</label>
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

export default PrivacyPolicyPage;
