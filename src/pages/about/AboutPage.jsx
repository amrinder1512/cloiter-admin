import { useEffect, useState } from "react";
import Section from "../../UI/Section";
import Input from "../../UI/Input";
import ImageUploader from "../../UI/ImageUpload";
import { useDispatch, useSelector } from "react-redux";
import { getAboutPage, updateAboutPage } from "../../store/slices/aboutPageSlice";
import { toast } from "react-toastify";
import ReactQuill from "react-quill-new";

const AboutPage = () => {
  const dispatch = useDispatch();
  const { about, loading } = useSelector((state) => state.about || {});

  const [form, setForm] = useState({
    heroSection: { title: "", description: "", image: "" },
    storySection: { badge: "", title: "", description: "", image: "" },
    visionSection: { badge: "", title: "", description: "", image: "" },
    missionSection: { badge: "", title: "", description: "", image: "" },
  });

  useEffect(() => {
    dispatch(getAboutPage());
  }, [dispatch]);

  useEffect(() => {
    if (about) {
      setForm({
        heroSection: {
          title: about.heroSection?.title || "",
          description: about.heroSection?.description || "",
          image: about.heroSection?.image || "",
        },
        storySection: {
          badge: about.storySection?.badge || "",
          title: about.storySection?.title || "",
          description: about.storySection?.description || "",
          image: about.storySection?.image || "",
        },
        visionSection: {
          badge: about.visionSection?.badge || "",
          title: about.visionSection?.title || "",
          description: about.visionSection?.description || "",
          image: about.visionSection?.image || "",
        },
        missionSection: {
          badge: about.missionSection?.badge || "",
          title: about.missionSection?.title || "",
          description: about.missionSection?.description || "",
          image: about.missionSection?.image || "",
        },
      });
    }
  }, [about]);

  const handleSave = async () => {
    const res = await dispatch(updateAboutPage(form));
    if (res?.payload) toast.success("About page updated successfully");
  };

  const handleSectionChange = (section, field, value) => {
    setForm(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  return (
    <Section title="About Page Content" onSave={handleSave} loading={loading}>
      <div className="space-y-12 pb-10">
        {/* Hero Section */}
        <div className="space-y-4 border-b pb-8">
          <h2 className="text-xl font-bold text-slate-900">Hero Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Title"
              value={form.heroSection.title}
              onChange={(e) => handleSectionChange('heroSection', 'title', e.target.value)}
            />
            <ImageUploader
              label="Hero Image"
              value={form.heroSection.image}
              onChange={(val) => handleSectionChange('heroSection', 'image', val)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <ReactQuill
              theme="snow"
              value={form.heroSection.description}
              onChange={(val) => handleSectionChange('heroSection', 'description', val)}
            />
          </div>
        </div>

        {/* Story Section */}
        <div className="space-y-4 border-b pb-8">
          <h2 className="text-xl font-bold text-slate-900">Story Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Badge"
              value={form.storySection.badge}
              onChange={(e) => handleSectionChange('storySection', 'badge', e.target.value)}
            />
            <Input
              label="Title"
              value={form.storySection.title}
              onChange={(e) => handleSectionChange('storySection', 'title', e.target.value)}
            />
          </div>
          <ImageUploader
            label="Story Image"
            value={form.storySection.image}
            onChange={(val) => handleSectionChange('storySection', 'image', val)}
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <ReactQuill
              theme="snow"
              value={form.storySection.description}
              onChange={(val) => handleSectionChange('storySection', 'description', val)}
            />
          </div>
        </div>

        {/* Vision Section */}
        <div className="space-y-4 border-b pb-8">
          <h2 className="text-xl font-bold text-slate-900">Vision Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Badge"
              value={form.visionSection.badge}
              onChange={(e) => handleSectionChange('visionSection', 'badge', e.target.value)}
            />
            <Input
              label="Title"
              value={form.visionSection.title}
              onChange={(e) => handleSectionChange('visionSection', 'title', e.target.value)}
            />
          </div>
          <ImageUploader
            label="Vision Image"
            value={form.visionSection.image}
            onChange={(val) => handleSectionChange('visionSection', 'image', val)}
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <ReactQuill
              theme="snow"
              value={form.visionSection.description}
              onChange={(val) => handleSectionChange('visionSection', 'description', val)}
            />
          </div>
        </div>

        {/* Mission Section */}
        <div className="space-y-4 pb-8">
          <h2 className="text-xl font-bold text-slate-900">Mission Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Badge"
              value={form.missionSection.badge}
              onChange={(e) => handleSectionChange('missionSection', 'badge', e.target.value)}
            />
            <Input
              label="Title"
              value={form.missionSection.title}
              onChange={(e) => handleSectionChange('missionSection', 'title', e.target.value)}
            />
          </div>
          <ImageUploader
            label="Mission Image"
            value={form.missionSection.image}
            onChange={(val) => handleSectionChange('missionSection', 'image', val)}
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <ReactQuill
              theme="snow"
              value={form.missionSection.description}
              onChange={(val) => handleSectionChange('missionSection', 'description', val)}
            />
          </div>
        </div>
      </div>
    </Section>
  );
};

export default AboutPage;
