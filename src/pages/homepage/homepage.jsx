import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  fetchAllHomepageSections,
  updateHomepageSection,
  clearMessages,
} from "../../store/slices/homepageSlice";
import { AiTwotoneEdit } from "react-icons/ai";
import { RiDeleteBin5Line } from "react-icons/ri";
import ImageUploader from "../../UI/ImageUpload";
import ConfirmModal from "../../UI/ConfirmDeleteModal";


const HomePageEditor = () => {
  const dispatch = useDispatch();
  const { sections, is_loading, errors } = useSelector(
    (state) => state.homepage
  );

  // --- STATES MAPPED TO NEW MODEL ---
  const [hero, setHero] = useState({
    title: "",
    title2: "",
    description: "",
    buttonText: "",
    ctaLink: "",
  });

  const [trustedBy, setTrustedBy] = useState({
    badge: "",
    testimonials: [],
  });
  const [process, setProcess] = useState({
    badge: "",
    title: "",
    title2: "",
    cards: [{ title: "", image: "", description: "" }],
  });

  const [webFeature, setWebFeature] = useState({
    badge: "",
    title: "",
    highlightedText: "",
    imageSrc: "",
    features: [{ title: "", description: "" }],
  });

  const [services, setServices] = useState({
    badge: "",
    heading: "",
  });

  const [statsFeature, setStatsFeature] = useState({
    badge: "",
    title: "",
    highlightedTitle: "",
    statValue: "",
    statDescription: "",
    blogTitle: "",
    blogSummary: "",
  });

  const [pillars, setPillars] = useState([
    { title: "", icon: "", description: "" },
  ]);

  const [testimonials, setTestimonials] = useState({
    badge: "",
    title: "",
    highlightedTitle: "",
    testimonials: [{ text: "" }],
  });


  // Load Data
  useEffect(() => {
    dispatch(fetchAllHomepageSections());
    return () => dispatch(clearMessages());
  }, [dispatch]);

  // Sync Redux with Local State
  useEffect(() => {
    if (sections) {
      if (sections.heroSection) setHero(sections.heroSection);
      if (sections.trustedByData) setTrustedBy(sections.trustedByData); // ✅ ADD
      if (sections.processData) setProcess(sections.processData);
      if (sections.webFeature) setWebFeature(sections.webFeature);
      if (sections.services) setServices(sections.services);
      if (sections.statsFeature) setStatsFeature(sections.statsFeature);
      if (sections.threePillarsSection) {
        setPillars(
          sections.threePillarsSection.length
            ? sections.threePillarsSection
            : [{ title: "", icon: "", description: "" }]
        );
      }
      if (sections.testimonials) {
        setTestimonials({
          badge: sections.testimonials.badge || "",
          title: sections.testimonials.title || "",
          highlightedTitle: sections.testimonials.highlightedTitle || "",
          testimonials:
            sections.testimonials.testimonials?.length
              ? sections.testimonials.testimonials
              : [{ text: "" }],
        });
      }
    }
  }, [sections]);


  // --- SAVE HANDLERS ---
  const saveHero = () => dispatch(updateHomepageSection("hero", hero));

  const saveProcess = () => dispatch(updateHomepageSection("process", process));

  const saveWebFeature = () => dispatch(updateHomepageSection("web-feature", webFeature));

  const saveServices = () => dispatch(updateHomepageSection("services-header", services));

  const saveStats = () => dispatch(updateHomepageSection("stats-feature", statsFeature));

  const savePillars = () => dispatch(updateHomepageSection("pillars", { pillars }));

  const saveTestimonials = () => dispatch(updateHomepageSection("testimonials", testimonials));
  const saveTrustedBy = () =>
    dispatch(updateHomepageSection("trusted-by", trustedBy));

  return (
    <div className=" min-h-screen space-y-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 6">Homepage Editor</h1>

      {is_loading ? (
        <SkeletonLoader />
      ) : (
        <>
          {errors && <p className="text-red-500">{errors.message}</p>}

          {/* 1. HERO SECTION */}
          <Section title="Hero Section" onSave={saveHero}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Title 1 (Highlighted)" value={hero.title} onChange={(e) => setHero({ ...hero, title: e.target.value })} />
              <Input label="Title 2" value={hero.title2} onChange={(e) => setHero({ ...hero, title2: e.target.value })} />
            </div>
            <Textarea label="Description" value={hero.description} onChange={(e) => setHero({ ...hero, description: e.target.value })} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Button Text" value={hero.buttonText} onChange={(e) => setHero({ ...hero, buttonText: e.target.value })} />
              <Input label="CTA Link" value={hero.ctaLink} onChange={(e) => setHero({ ...hero, ctaLink: e.target.value })} />
            </div>
          </Section>
          <Section title="Trusted By Section" onSave={saveTrustedBy}>
            <Input
              label="Badge Text"
              value={trustedBy.badge}
              onChange={(e) =>
                setTrustedBy({ ...trustedBy, badge: e.target.value })
              }
            />

            <h5 className="font-semibold mt-3">Testimonials / Logos</h5>

            {trustedBy.testimonials.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const arr = [...trustedBy.testimonials];
                    arr[i] = e.target.value;
                    setTrustedBy({ ...trustedBy, testimonials: arr });
                  }}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Company name or logo URL"
                />
                <button
                  onClick={() =>
                    setTrustedBy({
                      ...trustedBy,
                      testimonials: trustedBy.testimonials.filter((_, idx) => idx !== i),
                    })
                  }
                  className="text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}

            <AddButton
              onClick={() =>
                setTrustedBy({
                  ...trustedBy,
                  testimonials: [...trustedBy.testimonials, ""],
                })
              }
            />
          </Section>
          {/* 2. PROCESS SECTION (Cards with Images) */}
          <Section title="Process Section (How it Works)" onSave={saveProcess}>
            <Input label="Badge" value={process.badge} onChange={(e) => setProcess({ ...process, badge: e.target.value })} />
            <Input label="Section Title" value={process.title} onChange={(e) => setProcess({ ...process, title: e.target.value })} />
            <Input label="Section Title highlighted in Red" value={process.title2} onChange={(e) => setProcess({ ...process, title2: e.target.value })} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {process.cards.map((card, i) => (
                <CardBlock
                  key={i}
                  index={i}
                  data={card}
                  showImageField={true}
                  setData={(updated) => {
                    const arr = [...process.cards];
                    arr[i] = updated;
                    setProcess({ ...process, cards: arr });
                  }}
                  onDelete={() => {
                    const arr = process.cards.filter((_, idx) => idx !== i);
                    setProcess({ ...process, cards: arr });
                  }}
                />
              ))}
            </div>
            <AddButton onClick={() => setProcess({ ...process, cards: [...process.cards, { title: "", image: "", description: "" }] })} />
          </Section>

          {/* 3. WEB FEATURE (Image + Feature Points) */}
          <Section title="Web Feature Section" onSave={saveWebFeature}>
            <div className="grid grid-cols-3 gap-4">
              <Input label="Badge" value={webFeature.badge} onChange={(e) => setWebFeature({ ...webFeature, badge: e.target.value })} />
              <Input label="Main Title" value={webFeature.title} onChange={(e) => setWebFeature({ ...webFeature, title: e.target.value })} />
              <Input label="Highlighted Text" value={webFeature.highlightedText} onChange={(e) => setWebFeature({ ...webFeature, highlightedText: e.target.value })} />
            </div>
            <ImageUploader label="Featured Image" value={webFeature.imageSrc} onChange={(url) => setWebFeature({ ...webFeature, imageSrc: url })} />

            <h5 className="font-semibold mt-4">Feature Points</h5>
            {webFeature.features.map((feat, i) => (
              <div key={i} className="flex items-start gap-2 mb-4 p-3 border rounded bg-gray-50">
                <div className="flex-1 space-y-2">
                  <Input label="Point Title" value={feat.title} onChange={(e) => {
                    const arr = [...webFeature.features];
                    arr[i].title = e.target.value;
                    setWebFeature({ ...webFeature, features: arr });
                  }} />
                  <Textarea label="Point Description" value={feat.description} onChange={(e) => {
                    const arr = [...webFeature.features];
                    arr[i].description = e.target.value;
                    setWebFeature({ ...webFeature, features: arr });
                  }} />
                </div>
                <button onClick={() => setWebFeature({ ...webFeature, features: webFeature.features.filter((_, idx) => idx !== i) })} className="text-red-500 mt-7">✕</button>
              </div>
            ))}
            <AddButton onClick={() => setWebFeature({ ...webFeature, features: [...webFeature.features, { title: "", description: "" }] })} />
          </Section>

          {/* 4. THREE PILLARS SECTION */}
          <Section title="Three Pillars (Expanding Cards)" onSave={savePillars}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pillars.map((p, i) => (
                <div
                  key={i}
                  className="p-4 border border-gray-200 rounded-lg bg-white"
                >
                  <Input
                    label="Title"
                    value={p.title}
                    onChange={(e) => {
                      const arr = [...pillars];
                      arr[i].title = e.target.value;
                      setPillars(arr);
                    }}
                  />
                  <Input
                    label="Icon (Emoji or URL)"
                    value={p.icon}
                    onChange={(e) => {
                      const arr = [...pillars];
                      arr[i].icon = e.target.value;
                      setPillars(arr);
                    }}
                  />
                  <Textarea
                    label="Description"
                    value={p.description}
                    onChange={(e) => {
                      const arr = [...pillars];
                      arr[i].description = e.target.value;
                      setPillars(arr);
                    }}
                  />
                </div>
              ))}
            </div>

            <AddButton
              onClick={() =>
                setPillars([...pillars, { title: "", icon: "", description: "" }])
              }
            />
          </Section>

          <Section title="Testimonials Section" onSave={saveTestimonials}>
            <Input
              label="Badge"
              value={testimonials.badge}
              onChange={(e) =>
                setTestimonials({ ...testimonials, badge: e.target.value })
              }
            />

            <Input
              label="Title"
              value={testimonials.title}
              onChange={(e) =>
                setTestimonials({ ...testimonials, title: e.target.value })
              }
            />

            <Input
              label="Highlighted Title"
              value={testimonials.highlightedTitle}
              onChange={(e) =>
                setTestimonials({
                  ...testimonials,
                  highlightedTitle: e.target.value,
                })
              }
            />

            <h5 className="font-semibold mt-4">Testimonials</h5>

            {testimonials.testimonials.map((t, i) => (
              <div key={i} className="flex items-start gap-2">
                <Textarea
                  label={`Testimonial #${i + 1}`}
                  value={t.text}
                  onChange={(e) => {
                    const arr = [...testimonials.testimonials];
                    arr[i].text = e.target.value;
                    setTestimonials({ ...testimonials, testimonials: arr });
                  }}
                />

                <button
                  onClick={() =>
                    setTestimonials({
                      ...testimonials,
                      testimonials: testimonials.testimonials.filter(
                        (_, idx) => idx !== i
                      ),
                    })
                  }
                  className="text-red-500 mt-7"
                >
                  ✕
                </button>
              </div>
            ))}

            <AddButton
              onClick={() =>
                setTestimonials({
                  ...testimonials,
                  testimonials: [...testimonials.testimonials, { text: "" }],
                })
              }
            />
          </Section>
          {/* 5. STATS FEATURE */}
          <Section title="Stats & Blog Section" onSave={saveStats}>
            <div className="grid grid-cols-2 gap-4">

              <Input label="Badge" value={statsFeature.badge} onChange={(e) => setStatsFeature({ ...statsFeature, badge: e.target.value })} />
              <Input label="Title" value={statsFeature.title} onChange={(e) => setStatsFeature({ ...statsFeature, title: e.target.value })} />
              <Input label="Highlight Title" value={statsFeature.highlightedTitle} onChange={(e) => setStatsFeature({ ...statsFeature, highlightedTitle: e.target.value })} />
              <Input label="Stat Label" value={statsFeature.statDescription} onChange={(e) => setStatsFeature({ ...statsFeature, statDescription: e.target.value })} />
              <Input label="Stat Value (e.g. 40%)" value={statsFeature.statValue} onChange={(e) => setStatsFeature({ ...statsFeature, statValue: e.target.value })} />
              <Input label="Blog Title" value={statsFeature.blogTitle} onChange={(e) => setStatsFeature({ ...statsFeature, blogTitle: e.target.value })} />
            </div>
            <Textarea label="Blog Summary" value={statsFeature.blogSummary} onChange={(e) => setStatsFeature({ ...statsFeature, blogSummary: e.target.value })} />
          </Section>

          {/* 6. SERVICES HEADER */}
          <Section title="Services Section Heading" onSave={saveServices}>
            <Input label="Badge" value={services.badge} onChange={(e) => setServices({ ...services, badge: e.target.value })} />
            <Input label="Main Heading" value={services.heading} onChange={(e) => setServices({ ...services, heading: e.target.value })} />
          </Section>
        </>
      )}
    </div>
  );
};

// --- HELPER COMPONENTS (Retaining your styles) ---

const Section = ({ title, children, onSave }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
      <button onClick={onSave} className="bg-[#434242] text-white px-4 py-2 rounded-md hover:bg-black transition-all">Save</button>
    </div>
    <div className="grid gap-3">{children}</div>
  </div>
);

const Input = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    <input type="text" value={value} onChange={onChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400 bg-white" />
  </div>
);

const Textarea = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    <textarea rows={3} value={value} onChange={onChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400 bg-white" />
  </div>
);

const CardBlock = ({ data, index, setData, onDelete, showImageField }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 mt-3 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm text-gray-500 font-medium">Card #{index + 1}</p>
        <button type="button" onClick={() => setIsModalOpen(true)} className="p-2 rounded-md hover:bg-red-100 transition-colors">
          <RiDeleteBin5Line className="text-red-600 text-xl" />
        </button>
      </div>
      <div className="space-y-3 mt-3">
        <Input label="Title" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
        {showImageField ? (
          <ImageUploader label="Image" value={data.image} onChange={(url) => setData({ ...data, image: url })} />
        ) : (
          <ImageUploader label="Icon" value={data.icon} onChange={(url) => setData({ ...data, icon: url })} />
        )}
        <Textarea label="Description" value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} />
      </div>
      <ConfirmModal isOpen={isModalOpen} onConfirm={() => { onDelete(); setIsModalOpen(false); }} onCancel={() => setIsModalOpen(false)} />
    </div>
  );
};

const AddButton = ({ onClick }) => (
  <button onClick={onClick} className="bg-[#434242] text-white px-4 py-2 rounded-md mt-4">➕ Add Another</button>
);

const SkeletonLoader = () => (
  <div className="animate-pulse space-y-6">
    {[...Array(3)].map((_, idx) => (
      <div key={idx} className="bg-white border border-gray-200 rounded-xl p-5 h-48"></div>
    ))}
  </div>
);

export default HomePageEditor;