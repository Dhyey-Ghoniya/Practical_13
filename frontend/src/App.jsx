import React, { useState } from 'react';

function App() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Automate CI/CD Pipeline with GitHub Actions',
      description: 'Establish automated continuous integration workflow with GitHub Actions matrix builds, executing automated unit and integration tests on pull requests.',
      priority: 'High',
      aiGenerated: true
    },
    {
      id: 2,
      title: 'Implement In-Memory Caching with node-cache',
      description: 'Implement server-side in-memory caching with optimal TTL and automatic eviction policies on write operations to minimize redundant database lookups.',
      priority: 'Medium',
      aiGenerated: true
    }
  ]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiSource, setAiSource] = useState(null);

  const handleGenerateAi = async () => {
    if (!title.trim()) {
      alert('Please enter a task title first!');
      return;
    }
    setLoadingAi(true);
    setAiSource(null);

    try {
      const res = await fetch('http://localhost:5005/api/ai/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setDescription(data.description);
        if (data.suggestedPriority) setPriority(data.suggestedPriority);
        setAiSource(data.source);
      }
    } catch (err) {
      // Graceful frontend recovery
      setDescription(`Task description for ${title}: Define project scope, implement core modules, and execute validation tests.`);
      setAiSource('CLIENT_FALLBACK');
    } finally {
      setLoadingAi(false);
    }
  };

  const handleSaveTask = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const newTask = {
      id: Date.now(),
      title: title.trim(),
      description: description || 'No description provided.',
      priority,
      aiGenerated: Boolean(aiSource)
    };
    setTasks([newTask, ...tasks]);
    setTitle('');
    setDescription('');
    setAiSource(null);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <header style={{ background: '#1e293b', padding: '1.25rem 2rem', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.4rem', color: '#38bdf8', margin: 0 }}>🤖 AI-Powered Task Management Assistant</h1>
        <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>ITUE301: Practical 13 | 24CS024</span>
      </header>

      <main style={{ maxWidth: '980px', margin: '2rem auto', padding: '0 1.5rem' }}>
        {/* Form Card */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '2rem', marginBottom: '2rem' }}>
          <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '0.3rem 0.8rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 600 }}>
            Secure Server-Side AI Integration
          </span>
          <h2 style={{ fontSize: '1.6rem', marginTop: '0.75rem', marginBottom: '0.5rem' }}>Create New Task with AI Generation</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            Enter a title and let the backend AI assistant propose a smart description and priority level. The API key is securely protected on the server.
          </p>

          <form onSubmit={handleSaveTask}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', color: '#cbd5e1', marginBottom: '0.5rem', fontWeight: 500 }}>Task Title</label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Implement Docker Multi-stage Builds"
                  style={{ flex: 1, background: '#0f172a', border: '1px solid #334155', color: '#fff', padding: '0.75rem 1rem', borderRadius: '8px', outline: 'none' }}
                />
                <button
                  type="button"
                  onClick={handleGenerateAi}
                  disabled={loadingAi}
                  style={{ background: 'linear-gradient(135deg, #0284c7, #6366f1)', color: '#fff', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  {loadingAi ? '⏳ Generating...' : '✨ Propose with AI'}
                </button>
              </div>
            </div>

            {aiSource && (
              <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#38bdf8' }}>
                  🤖 <strong>AI Suggestion Generated</strong> (Engine: <code>{aiSource}</code>)
                </span>
                <span style={{ color: '#94a3b8' }}>Editable below before saving</span>
              </div>
            )}

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', color: '#cbd5e1', marginBottom: '0.5rem', fontWeight: 500 }}>Task Description (Editable)</label>
              <textarea
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description will be generated by AI or typed manually..."
                style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#fff', padding: '0.75rem 1rem', borderRadius: '8px', outline: 'none', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ color: '#cbd5e1', marginRight: '0.75rem', fontWeight: 500 }}>Priority:</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  style={{ background: '#0f172a', border: '1px solid #334155', color: '#38bdf8', padding: '0.4rem 0.8rem', borderRadius: '6px', outline: 'none' }}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              {/* Responsible AI Disclaimer Banner */}
              <div style={{ fontSize: '0.8rem', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                ⚠️ <strong>Responsible AI:</strong> Suggestions are machine-generated. Review before saving.
              </div>
            </div>

            <button type="submit" style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '0.75rem 1.75rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
              💾 Save Task
            </button>
          </form>
        </div>

        {/* Existing Tasks List */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '2rem' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem' }}>Current Tasks & AI Annotations</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {tasks.map(t => (
              <div key={t.id} style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ maxWidth: '75%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.35rem' }}>
                    <strong style={{ fontSize: '1.05rem', color: '#f1f5f9' }}>{t.title}</strong>
                    {t.aiGenerated && (
                      <span style={{ background: 'rgba(192, 132, 252, 0.15)', color: '#c084fc', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                        ✨ AI Assisted
                      </span>
                    )}
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>{t.description}</p>
                </div>
                <span style={{ background: t.priority === 'Critical' ? 'rgba(239, 68, 68, 0.15)' : t.priority === 'High' ? 'rgba(249, 115, 22, 0.15)' : 'rgba(56, 189, 248, 0.15)', color: t.priority === 'Critical' ? '#f87171' : t.priority === 'High' ? '#fb923c' : '#38bdf8', padding: '0.25rem 0.65rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                  {t.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;