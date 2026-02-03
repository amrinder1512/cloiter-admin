import { useEffect, useState } from "react";
import Section from "../../UI/Section";
import { useDispatch, useSelector } from "react-redux";
import { getJobs, deleteJob, createJob, updateJob } from "../../store/slices/jobsSlice";
import { toast } from "react-toastify";
import { Plus, Edit, Trash2 } from "lucide-react";

const JobsPage = () => {
    const dispatch = useDispatch();
    const { jobs, loading } = useSelector((state) => state.jobs);
    const [showModal, setShowModal] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        location: "",
        type: "Full-time",
        description: "",
        requirements: "",
    });

    useEffect(() => {
        dispatch(getJobs());
    }, [dispatch]);

    const handleReset = () => {
        setFormData({
            title: "",
            location: "",
            type: "Full-time",
            description: "",
            requirements: "",
        });
        setEditingJob(null);
    };

    const handleEdit = (job) => {
        setEditingJob(job);
        setFormData({
            title: job.title,
            location: job.location,
            type: job.type,
            description: job.description,
            requirements: job.requirements,
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this job?")) {
            const res = await dispatch(deleteJob(id));
            if (res?.payload) toast.success("Job deleted successfully");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let res;
        if (editingJob) {
            res = await dispatch(updateJob({ id: editingJob._id, data: formData }));
        } else {
            res = await dispatch(createJob(formData));
        }

        if (res?.payload) {
            toast.success(`Job ${editingJob ? "updated" : "created"} successfully`);
            setShowModal(false);
            handleReset();
            dispatch(getJobs());
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Jobs Management</h1>
                <button
                    onClick={() => {
                        handleReset();
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition"
                >
                    <Plus size={20} /> Add New Job
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Title</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Location</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Type</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center">Loading...</td>
                            </tr>
                        ) : jobs.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center text-slate-500">No jobs found</td>
                            </tr>
                        ) : (
                            jobs.map((job) => (
                                <tr key={job._id} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4 font-medium">{job.title}</td>
                                    <td className="px-6 py-4 text-slate-600">{job.location}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium border border-blue-100">
                                            {job.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-3">
                                            <button onClick={() => handleEdit(job)} className="text-slate-500 hover:text-slate-900 transition">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(job._id)} className="text-red-500 hover:text-red-700 transition">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold">{editingJob ? "Edit Job" : "Add New Job"}</h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">×</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Job Title</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Location</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">Job Type</label>
                                <select
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option>Full-time</option>
                                    <option>Part-time</option>
                                    <option>Contract</option>
                                    <option>Remote</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">Description</label>
                                <textarea
                                    rows="3"
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">Requirements</label>
                                <textarea
                                    rows="3"
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition"
                                    value={formData.requirements}
                                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition"
                                >
                                    {editingJob ? "Update Job" : "Create Job"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobsPage;
