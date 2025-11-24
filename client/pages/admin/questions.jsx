import { useEffect, useState } from 'react';
import api from '@/utils/api';

export default function QuestionAdmin() {
  const [questions, setQuestions] = useState([]);
  const [topicFilter, setTopicFilter] = useState('');
  const [topics, setTopics] = useState([]);
  const [refreshToggle, setRefreshToggle] = useState(false);

  const loadQuestions = async () => {
    const res = await api.get('/admin/questions', {
      params: { topic: topicFilter || undefined },
    });
    setQuestions(res.data.items);
    const topicSet = new Set(res.data.items.map(q => q.topic));
    setTopics(['', ...topicSet]);
  };

  useEffect(() => {
    loadQuestions();
  }, [topicFilter, refreshToggle]);

  const deleteQuestion = async (id) => {
    if (!confirm('Delete this question?')) return;
    await api.delete(`/admin/questions/${id}`);
    setRefreshToggle(v => !v);
  };

  return (
    <div className="max-w-5xl mx-auto bg-white shadow rounded-xl p-6 mt-6">
      <h1 className="text-2xl font-bold mb-4">Question Bank Admin</h1>

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <label className="font-medium">Filter by topic:</label>
        <select
          value={topicFilter}
          onChange={e => setTopicFilter(e.target.value)}
          className="border p-2 rounded"
        >
          {topics.map(t => (
            <option key={t} value={t}>{t || 'All'}</option>
          ))}
        </select>
        <button
          onClick={loadQuestions}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Topic</th>
              <th className="p-2">Question</th>
              <th className="p-2">Difficulty</th>
              <th className="p-2">Source</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map(q => (
              <tr key={q._id} className="border-t">
                <td className="p-2">{q.topic}</td>
                <td className="p-2 max-w-md">{q.text}</td>
                <td className="p-2">{q.difficulty}</td>
                <td className="p-2">{q.sourceFile}</td>
                <td className="p-2">
                  <button
                    onClick={() => deleteQuestion(q._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!questions.length && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No questions to display.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
