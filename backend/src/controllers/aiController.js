// Intelligent AI task description generator with Graceful Degradation & Heuristic Fallback
let lastRequestTime = 0;

exports.generateDescription = async (req, res) => {
  const { title } = req.body;

  if (!title || title.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Task title is required' });
  }

  // Rate Limiting: Minimum 3 seconds between AI calls
  const now = Date.now();
  if (now - lastRequestTime < 2500) {
    return res.status(429).json({
      success: false,
      message: 'Rate limit active: Please wait 3 seconds before generating another AI description.'
    });
  }
  lastRequestTime = now;

  const apiKey = process.env.OPENAI_API_KEY || '';

  try {
    // If real API key is provided and not default placeholder, attempt external LLM call
    if (apiKey && apiKey !== 'your_openai_or_gemini_api_key_here' && !apiKey.startsWith('demo_invalid')) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an agile software productivity assistant. Generate a concise, 2-sentence actionable task description and suggested priority (Low, Medium, High, or Critical).'
            },
            {
              role: 'user',
              content: `Generate description and priority for software task: "${title}"`
            }
          ],
          max_tokens: 100,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API responded with status ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;

      return res.status(200).json({
        success: true,
        source: 'OPENAI_API',
        description: content,
        suggestedPriority: title.toLowerCase().includes('fix') || title.toLowerCase().includes('error') ? 'High' : 'Medium',
        fallback: false
      });
    }

    // GRACEFUL DEGRADATION FALLBACK:
    // When external API is unreachable, quota exceeded, or key missing:
    // Generate intelligent contextual software engineering description locally so application never breaks!
    console.log('[AI Gateway] Graceful degradation activated: Generating local contextual suggestion');
    
    let priority = 'Medium';
    let localDesc = '';

    const lower = title.toLowerCase();
    if (lower.includes('docker') || lower.includes('container')) {
      priority = 'High';
      localDesc = 'Package application dependencies into lightweight Docker containers, write Dockerfile multi-stage builds, and configure docker-compose for inter-service communication.';
    } else if (lower.includes('ci') || lower.includes('test') || lower.includes('action')) {
      priority = 'High';
      localDesc = 'Establish automated continuous integration workflow with GitHub Actions matrix builds, executing automated unit and integration tests on pull requests.';
    } else if (lower.includes('cache') || lower.includes('redis') || lower.includes('perf')) {
      priority = 'Medium';
      localDesc = 'Implement server-side in-memory caching with optimal TTL and automatic eviction policies on write operations to minimize redundant database lookups.';
    } else if (lower.includes('auth') || lower.includes('jwt') || lower.includes('security')) {
      priority = 'Critical';
      localDesc = 'Implement robust token-based authentication middleware validating signed Bearer JWTs and hashing credentials with bcrypt.';
    } else {
      localDesc = `Define requirement specifications, design component architecture, and verify implementation acceptance criteria for "${title}".`;
    }

    return res.status(200).json({
      success: true,
      source: 'GRACEFUL_DEGRADATION_FALLBACK',
      description: localDesc,
      suggestedPriority: priority,
      fallback: true,
      notice: 'Generated via fallback heuristic engine: Core application continues functioning uninterrupted.'
    });

  } catch (err) {
    console.warn('[AI Error Caught]', err.message);
    // Even upon unexpected network error, return graceful fallback rather than 500 error
    return res.status(200).json({
      success: true,
      source: 'ERROR_RECOVERY_FALLBACK',
      description: `Draft actionable workflow, document unit tests, and review code deliverables for: "${title}".`,
      suggestedPriority: 'Medium',
      fallback: true,
      errorInfo: err.message
    });
  }
};
