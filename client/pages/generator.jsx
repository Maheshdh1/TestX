import { useState } from 'react';
import api from '@/utils/api';
import { downloadDoc } from '@/utils/downloadDoc';
import { downloadAnswerKeyDoc } from '@/utils/downloadAnswerKeyDoc';

export default function Generator() {
  const [files, setFiles] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [count, setCount] = useState(20);
  const [loading, setLoading] = useState(false);

  const uploadAndParse = async () => {
    if (!files.length) return;
    setLoading(true);
    try {
      const formData = new FormData();
      files.forEach(f => formData.append('files', f));
      const res = await api.post('/upload/multiple', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setQuestions(res.data.questions);
      setTopics(['All', ...res.data.topics]);
    } catch (err) {
      console.error(err);
      alert('Failed to upload/parse');
    } finally {
      setLoading(false);
    }
  };

  const generateBoth = async () => {
    let filtered = questions;
    if (selectedTopic !== 'All') {
      filtered = questions.filter(q => q.topic === selectedTopic);
    }
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count);

    if (!selected.length) {
      alert('No questions available for this topic / count');
      return;
    }

    await downloadDoc(selected.map(q => q.text));
    await downloadAnswerKeyDoc(selected);
  };

  return (
    <div className="min-h-[80vh] flex items-start justify-center">
      <div className="max-w-3xl w-full bg-white shadow-xl rounded-xl p-8 mt-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <span>📘</span> <span>Question Paper Generator</span>
        </h1>

        <div className="mb-8 border border-gray-200 rounded-lg p-6 bg-gray-50">
          <h2 className="text-lg font-semibold mb-3">Upload Question Banks (.docx)</h2>
          <input
            type="file"
            accept=".docx"
            multiple
            onChange={e => setFiles(Array.from(e.target.files || []))}
            className="w-full border p-2 rounded-md bg-white"
          />
          <button
            onClick={uploadAndParse}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow disabled:opacity-60"
            disabled={loading || !files.length}
          >
            {loading ? 'Processing...' : 'Upload & Merge'}
          </button>
        </div>

        {questions.length > 0 && (
          <>
            <div className="mb-6 flex justify-between text-gray-700">
              <p><strong>Total Questions:</strong> {questions.length}</p>
              <p><strong>Topics Found:</strong> {topics.length - 1}</p>
            </div>

            <div className="mb-8 border border-gray-200 rounded-lg p-6 bg-gray-50">
              <label className="block font-medium mb-2">Select Topic</label>
              <select
                value={selectedTopic}
                onChange={e => setSelectedTopic(e.target.value)}
                className="w-full border p-2 rounded-md mb-4"
              >
                {topics.map(topic => (
                  <option key={topic}>{topic}</option>
                ))}
              </select>

              <label className="block font-medium mb-2">Number of Questions</label>
              <input
                type="number"
                min={1}
                value={count}
                onChange={e => setCount(Number(e.target.value))}
                className="w-full border p-2 rounded-md"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={generateBoth}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg text-lg font-semibold shadow"
              >
                Generate Paper + Answer Key
              </button>
            </div>
          </>
        )}

        {questions.length === 0 && (
          <p className="text-gray-500 text-sm">
            Upload one or more .docx files with questions to get started.
          </p>
        )}
      </div>
    </div>
  );
}
