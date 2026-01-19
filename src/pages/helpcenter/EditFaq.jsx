// src/pages/faqs/EditFaq.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFAQs, updateFAQ } from "../../store/slices/faq";

import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EditFaq = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { faqs = [], loading } = useSelector((s) => s.faq);



  const [form, setForm] = useState({ question: "", answer: "",  });

  useEffect(() => {
    dispatch(getFAQs());
  }, [dispatch]);

  useEffect(() => {
    if (faqs.length > 0 && id) {
      const found = faqs.find((f) => f._id === id);
      if (found) {
        setForm({
          question: found.question || "",
          answer: found.answer || "",
        });
      }
    }
  }, [faqs, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.question.trim() || !form.answer.trim()) {
      toast.error("Please fill all fields.");
      return;
    }
    try {
      await dispatch(updateFAQ({ id, formData: form })).unwrap();
      navigate("/faqs");
    } catch (err) {
    //   toast.error("Failed to update FAQ");
      console.error(err);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-8xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Edit FAQ</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg">
       

        <label className="block">
          <span className="font-medium">Question</span>
          <input
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
          />
        </label>

        <label className="block">
          <span className="font-medium">Answer</span>
          <textarea
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
            rows={6}
            value={form.answer}
            onChange={(e) => setForm({ ...form, answer: e.target.value })}
          />
        </label>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            className="px-4 py-2 border rounded-md"
            onClick={() => navigate("/faqs")}
          >
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 rounded-md bg-slate-900 text-white">
            Update FAQ
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditFaq;
