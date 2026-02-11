const User = require('../models/User');

// Define All Possible Badges
const BADGES = {
  EARLY_BIRD: { id: 'EARLY_BIRD', name: 'Early Bird', desc: 'Joined the platform', icon: '🐦' },
  TASK_ROOKIE: { id: 'TASK_ROOKIE', name: 'Task Rookie', desc: 'Completed your first task', icon: '📝' },
  TASK_MASTER: { id: 'TASK_MASTER', name: 'Task Master', desc: 'Completed 10 tasks', icon: '🏆' },
  STREAK_WARRIOR: { id: 'STREAK_WARRIOR', name: 'Streak Warrior', desc: 'Reached a 7-day streak', icon: '🔥' },
  LEVEL_5_BOSS: { id: 'LEVEL_5_BOSS', name: 'Level 5 Boss', desc: 'Reached Level 5', icon: '👑' }
};

const checkBadges = async (userId, totalTasksCompleted) => {
  const user = await User.findById(userId);
  if (!user) return null;

  let newBadgeEarned = null;

  // Helper to add badge if missing
  const award = (badgeId) => {
    if (!user.badges.includes(badgeId)) {
      user.badges.push(badgeId);
      newBadgeEarned = BADGES[badgeId]; // Return the badge details to show a popup
    }
  };

  // --- 1. EARLY BIRD (Always given on check) ---
  award('EARLY_BIRD');

  // --- 2. TASK BASED ---
  if (totalTasksCompleted >= 1) award('TASK_ROOKIE');
  if (totalTasksCompleted >= 10) award('TASK_MASTER');

  // --- 3. STREAK BASED ---
  if (user.streak >= 7) award('STREAK_WARRIOR');

  // --- 4. LEVEL BASED ---
  if (user.level >= 5) award('LEVEL_5_BOSS');

  await user.save();
  return newBadgeEarned; // Returns the badge object if a NEW one was unlocked, or null
};

module.exports = { checkBadges, BADGES };