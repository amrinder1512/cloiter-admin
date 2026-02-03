import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getJobApplications } from "../../store/slices/jobsSlice";
import { Mail, Phone, MapPin, Briefcase, FileText } from "lucide-react";

const JobApplicationsPage = () => {
    const dispatch = useDispatch();
    const { applications, loading } = useSelector((state) => state.jobs);

    useEffect(() => {
        dispatch(getJobApplications());
    }, [dispatch]);

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Job Applications</h1>
                <p className="text-slate-500">View and manage all candidates who applied for jobs.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    <div className="col-span-full py-12 text-center text-slate-500">
                        <div className="animate-spin h-8 w-8 border-4 border-slate-900 border-t-transparent rounded-full mx-auto mb-4"></div>
                        Loading applications...
                    </div>
                ) : applications.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-2xl border border-dashed border-slate-300">
                        No applications received yet.
                    </div>
                ) : (
                    applications.map((app) => (
                        <div key={app._id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">{app.name}</h2>
                                    <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
                                        <Briefcase size={14} />
                                        <span>Applied for: <strong>{app.jobTitle || "Developer Role"}</strong></span>
                                    </div>
                                </div>
                                <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                                    New
                                </span>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-3 text-slate-600">
                                    <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                        <Mail size={16} />
                                    </div>
                                    <span className="text-sm truncate">{app.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600">
                                    <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                        <Phone size={16} />
                                    </div>
                                    <span className="text-sm">{app.phone}</span>
                                </div>
                                {app.resume && (
                                    <a
                                        href={app.resume}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 text-blue-600 hover:text-blue-700 transition"
                                    >
                                        <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-400">
                                            <FileText size={16} />
                                        </div>
                                        <span className="text-sm font-medium underline">View Resume</span>
                                    </a>
                                )}
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-100">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Message</h3>
                                <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                                    {app.message || "No cover letter provided."}
                                </p>
                            </div>

                            <button className="w-full mt-6 py-2 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition">
                                View Full Detail
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default JobApplicationsPage;
