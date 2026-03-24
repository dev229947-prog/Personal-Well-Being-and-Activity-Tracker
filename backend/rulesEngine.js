/**
 * Rule-based insights engine for well-being activities.
 */

function getInsight(activityType, value) {
  const type = activityType.toLowerCase().trim();

  const rules = {
    sleep: sleepInsight,
    coffee: coffeeInsight,
    exercise: exerciseInsight,
    meditation: meditationInsight,
    breaks: breaksInsight,
  };

  const handler = rules[type];
  if (handler) return handler(value);

  return `Keep tracking your ${activityType}! Consistency is key to improvement.`;
}

function sleepInsight(value) {
  if (value < 6) return "You may feel tired today. Try to get more rest.";
  if (value <= 9) return "Your sleep is within healthy range. Good job!";
  return "You had plenty of rest. Your energy levels should be high.";
}

function coffeeInsight(value) {
  if (value <= 3) return "Coffee intake is moderate.";
  return "Too much coffee may affect sleep later.";
}

function exerciseInsight(value) {
  if (value < 30) return "A short exercise is better than none. Keep it up!";
  return "Great job exercising today! Energy and mood should improve.";
}

function meditationInsight(value) {
  if (value < 10) return "Even a few minutes of meditation helps. Try to increase gradually.";
  if (value <= 30) return "Nice meditation session! Your focus should be improved today.";
  return "Extended meditation! You should feel very centered and calm.";
}

function breaksInsight(value) {
  if (value < 3) return "Try to take more breaks throughout the day to avoid burnout.";
  if (value <= 6) return "Good number of breaks! This helps maintain productivity.";
  return "Plenty of breaks today. Make sure you're also staying productive!";
}

module.exports = { getInsight };
