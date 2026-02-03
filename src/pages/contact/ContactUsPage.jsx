import { useEffect, useState } from "react";
import Section from "../../UI/Section";
import Input from "../../UI/Input";
import { useDispatch, useSelector } from "react-redux";
import { getContactUsPage, updateContactUsPage } from "../../store/slices/contactUsSlice";
import { toast } from "react-toastify";
import { Plus, Trash2 } from "lucide-react";

const ContactUsPage = () => {
    const dispatch = useDispatch();
    const { contact, loading } = useSelector((state) => state.contact || {});

    const [form, setForm] = useState({
        heroSection: { title: "", description: "", buttonText: "" },
        formSection: { badge: "", title: "", description: "" },
        points: [],
        bottomSection: { number: "", email: "", address: "" },
    });

    useEffect(() => {
        dispatch(getContactUsPage());
    }, [dispatch]);

    useEffect(() => {
        if (contact) {
            setForm({
                heroSection: {
                    title: contact.heroSection?.title || "",
                    description: contact.heroSection?.description || "",
                    buttonText: contact.heroSection?.buttonText || "",
                },
                formSection: {
                    badge: contact.formSection?.badge || "",
                    title: contact.formSection?.title || "",
                    description: contact.formSection?.description || "",
                },
                points: Array.isArray(contact.points) ? contact.points : [],
                bottomSection: {
                    number: contact.bottomSection?.number || "",
                    email: contact.bottomSection?.email || "",
                    address: contact.bottomSection?.address || "",
                },
            });
        }
    }, [contact]);

    const handleSave = async () => {
        const res = await dispatch(updateContactUsPage(form));
        if (res?.payload) toast.success("Contact Page updated successfully");
    };

    const handleHeroChange = (field, value) => {
        setForm(prev => ({ ...prev, heroSection: { ...prev.heroSection, [field]: value } }));
    };

    const handleFormSectionChange = (field, value) => {
        setForm(prev => ({ ...prev, formSection: { ...prev.formSection, [field]: value } }));
    };

    // Points logic
    const addPoint = () => {
        setForm(prev => ({ ...prev, points: [...prev.points, { type: "" }] }));
    };

    const removePoint = (index) => {
        setForm(prev => ({ ...prev, points: prev.points.filter((_, i) => i !== index) }));
    };

    const updatePoint = (index, value) => {
        const newPoints = [...form.points];
        newPoints[index] = { ...newPoints[index], type: value };
        setForm(prev => ({ ...prev, points: newPoints }));
    };

    // Bottom Section logic
    const handleBottomSectionChange = (field, value) => {
        setForm(prev => ({ ...prev, bottomSection: { ...prev.bottomSection, [field]: value } }));
    };

    return (
        <Section title="Contact Page Editor" onSave={handleSave} loading={loading}>
            <div className="space-y-10 pb-10">
                {/* Hero Section */}
                <div className="space-y-4 border-b pb-8">
                    <h2 className="text-xl font-bold text-slate-900 leading-none">Hero Section</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Title"
                            value={form.heroSection.title}
                            onChange={(e) => handleHeroChange('title', e.target.value)}
                        />
                        <Input
                            label="Button Text"
                            value={form.heroSection.buttonText}
                            onChange={(e) => handleHeroChange('buttonText', e.target.value)}
                        />
                    </div>
                    <Input
                        label="Description"
                        textarea
                        value={form.heroSection.description}
                        onChange={(e) => handleHeroChange('description', e.target.value)}
                    />
                </div>

                {/* Form Section */}
                <div className="space-y-4 border-b pb-8">
                    <h2 className="text-xl font-bold text-slate-900 leading-none">Form Section</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Badge"
                            value={form.formSection.badge}
                            onChange={(e) => handleFormSectionChange('badge', e.target.value)}
                        />
                        <Input
                            label="Title"
                            value={form.formSection.title}
                            onChange={(e) => handleFormSectionChange('title', e.target.value)}
                        />
                    </div>
                    <Input
                        label="Description"
                        textarea
                        value={form.formSection.description}
                        onChange={(e) => handleFormSectionChange('description', e.target.value)}
                    />
                </div>

                {/* Points Section */}
                <div className="space-y-4 border-b pb-8">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-slate-900 leading-none">Points List</h2>
                        <button onClick={addPoint} className="flex items-center gap-2 text-sm font-bold text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition">
                            <Plus size={16} /> Add Point
                        </button>
                    </div>
                    <div className="space-y-3">
                        {form.points.map((point, index) => (
                            <div key={index} className="flex gap-3 items-end bg-slate-50 p-3 rounded-xl">
                                <div className="flex-1">
                                    <Input
                                        label={`Point ${index + 1}`}
                                        value={point.type}
                                        onChange={(e) => updatePoint(index, e.target.value)}
                                        placeholder="Enter point type..."
                                    />
                                </div>
                                <button onClick={() => removePoint(index)} className="mb-2 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                        {form.points.length === 0 && <p className="text-sm text-slate-400 italic">No points added yet.</p>}
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-slate-900 leading-none">Bottom Section (Contact Info)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Input
                            label="Phone Number"
                            value={form.bottomSection.number || ""}
                            onChange={(e) => handleBottomSectionChange('number', e.target.value)}
                            placeholder="e.g. +1 234 567 890"
                        />
                        <Input
                            label="Email Address"
                            value={form.bottomSection.email || ""}
                            onChange={(e) => handleBottomSectionChange('email', e.target.value)}
                            placeholder="e.g. contact@example.com"
                        />
                        <Input
                            label="Location / Address"
                            value={form.bottomSection.address || ""}
                            onChange={(e) => handleBottomSectionChange('address', e.target.value)}
                            placeholder="e.g. 123 Main St, City, Country"
                        />
                    </div>
                </div>
            </div>
        </Section>
    );
};

export default ContactUsPage;
