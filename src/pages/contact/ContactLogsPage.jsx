import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getContactLogs, deleteContactLog } from "../../store/slices/contactUsSlice";
import { Mail, Phone, User, Calendar, Eye, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import ConfirmModal from "../../UI/ConfirmDeleteModal";

const ContactLogsPage = () => {
    const dispatch = useDispatch();
    const { logs, loading, pagination } = useSelector((state) => state.contact);
    const [showModal, setShowModal] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        dispatch(getContactLogs({ page: 1 }));
    }, [dispatch]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            dispatch(getContactLogs({ page: newPage }));
        }
    };

    const viewLog = (log) => {
        setSelectedLog(log);
        setShowModal(true);
    };

    const handleDelete = async () => {
        if (deleteId) {
            const res = await dispatch(deleteContactLog(deleteId));
            if (res?.payload) {
                toast.success("Log deleted successfully");
                setDeleteId(null);
            }
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Contact Us Logs</h1>
                <p className="text-slate-500">View and manage all inquiries received through the contact form.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Name</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Email</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Subject</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Inquiry Type</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Date</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center">Loading...</td>
                            </tr>
                        ) : logs.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-slate-500">No logs found</td>
                            </tr>
                        ) : (
                            logs.map((log) => (
                                <tr key={log._id} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4 font-medium text-slate-900">{log.firstName + " " + log.lastName}</td>
                                    <td className="px-6 py-4 text-slate-600">{log.email}</td>
                                    <td className="px-6 py-4 text-slate-600 truncate max-w-[150px]">{log.subject || "N/A"}</td>
                                    <td className="px-6 py-4 text-slate-600">
                                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                                            {log.inquiryType || "General"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-sm">
                                        {new Date(log.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-3">
                                            <button
                                                onClick={() => viewLog(log)}
                                                className="text-slate-400 hover:text-slate-900 transition"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            {/* <button
                                                onClick={() => setDeleteId(log._id)}
                                                className="text-red-400 hover:text-red-700 transition"
                                            >
                                                <Trash2 size={18} />
                                            </button> */}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                {!loading && logs.length > 0 && pagination && (
                    <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                        <div className="text-sm text-slate-500">
                            Showing <span className="font-medium">{(pagination.currentPage - 1) * 10 + 1}</span> to <span className="font-medium">{Math.min(pagination.currentPage * 10, pagination.totalContacts)}</span> of <span className="font-medium">{pagination.totalContacts}</span> results
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

            {showModal && selectedLog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center text-slate-900">
                            <h2 className="text-xl font-bold">Inquiry Details</h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">×</button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                                <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                                    <User size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Name</p>
                                    <p className="font-medium text-slate-900">{selectedLog.name}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <Mail size={16} className="text-slate-400" />
                                    <span className="text-sm text-slate-600">{selectedLog.email}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone size={16} className="text-slate-400" />
                                    <span className="text-sm text-slate-600">{selectedLog.phone || "N/A"}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Subject</p>
                                    <p className="text-slate-900 font-medium">{selectedLog.subject || "No Subject"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inquiry Type</p>
                                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-bold inline-block mt-0.5">
                                        {selectedLog.inquiryType || "General"}
                                    </span>
                                </div>
                            </div>

                            {selectedLog.company && (
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Company</p>
                                    <p className="text-slate-900 font-medium">{selectedLog.company}</p>
                                </div>
                            )}

                            <div className="space-y-2">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Message</p>
                                <div className="p-4 bg-slate-50 rounded-xl text-slate-700 text-sm leading-relaxed whitespace-pre-wrap min-h-[100px]">
                                    {selectedLog.message}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-slate-400 text-xs pt-2">
                                <Calendar size={14} />
                                <span>Received on {new Date(selectedLog.createdAt).toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-full py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={!!deleteId}
                title="Delete Contact Log"
                message="Are you sure you want to delete this inquiry? This action cannot be undone."
                onConfirm={handleDelete}
                onCancel={() => setDeleteId(null)}
            />
        </div>
    );
};

export default ContactLogsPage;
