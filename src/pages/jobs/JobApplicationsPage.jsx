import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getJobApplications } from "../../store/slices/jobsSlice";
import { Mail, Phone, MapPin, Briefcase, FileText, Search } from "lucide-react";

const JobApplicationsPage = () => {
    const dispatch = useDispatch();
    const { applications, loading, pagination } = useSelector((state) => state.jobs);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            dispatch(getJobApplications({ page: 1, search: searchTerm }));
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, dispatch]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            dispatch(getJobApplications({ page: newPage, search: searchTerm }));
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Job Applications</h1>
                    <p className="text-slate-500">View and manage all candidates who applied for jobs.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search applications..."
                        className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 w-full md:w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Candidate Name</th>
                                <th className="px-6 py-4">Job Title</th>
                                <th className="px-6 py-4">Contact Info</th>
                                <th className="px-6 py-4">Resume</th>
                                <th className="px-6 py-4">Applied Date</th>
                                {/* <th className="px-6 py-4">Status</th> */}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                        <div className="animate-spin h-8 w-8 border-4 border-slate-900 border-t-transparent rounded-full mx-auto mb-4"></div>
                                        Loading applications...
                                    </td>
                                </tr>
                            ) : applications.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                        No applications received yet.
                                    </td>
                                </tr>
                            ) : (
                                applications.map((app) => (
                                    <tr key={app._id} className="hover:bg-slate-50 transition">
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            {app.firstName} {app.lastName}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Briefcase size={16} className="text-slate-400" />
                                                <span className="truncate max-w-[200px]" title={app.jobId?.title}>
                                                    {app.jobId?.title || "Unknown Role"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <Mail size={14} className="text-slate-400" />
                                                    <span className="truncate max-w-[200px]" title={app.email}>{app.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Phone size={14} className="text-slate-400" />
                                                    <span>{app.phone}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {app.resume ? (
                                                <a
                                                    href={`${import.meta.env.VITE_IMAGE_URL || ''}${app.resume.replace(/\\/g, '/')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
                                                >
                                                    <FileText size={16} />
                                                    View
                                                </a>
                                            ) : (
                                                <span className="text-slate-400 italic">No resume</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {new Date(app.createdAt).toLocaleDateString()}
                                        </td>
                                        {/* <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${app.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                app.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                    'bg-slate-50 text-slate-700 border-slate-200'
                                                }`}>
                                                {app.status || "New"}
                                            </span>
                                        </td> */}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {!loading && applications.length > 0 && pagination && (
                    <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                        <div className="text-sm text-slate-500">
                            Showing <span className="font-medium">{(pagination.currentPage - 1) * 10 + 1}</span> to <span className="font-medium">{Math.min(pagination.currentPage * 10, pagination.totalApplications)}</span> of <span className="font-medium">{pagination.totalApplications}</span> results
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handlePageChange(pagination.currentPage - 1)}
                                disabled={pagination.currentPage === 1}
                                className="px-3 py-1 text-sm font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => handlePageChange(pagination.currentPage + 1)}
                                disabled={pagination.currentPage === pagination.totalPages}
                                className="px-3 py-1 text-sm font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobApplicationsPage;
