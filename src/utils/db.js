/**
 * GameNest Local DB Utility
 * Provides a clean API for all persistent storage.
 * Swap the implementation here to use a real backend without changing any component.
 */

const DB_KEYS = {
  USER: 'gn_user',
  SCORES: 'gn_scores',
  STATS: 'gn_stats',
  LEADERBOARD: 'gn_leaderboard',
};

// ─── Auth ────────────────────────────────────────────────────────────────────

export const saveUser = (user) => {
  localStorage.setItem(DB_KEYS.USER, JSON.stringify(user));
};

export const loadUser = () => {
  try {
    const raw = localStorage.getItem(DB_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

export const clearUser = () => {
  localStorage.removeItem(DB_KEYS.USER);
};

// ─── Scores ──────────────────────────────────────────────────────────────────

/**
 * Save a game score entry.
 * @param {string} username
 * @param {string} gameId
 * @param {string} gameName
 * @param {number} score
 * @param {object} meta - extra data (wpm, moves, time, etc.)
 */
export const saveScore = (username, gameId, gameName, score, meta = {}) => {
  const all = loadAllScores();
  const entry = {
    id: Date.now().toString(),
    username,
    gameId,
    gameName,
    score,
    meta,
    playedAt: new Date().toISOString(),
  };
  all.push(entry);
  // Keep only last 500 entries total
  const trimmed = all.slice(-500);
  localStorage.setItem(DB_KEYS.SCORES, JSON.stringify(trimmed));
  updateLeaderboard(entry);
  return entry;
};

export const loadAllScores = () => {
  try {
    const raw = localStorage.getItem(DB_KEYS.SCORES);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

export const getScoresByUser = (username) =>
  loadAllScores().filter(s => s.username === username);

export const getHighScore = (username, gameId) => {
  const scores = loadAllScores().filter(
    s => s.username === username && s.gameId === gameId
  );
  return scores.length ? Math.max(...scores.map(s => s.score)) : 0;
};

// ─── Leaderboard ─────────────────────────────────────────────────────────────

const updateLeaderboard = (entry) => {
  const lb = loadLeaderboard();
  const key = `${entry.username}__${entry.gameId}`;
  const existing = lb[key];
  if (!existing || entry.score > existing.score) {
    lb[key] = entry;
  }
  localStorage.setItem(DB_KEYS.LEADERBOARD, JSON.stringify(lb));
};

export const loadLeaderboard = () => {
  try {
    const raw = localStorage.getItem(DB_KEYS.LEADERBOARD);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
};

/** Returns top N entries globally or for a specific gameId */
export const getTopScores = (gameId = null, n = 10) => {
  const lb = loadLeaderboard();
  let entries = Object.values(lb);
  if (gameId) entries = entries.filter(e => e.gameId === gameId);
  return entries.sort((a, b) => b.score - a.score).slice(0, n);
};

// ─── User Stats ──────────────────────────────────────────────────────────────

export const loadStats = (username) => {
  try {
    const raw = localStorage.getItem(DB_KEYS.STATS);
    const all = raw ? JSON.parse(raw) : {};
    return all[username] || {
      username,
      gamesPlayed: 0,
      totalScore: 0,
      streak: 0,
      lastPlayedDate: null,
      favoriteGame: null,
      gameCounts: {},
      description: '',
      joinedAt: new Date().toISOString(),
    };
  } catch {
    return { username, gamesPlayed: 0, totalScore: 0, streak: 0 };
  }
};

export const updateStats = (username, gameId, gameName, score) => {
  const raw = localStorage.getItem(DB_KEYS.STATS);
  const all = raw ? JSON.parse(raw) : {};
  const stats = loadStats(username);

  stats.gamesPlayed += 1;
  stats.totalScore += score;

  // Streak logic
  const today = new Date().toDateString();
  if (stats.lastPlayedDate === today) {
    // same day, no streak change
  } else if (stats.lastPlayedDate === new Date(Date.now() - 86400000).toDateString()) {
    stats.streak += 1;
  } else {
    stats.streak = 1;
  }
  stats.lastPlayedDate = today;

  // Favorite game
  stats.gameCounts = stats.gameCounts || {};
  stats.gameCounts[gameId] = (stats.gameCounts[gameId] || 0) + 1;
  stats.favoriteGame = Object.entries(stats.gameCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  all[username] = stats;
  localStorage.setItem(DB_KEYS.STATS, JSON.stringify(all));
  return stats;
};

export const saveDescription = (username, description) => {
  const raw = localStorage.getItem(DB_KEYS.STATS);
  const all = raw ? JSON.parse(raw) : {};
  const stats = loadStats(username);
  stats.description = description;
  all[username] = stats;
  localStorage.setItem(DB_KEYS.STATS, JSON.stringify(all));
};
