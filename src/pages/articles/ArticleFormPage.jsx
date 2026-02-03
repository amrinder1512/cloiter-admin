import { useEffect, useState } from "react";
import Section from "../../UI/Section";
import Input from "../../UI/Input";
import ImageUploader from "../../UI/ImageUpload";
import { useDispatch, useSelector } from "react-redux";
import { createArticle, updateArticle, getArticles } from "../../store/slices/articlesSlice";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ReactQuill from "react-quill-new";
import { ROUTES } from "../../consts/routes";

const ArticleFormPage = () => {
    const { articleId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { articles, loading } = useSelector((state) => state.articles);

    const [form, setForm] = useState({
        title: "",
        slug: "",
        content: "",
        author: "",
        image: "",
        tags: [],
        status: "Draft",
        publishedAt: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        if (articleId) {
            dispatch(getArticles());
        }
    }, [dispatch, articleId]);

    useEffect(() => {
        if (articleId && articles.length > 0) {
            const article = articles.find(a => a._id === articleId);
            if (article) {
                setForm({
                    ...article,
                    tags: Array.isArray(article.tags) ? article.tags : [],
                    publishedAt: article.publishedAt ? new Date(article.publishedAt).toISOString().split('T')[0] : "",
                });
            }
        }
    }, [articleId, articles]);

    const handleSave = async () => {
        let res;
        const submitData = {
            ...form,
            status: form.status.charAt(0).toUpperCase() + form.status.slice(1).toLowerCase() === 'Published' ? 'Published' : 'Draft'
        };

        if (articleId) {
            res = await dispatch(updateArticle({ id: articleId, data: submitData }));
        } else {
            res = await dispatch(createArticle(submitData));
        }

        if (res?.payload) {
            toast.success(`Blog ${articleId ? "updated" : "created"} successfully`);
            navigate(ROUTES.ARTICLE);
        }
    };

    return (
        <Section title={articleId ? "Edit Blog" : "Create Blog"} onSave={handleSave} loading={loading}>
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                    <Input label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input label="Author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Published Date</label>
                        <input
                            type="date"
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition h-[42px]"
                            value={form.publishedAt}
                            onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Tags (comma separated)</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition h-[42px]"
                            value={form.tags.join(", ")}
                            onChange={(e) => setForm({ ...form, tags: e.target.value.split(",").map(t => t.trim()) })}
                            placeholder="e.g. tech, news, update"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Status</label>
                        <select
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition h-[42px]"
                            value={form.status}
                            onChange={(e) => setForm({ ...form, status: e.target.value })}
                        >
                            <option value="Draft">Draft</option>
                            <option value="Published">Published</option>
                        </select>
                    </div>
                </div>

                <ImageUploader label="Cover Image" value={form.image} onChange={(img) => setForm({ ...form, image: img })} />

                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Content</label>
                    <ReactQuill value={form.content} onChange={(val) => setForm({ ...form, content: val })} className="bg-white rounded-xl" theme="snow" />
                </div>


            </div>
        </Section>
    );
};

export default ArticleFormPage;
