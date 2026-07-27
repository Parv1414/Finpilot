import { GoogleGenerativeAI } from '@google/generative-ai';

const MODEL = 'gemini-3.6-flash';
const CACHE_TTL = 5 * 60 * 1000;

let genAI = null;
const responseCache = new Map();

function getGenAI() {
  if (!genAI) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY is not set in server/.env');
    }
    genAI = new GoogleGenerativeAI(key);
  }
  return genAI;
}

function cacheKey(type, userId, message) {
  return `${type}:${userId}:${message}`;
}

function getCached(key) {
  const entry = responseCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL) {
    responseCache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data) {
  responseCache.set(key, { data, ts: Date.now() });
  if (responseCache.size > 500) {
    const oldest = [...responseCache.entries()].sort((a, b) => a[1].ts - b[1].ts)[0];
    if (oldest) responseCache.delete(oldest[0]);
  }
}

function buildCompactSummary(user, expenses, budgets, goals) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const monthExpenses = expenses.filter(e => new Date(e.date) >= startOfMonth);
  const totalIncome = monthExpenses.filter(e => e.type === 'income').reduce((s, e) => s + e.amount, 0);
  const totalExpenses = monthExpenses.filter(e => e.type === 'expense').reduce((s, e) => s + e.amount, 0);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1) : '0.0';

  const byCat = {};
  for (const e of monthExpenses) {
    if (e.type === 'expense') byCat[e.category] = (byCat[e.category] || 0) + e.amount;
  }
  const topCategories = Object.entries(byCat).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const monthBudgets = budgets.filter(b => b.month === thisMonth);
  const overBudgetCount = monthBudgets.filter(b => b.spent > b.limit).length;
  const totalBudgetLimit = monthBudgets.reduce((s, b) => s + b.limit, 0);
  const totalBudgetSpent = monthBudgets.reduce((s, b) => s + b.spent, 0);

  const activeGoals = goals.filter(g => g.status !== 'Achieved');
  const goalsSummary = activeGoals.map(g =>
    `${g.title}: ₹${g.currentAmount.toLocaleString('en-IN')}/${g.targetAmount.toLocaleString('en-IN')}`
  ).join('; ') || 'none';

  return [
    `User: ${user.name}`,
    `Period: ${now.toLocaleString('en-IN', { month: 'long', year: 'numeric' })}`,
    `Income: ₹${totalIncome.toLocaleString('en-IN')} | Expenses: ₹${totalExpenses.toLocaleString('en-IN')} | Savings: ${savingsRate}%`,
    `Top categories: ${topCategories.map(([c, a]) => `${c}(₹${a.toLocaleString('en-IN')})`).join(', ') || 'none'}`,
    `Budgets: ₹${totalBudgetSpent.toLocaleString('en-IN')}/${totalBudgetLimit.toLocaleString('en-IN')} (${overBudgetCount} over)`,
    `Goals: ${goalsSummary}`,
  ].join('\n');
}

export async function generateInsights(user, expenses, budgets, goals) {
  const key = cacheKey('insights', user._id, 'default');
  const cached = getCached(key);
  if (cached) return cached;

  const summary = buildCompactSummary(user, expenses, budgets, goals);

  const prompt = `You are FinPilot AI, a personal finance advisor for users in India.
Based on this financial summary, return EXACTLY 5 JSON insights (icon, title, message, severity).
Be concise, use ₹ amounts. Return ONLY the JSON array.

${summary}`;

  try {
    const genModel = getGenAI().getGenerativeModel({ model: MODEL });
    console.log(`[Gemini] Calling ${MODEL} generateInsights for user=${user._id}`);
    const result = await genModel.generateContent(prompt);
    const text = result.response.text().trim();
    const jsonStart = text.indexOf('[');
    const jsonEnd = text.lastIndexOf(']');
    if (jsonStart === -1 || jsonEnd === -1) return fallbackInsights(expenses, budgets, goals);
    const parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
    const insights = Array.isArray(parsed) ? parsed.slice(0, 5) : fallbackInsights(expenses, budgets, goals);
    if (insights.length > 0) setCache(key, insights);
    return insights;
  } catch (error) {
    console.error('Gemini generateInsights error:', error.message || error);
    const fallback = fallbackInsights(expenses, budgets, goals);
    if (fallback.length > 0) setCache(key, fallback);
    return fallback;
  }
}

export async function chatWithAI(user, expenses, budgets, goals, message, history = []) {
  const key = cacheKey('chat', user._id, message);
  const cached = getCached(key);
  if (cached) return cached;

  const summary = buildCompactSummary(user, expenses, budgets, goals);

  const systemPrompt = `You are FinPilot AI, a friendly personal finance advisor for users in India.
Answer questions using this financial summary. Use ₹. Be concise (2-4 sentences).

${summary}`;

  const historyParts = history.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  try {
    const genModel = getGenAI().getGenerativeModel({ model: MODEL });

    console.log(`[Gemini] Calling ${MODEL} chatWithAI for user=${user._id} msg="${message.slice(0, 60)}"`);
    const chat = genModel.startChat({
      history: [
        { role: 'user', parts: [{ text: 'Here is my financial summary.' }] },
        { role: 'model', parts: [{ text: 'I understand your finances. Ask me anything.' }] },
        ...historyParts,
      ],
      systemInstruction: {
        role: 'system',
        parts: [{ text: systemPrompt }],
      },
    });

    const result = await chat.sendMessage(message);
    const reply = result.response.text();
    setCache(key, reply);
    return reply;
  } catch (error) {
    const errMsg = error.message || String(error);
    console.error('Gemini chatWithAI error:', errMsg);

    if (errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('RATE_LIMIT') || errMsg.includes('Too Many')) {
      throw new Error(
        'The AI advisor is currently busy (rate limit reached). ' +
        'Gemini free tier has limited requests per minute. Please wait a moment and try again.'
      );
    }
    if (
      errMsg.includes('API_KEY') || errMsg.includes('API key') ||
      errMsg.includes('apiKey') || errMsg.includes('403') ||
      errMsg.includes('unauthorized') || errMsg.includes('permission')
    ) {
      throw new Error('AI service configuration error. Check that GEMINI_API_KEY in server/.env is valid.');
    }
    if (errMsg.includes('SAFETY') || errMsg.includes('blocked') || errMsg.includes('safety')) {
      throw new Error('AI response was blocked by safety filters. Try rephrasing your question.');
    }

    throw new Error('Failed to get AI response. Server error: ' + errMsg.slice(0, 200));
  }
}

function fallbackInsights(expenses, budgets, goals) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthExpenses = expenses.filter(e => new Date(e.date) >= startOfMonth);
  const totalExpenses = monthExpenses.filter(e => e.type === 'expense').reduce((s, e) => s + e.amount, 0);
  const totalIncome = monthExpenses.filter(e => e.type === 'income').reduce((s, e) => s + e.amount, 0);
  const insights = [];

  if (totalIncome > 0) {
    const rate = ((totalIncome - totalExpenses) / totalIncome) * 100;
    insights.push({
      icon: rate > 20 ? '📈' : '⚠️',
      title: rate > 20 ? 'Healthy Savings Rate' : 'Low Savings Rate',
      message: `Savings rate is ${rate.toFixed(1)}%. ${rate > 20 ? 'Great job!' : 'Try to save at least 20%.'}`,
      severity: rate > 20 ? 'success' : 'warning',
    });
  }

  const byCat = {};
  for (const e of monthExpenses) {
    if (e.type === 'expense') byCat[e.category] = (byCat[e.category] || 0) + e.amount;
  }
  const top = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0];
  if (top) {
    insights.push({
      icon: '📊', title: `Top: ${top[0]}`,
      message: `₹${Math.round(top[1]).toLocaleString('en-IN')} on ${top[0]}.`,
      severity: 'info',
    });
  }

  const overBudget = budgets.filter(b => b.spent > b.limit);
  if (overBudget.length > 0) {
    insights.push({
      icon: '⚠️', title: 'Over Budget',
      message: `${overBudget[0].category} is over by ₹${Math.round(overBudget[0].spent - overBudget[0].limit).toLocaleString('en-IN')}.`,
      severity: 'warning',
    });
  }

  const nearComplete = goals.filter(g => g.currentAmount / g.targetAmount >= 0.8);
  if (nearComplete.length > 0) {
    const g = nearComplete[0];
    insights.push({
      icon: '🎯', title: 'Goal Close',
      message: `${Math.round(g.currentAmount / g.targetAmount * 100)}% toward "${g.title}". ₹${Math.round(g.targetAmount - g.currentAmount).toLocaleString('en-IN')} left.`,
      severity: 'success',
    });
  }

  if (totalExpenses > 0) {
    insights.push({
      icon: '💡', title: 'Tip',
      message: totalExpenses > totalIncome * 1.5
        ? 'Reduce discretionary spending to stay within your means.'
        : 'Review subscriptions and UPI payments for small savings.',
      severity: 'info',
    });
  }
  return insights;
}
