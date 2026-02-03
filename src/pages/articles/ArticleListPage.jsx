import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getArticles, deleteArticle } from "../../store/slices/articlesSlice";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, Eye, Search } from "lucide-react";
import { toast } from "react-toastify";
import { ROUTES } from "../../consts/routes";
import ConfirmModal from "../../UI/ConfirmDeleteModal";

const ArticleListPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { articles, loading } = useSelector((state) => state.articles);
    const [deleteId, setDeleteId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            dispatch(getArticles({ search: searchTerm }));
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [dispatch, searchTerm]);

    const handleDelete = async () => {
        if (deleteId) {
            const res = await dispatch(deleteArticle(deleteId));
            if (res?.payload) {
                toast.success("Blog deleted successfully");
                setDeleteId(null);
            }
        }
    };

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold">Blogs</h1>
                <div className="flex w-full md:w-auto gap-4">
                    <div className="relative flex-1 md:flex-initial">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search blogs..."
                            className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 w-full md:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => navigate(ROUTES.ARTICLE_CREATE)}
                        className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition whitespace-nowrap"
                    >
                        <Plus size={20} /> New Blog
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Title</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Author</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan="4" className="px-6 py-4 text-center">Loading...</td></tr>
                        ) : articles.length === 0 ? (
                            <tr><td colSpan="4" className="px-6 py-4 text-center text-slate-500">No articles found</td></tr>
                        ) : (
                            articles.map((article) => (
                                <tr key={article._id} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4 font-medium">{article.title}</td>
                                    <td className="px-6 py-4 text-slate-600">{article.author || "N/A"}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${article.status === 'Published' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-100'
                                            }`}>
                                            {article.status || 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-3">
                                            <button onClick={() => navigate(ROUTES.ARTICLE_EDIT.replace(':articleId', article._id))} className="text-slate-500 hover:text-slate-900 transition">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => setDeleteId(article._id)} className="text-red-500 hover:text-red-700 transition">
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

            <ConfirmModal
                isOpen={!!deleteId}
                title="Delete Blog"
                message="Are you sure you want to delete this blog? This action cannot be undone."
                onConfirm={handleDelete}
                onCancel={() => setDeleteId(null)}
            />
        </div>
    );
};

export default ArticleListPage;
