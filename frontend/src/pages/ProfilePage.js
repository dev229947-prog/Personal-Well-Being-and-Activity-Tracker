import React, { useEffect, useState, useRef } from "react";
import jsPDF from "jspdf";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  getWorkoutLogs, getSleepLogs, getNutritionLogs, getMoodLogs,
  getGoals, getJournalEntries, getSchedule
} from "../services/api";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Report state
  const [reportPeriod, setReportPeriod] = useState("day");
  const [report, setReport] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState("");

  // Ref for PDF export
  const reportRef = useRef();

  // PDF Download Handler (medical report style)
  const handleDownloadPDF = async () => {
    // Title
    // Period as date range (declare and initialize at the very top)
    let periodLabel = '';
    let periodStart, periodEnd;
    const now = new Date();
    if (report.period === 'day') {
      periodStart = periodEnd = now;
      periodLabel = `Today (${now.toLocaleDateString()})`;
    } else if (report.period === 'week') {
      const day = now.getDay();
      periodStart = new Date(now); periodStart.setDate(now.getDate() - day);
      periodEnd = now;
      periodLabel = `This Week (${periodStart.toLocaleDateString()} - ${periodEnd.toLocaleDateString()})`;
    } else if (report.period === 'month') {
      periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
      periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      periodLabel = `${periodStart.toLocaleString('default', { month: 'long', year: 'numeric' })} (${periodStart.toLocaleDateString()} - ${periodEnd.toLocaleDateString()})`;
    }
    // --- BEGIN: Advanced Wellness Score & Analytics ---
    // Calculate period days for averages
    let periodDays = 1;
    if (report.period === 'month') {
      periodDays = periodEnd.getDate() - periodStart.getDate() + 1;
    } else if (report.period === 'week') {
      periodDays = 7;
    }
        // Sleep average
        const avgSleep = (report.sleepHours / periodDays).toFixed(1);
        // Exercise average
        const avgExercise = (report.exerciseMins / periodDays).toFixed(1);
        // Nutrition average per log
        const avgCalories = report.nutritionCount > 0 ? (report.totalCalories / report.nutritionCount).toFixed(0) : '-';
        // Nutrition percent of recommended
        const recommendedCalories = 2000 * periodDays;
        const nutritionPercent = report.totalCalories > 0 ? ((report.totalCalories / recommendedCalories) * 100).toFixed(0) : '0';
        // --- Wellness Score Model ---
        // 1. Sleep (25)
        const recommendedSleep = 7 * periodDays;
        let sleepScore = Math.round((report.sleepHours / recommendedSleep) * 25);
        if (sleepScore > 25) sleepScore = 25;
        if (sleepScore < 0) sleepScore = 0;
        // 2. Exercise (25)
        const recommendedExercise = 150 * (periodDays / 7);
        let exerciseScore = Math.round((report.exerciseMins / recommendedExercise) * 25);
        if (exerciseScore > 25) exerciseScore = 25;
        if (exerciseScore < 0) exerciseScore = 0;
        // 3. Nutrition Tracking (20)
        const idealNutritionLogs = periodDays * 2;
        let nutritionScore = Math.round((report.nutritionCount / idealNutritionLogs) * 20);
        if (nutritionScore > 20) nutritionScore = 20;
        if (nutritionScore < 0) nutritionScore = 0;
        // 4. Emotional Health (10)
        let moodScore = Math.round((report.moodCount / periodDays) * 10);
        if (moodScore > 10) moodScore = 10;
        if (moodScore < 0) moodScore = 0;
        // 5. Habit Consistency (10)
        let consistencyScore = 0;
        let consistencyMetrics = 0;
        if (report.workoutCount > 0) consistencyMetrics++;
        if (report.nutritionCount > periodDays * 0.5) consistencyMetrics++;
        if (report.sleepHours > recommendedSleep * 0.5) consistencyMetrics++;
        if (report.scheduleCount > periodDays * 0.5) consistencyMetrics++;
        consistencyScore = Math.round((consistencyMetrics / 4) * 10);
        // 6. Personal Growth (5)
        let journalingScore = Math.round((report.journalCount / (periodDays / 5)) * 5);
        if (journalingScore > 5) journalingScore = 5;
        if (journalingScore < 0) journalingScore = 0;
        // 7. Goal Progress (5)
        let goalScore = Math.round(((report.completedGoals + report.activeGoals * 0.5) / 2) * 5);
        if (goalScore > 5) goalScore = 5;
        if (goalScore < 0) goalScore = 0;
        // Final Score
        const finalScore = sleepScore + exerciseScore + nutritionScore + moodScore + consistencyScore + journalingScore + goalScore;
        // --- END: Advanced Wellness Score & Analytics ---
    if (!report) return;
    const pdf = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
    const pageHeight = pdf.internal.pageSize.getHeight();
    let y = 40;
    // Modern color palette
    const primaryColor = '#1976d2'; // blue
    const accentColor = '#43a047'; // green
    const sectionBg = '#f5f7fa'; // light gray
    const dividerColor = '#e0e0e0';
    // Helper: draw section header
    function sectionHeader(text) {
      pdf.setFillColor(primaryColor);
      pdf.setTextColor('#fff');
      pdf.setFontSize(16);
      pdf.setFont(undefined, 'bold');
      pdf.rect(40, y, 520, 28, 'F');
      pdf.text(text, 50, y + 20);
      y += 36;
      pdf.setTextColor('#222');
      pdf.setFontSize(11);
      pdf.setFont(undefined, 'normal');
    }
    // Helper: draw section background
    function sectionBgBox(height) {
      pdf.setFillColor(sectionBg);
      pdf.rect(40, y, 520, height, 'F');
    }
    // Helper: divider line
    function divider() {
      pdf.setDrawColor(dividerColor);
      pdf.setLineWidth(1);
      pdf.line(40, y, 560, y);
      y += 8;
    }
    // Helper: page break
    function checkPageBreak(extra = 0) {
      if (y + extra > pageHeight - 60) {
        pdf.addPage();
        y = 40;
      }
    }
    // Title
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(28);
    pdf.setTextColor(primaryColor);
    pdf.text('Wellness Medical Report', 40, y);
    y += 36;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    pdf.setTextColor('#222');
    let lines = pdf.splitTextToSize(`Name: ${user?.username || 'Guest'}`, 480);
    pdf.text(lines, 40, y);
    y += lines.length * 15;
    lines = pdf.splitTextToSize(`Period: ${periodLabel}`, 480);
    pdf.text(lines, 40, y);
    y += lines.length * 15 + 6;
    divider();

    // Section: Behavioural Pattern Analysis
    checkPageBreak(90);
    sectionHeader('Behavioural Pattern Analysis');
    sectionBgBox(80);
    y += 8;
    let patternText = `During this period, you recorded ${report.sleepHours} hours of total sleep, ${report.exerciseMins} minutes of exercise, ${report.nutritionCount} nutrition logs, ${report.moodCount} mood logs, ${report.workoutCount} workouts, ${report.journalCount} journal entries, and ${report.scheduleCount} scheduled activities.`;
    // Pattern logic
    if (report.exerciseMins < 30 && report.nutritionCount < 3) {
      patternText += ' This suggests a low activity and limited health tracking pattern.';
      patternText += ' Low physical activity combined with irregular health logging may indicate inconsistent wellness monitoring and reduced motivation for routine health habits.';
    }
    if (report.exerciseMins < 30) {
      patternText += ' Because exercise was recorded only once or twice, there is insufficient activity to support cardiovascular conditioning or metabolic improvement.';
    }
    if (report.sleepHours < 35) {
      patternText += ' Sleep is below the recommended average for the period.';
    }
    // Dynamically calculate height for patternText
    const patternLines = pdf.splitTextToSize(patternText, 480);
    pdf.text(patternLines, 50, y);
    y += patternLines.length * 15 + 10;

    // Section: Interconnected Wellness Factors
    checkPageBreak(90);
    sectionHeader('Interconnected Wellness Factors');
    sectionBgBox(80);
    y += 8;
    const interText = [
      `Sleep and Mood: Adequate sleep supports emotional stability and cognitive function. ${report.moodCount === 0 ? 'Because no mood logs were recorded, it is difficult to determine whether sleep patterns influenced mood during this period.' : ''}`,
      `Exercise and Weight Trend: Physical activity contributes significantly to calorie expenditure and metabolic balance. With only ${report.exerciseMins} minutes of exercise, energy expenditure is likely low, which may contribute to weight gain if the pattern continues.`,
      `Nutrition and Weight Management: ${report.nutritionCount === 0 ? 'No nutrition entries were recorded, which suggests that dietary data is incomplete.' : `There were ${report.nutritionCount} nutrition entries, totaling ${report.totalCalories} calories.`} Without consistent nutrition tracking, it is difficult to accurately evaluate caloric balance and its effect on weight trends.`,
      `Routine Structure and Behaviour Consistency: ${report.journalCount === 0 && report.scheduleCount === 0 ? 'No journal entries or scheduled activities were recorded. Research shows structured routines improve adherence to healthy habits such as exercise and sleep regularity.' : ''}`
    ];
    interText.forEach(line => {
      const lines = pdf.splitTextToSize(line, 480);
      pdf.text(lines, 50, y);
      y += lines.length * 15 + 5;
    });
    y += 10;

    // Section: Risk Indicators Table
    checkPageBreak(110);
    sectionHeader('Risk Indicators');
    sectionBgBox(90);
    y += 8;
    const riskTable = [
      ['Category', 'Status', 'Interpretation'],
      ['Sleep', report.sleepHours < 35 ? 'Low' : 'Normal', report.sleepHours < 35 ? 'Below recommended average' : 'Within recommended range'],
      ['Exercise', report.exerciseMins < 60 ? 'Low' : 'Normal', report.exerciseMins < 60 ? 'Insufficient physical activity' : 'Adequate activity'],
      ['Nutrition Tracking', report.nutritionCount < 3 ? 'Incomplete' : 'OK', report.nutritionCount < 3 ? 'Insufficient data for dietary assessment' : 'Sufficient data'],
      ['Mood Monitoring', report.moodCount === 0 ? 'Missing' : 'OK', report.moodCount === 0 ? 'Emotional wellbeing not assessed' : 'Mood tracked'],
      ['Weight Trend', 'See below', 'See Weight Analysis section'],
    ];
    let rx = 50, colWidths = [100, 80, 300];
    riskTable.forEach((row, i) => {
      checkPageBreak(18);
      let x = rx;
      row.forEach((cell, j) => {
        let cellLines = pdf.splitTextToSize(String(cell), colWidths[j] - 10);
        pdf.text(cellLines, x, y, { maxWidth: colWidths[j] - 10 });
        x += colWidths[j];
      });
      y += (i === 0 ? 18 : 16);
    });
    y += 16;

    // Section: Key Health Metrics Table
    checkPageBreak(190);
    sectionHeader('Key Health Metrics');
    sectionBgBox(120);
    y += 8;
    const summary = [
      [`Total Sleep`, `${report.sleepHours} hours`],
      [`Caffeine Intake`, `${report.caffeine} times`],
      [`Exercise`, `${report.exerciseMins} minutes`],
      [`Workouts`, `${report.workoutCount}`],
      [`Mood Logs`, `${report.moodCount} (Avg: ${report.avgMood})`],
      [`Nutrition Logs`, `${report.nutritionCount} (Total Calories: ${report.totalCalories})`],
      [`Active Goals`, `${report.activeGoals}`],
      [`Completed Goals`, `${report.completedGoals}`],
      [`Journal Entries`, `${report.journalCount}`],
      [`Scheduled Activities`, `${report.scheduleCount}`],
    ];
    summary.forEach(([label, value]) => {
      checkPageBreak(18);
      let labelLines = pdf.splitTextToSize(`${label}:`, 180);
      let valueLines = pdf.splitTextToSize(value, 260);
      pdf.text(labelLines, 50, y);
      pdf.text(valueLines, 250, y);
      y += Math.max(labelLines.length, valueLines.length) * 15 + 2;
    });
    y += 16;

    // Section: Weight/BMI/Projection (improved logic)
    checkPageBreak(100);
    sectionHeader('Weight Trend Analysis');
    sectionBgBox(90);
    y += 8;
    let weightText = 'No weight data available.';
    try {
      const weightLogs = await (await import('../services/api')).getWeightLogs(user?.username || 'guest');
      if (weightLogs && weightLogs.length > 0) {
        const latest = weightLogs[weightLogs.length - 1];
        const first = weightLogs[0];
        const weightChange = latest && first ? (latest.weight_kg - first.weight_kg).toFixed(1) : '0';
        const bmi = latest.bmi;
        const target = latest.target_weight;
        const height = latest.height_cm;
        let bmiCat = 'Unknown';
        if (bmi) {
          if (bmi < 18.5) bmiCat = 'Underweight';
          else if (bmi < 25) bmiCat = 'Normal';
          else if (bmi < 30) bmiCat = 'Overweight';
          else bmiCat = 'Obese';
        }
        let projected12w = null, weeklyChange = 0;
        if (weightLogs.length > 1) {
          let totalSurplus = 0;
          weightLogs.slice(-14).forEach(l => { totalSurplus += (l.calories_in - l.calories_out); });
          const avgDailySurplus = totalSurplus / Math.max(1, weightLogs.slice(-14).length);
          weeklyChange = (avgDailySurplus * 7) / 7700;
          projected12w = (latest.weight_kg + weeklyChange * 12).toFixed(1);
        }
        weightText = `Current weight: ${latest.weight_kg} kg\nTarget weight: ${target ? target + ' kg' : 'Not set'}\nBMI: ${bmi} (${bmiCat})\nHeight: ${height} cm\nTotal change: ${weightChange} kg`;
        if (projected12w) {
          weightText += `\nProjected weight (12w): ${projected12w} kg`;
          if (target) {
            if ((weeklyChange < 0 && projected12w < target) || (weeklyChange > 0 && projected12w > target)) {
              weightText += `\nYou are on track to reach your target.`;
            } else {
              weightText += `\nThis trend indicates that current habits may not support the target weight goal. Increasing physical activity and improving nutrition tracking may help reverse this trend.`;
            }
          }
        }
      }
    } catch (e) { weightText = 'No weight data available.'; }
    weightText.split('\n').forEach(line => {
      const lines = pdf.splitTextToSize(line, 480);
      checkPageBreak(lines.length * 15);
      pdf.text(lines, 50, y);
      y += lines.length * 15 + 2;
    });
    y += 8;

    // Section: Evidence-Based Recommendations
    checkPageBreak(110);
    sectionHeader('Personalised Recommendations');
    sectionBgBox(90);
    y += 8;
    const recs = [
      'Increase Physical Activity: Aim for 150 minutes of moderate exercise per week as recommended by the World Health Organization.',
      'Improve Sleep Consistency: Adults typically benefit from 7–9 hours of sleep per night to support metabolic health and cognitive performance.',
      'Track Nutrition Regularly: Consistent meal logging can improve awareness of caloric intake and support weight management goals.',
      'Introduce Mood Tracking: Regular mood tracking can help identify connections between stress, sleep quality, and physical activity.',
      'Establish Routine Scheduling: Adding structured daily activities may improve adherence to exercise and wellness habits.'
    ];
    recs.forEach(line => {
      const lines = pdf.splitTextToSize(`- ${line}`, 480);
      checkPageBreak(lines.length * 15);
      pdf.text(lines, 50, y);
      y += lines.length * 15 + 2;
    });
    y += 8;

    // Section: Overall Wellness Score
    checkPageBreak(60);
    sectionHeader('Overall Wellness Score');
    sectionBgBox(90);
    y += 8;
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'normal');
    // --- BEGIN: 100-Point Wellness Score Output ---
    let scoreInterpret = 'Needs improvement';
    if (finalScore >= 80) scoreInterpret = 'Excellent wellness habits';
    else if (finalScore >= 60) scoreInterpret = 'Healthy lifestyle';
    else if (finalScore >= 40) scoreInterpret = 'Needs improvement';
    else if (finalScore >= 20) scoreInterpret = 'Poor lifestyle consistency';
    else scoreInterpret = 'High lifestyle risk';
    pdf.setTextColor(accentColor);
    let scoreLines = pdf.splitTextToSize(`Wellness Score: ${finalScore} / 100`, 480);
    pdf.text(scoreLines, 50, y);
    y += scoreLines.length * 15;
    pdf.setTextColor('#222');
    let interpLines = pdf.splitTextToSize('Interpretation:', 480);
    pdf.text(interpLines, 50, y);
    y += interpLines.length * 15;
    let rangeLines = pdf.splitTextToSize('80–100: Excellent wellness habits', 420);
    pdf.text(rangeLines, 60, y);
    y += rangeLines.length * 14;
    rangeLines = pdf.splitTextToSize('60–79: Healthy lifestyle', 420);
    pdf.text(rangeLines, 60, y);
    y += rangeLines.length * 14;
    rangeLines = pdf.splitTextToSize('40–59: Needs improvement', 420);
    pdf.text(rangeLines, 60, y);
    y += rangeLines.length * 14;
    rangeLines = pdf.splitTextToSize('20–39: Poor lifestyle consistency', 420);
    pdf.text(rangeLines, 60, y);
    y += rangeLines.length * 14;
    rangeLines = pdf.splitTextToSize('0–19: High lifestyle risk', 420);
    pdf.text(rangeLines, 60, y);
    y += rangeLines.length * 14;
    let suggestLines = pdf.splitTextToSize(`Your current score suggests: ${scoreInterpret}`, 480);
    pdf.text(suggestLines, 50, y);
    y += suggestLines.length * 15 + 5;
    // --- END: 100-Point Wellness Score Output ---
    // --- BEGIN: Behaviour Radar ---
    sectionHeader('Behaviour Radar');
    sectionBgBox(90);
    y += 8;
    const radar = [
      ['Health Dimension', 'Rating'],
      ['Sleep', sleepScore < 7 ? 'Poor' : sleepScore < 15 ? 'Low' : 'Good'],
      ['Exercise', exerciseScore < 7 ? 'Very Low' : exerciseScore < 15 ? 'Low' : 'Good'],
      ['Nutrition', nutritionScore < 7 ? 'Low' : nutritionScore < 15 ? 'Moderate' : 'Good'],
      ['Mental Health', moodScore < 3 ? 'Low' : moodScore < 7 ? 'Moderate' : 'Good'],
      ['Consistency', consistencyScore < 3 ? 'Low' : consistencyScore < 7 ? 'Moderate' : 'Good'],
    ];
    let rx2 = 50, colWidths2 = [140, 120];
    radar.forEach((row, i) => {
      checkPageBreak(18);
      let x = rx2;
      row.forEach((cell, j) => {
        let cellLines = pdf.splitTextToSize(String(cell), colWidths2[j] - 10);
        pdf.text(cellLines, x, y, { maxWidth: colWidths2[j] - 10 });
        x += colWidths2[j];
      });
      y += (i === 0 ? 18 : 16);
    });
    y += 16;
    // --- END: Behaviour Radar ---
    // --- BEGIN: Predictive Behaviour AI ---
    // Force page break before this section for readability
    pdf.addPage();
    y = 40;
    sectionHeader('Future Health Forecast');
    sectionBgBox(70);
    y += 8;
    let forecast = [];
    if (exerciseScore < 7) forecast.push('• reduced cardiovascular fitness');
    if (sleepScore < 7) forecast.push('• lower energy levels');
    if (nutritionScore < 7) forecast.push('• gradual weight gain');
    if (finalScore < 40) forecast.push('• increased lifestyle risk score');
    if (forecast.length === 0) forecast.push('• maintenance of current health status');
    forecast.forEach(line => { pdf.text(line, 50, y); y += 15; });
    forecast.forEach(line => {
      let lines = pdf.splitTextToSize(line, 480);
      pdf.text(lines, 50, y);
      y += lines.length * 15;
    });
    y += 10;
    // --- END: Predictive Behaviour AI ---
    // --- BEGIN: Behaviour Pattern Detection ---
    sectionHeader('Behaviour Pattern Detection');
    sectionBgBox(70);
    y += 8;
    let patterns = [];
    if (exerciseScore < 7) patterns.push('Sedentary lifestyle');
    if (nutritionScore < 8) patterns.push('Inconsistent health tracking');
    let belowThresholds = 0;
    if (sleepScore < 7) belowThresholds++;
    if (exerciseScore < 7) belowThresholds++;
    if (nutritionScore < 8) belowThresholds++;
    if (moodScore < 3) belowThresholds++;
    if (consistencyScore < 3) belowThresholds++;
    if (belowThresholds >= 3) patterns.push('Elevated lifestyle risk');
    if (patterns.length === 0) patterns.push('No high-risk patterns detected');
    patterns.forEach(line => {
      let lines = pdf.splitTextToSize('• ' + line, 480);
      pdf.text(lines, 50, y);
      y += lines.length * 15;
    });
    y += 10;
    // --- END: Behaviour Pattern Detection ---
    // --- BEGIN: Behaviour Correlation Analysis ---
    sectionHeader('Behaviour Correlation Analysis');
    sectionBgBox(70);
    y += 8;
    let correlations = [];
    if (exerciseScore < 7 && weightText.includes('increase')) correlations.push('Low exercise + rising weight: Possible energy imbalance');
    if (sleepScore < 7 && moodScore < 3) correlations.push('Low sleep + poor mood logs: Possible stress pattern');
    if (journalingScore < 2 && consistencyScore < 3) correlations.push('Low journaling + inconsistent routines: Weak self-reflection habit');
    if (correlations.length === 0) correlations.push('No significant negative correlations detected');
    correlations.forEach(line => { pdf.text('• ' + line, 50, y); y += 15; });
    correlations.forEach(line => {
      let lines = pdf.splitTextToSize('• ' + line, 480);
      pdf.text(lines, 50, y);
      y += lines.length * 15;
    });
    y += 10;
    // --- END: Behaviour Correlation Analysis ---

    // Section: AI Insight
    checkPageBreak(70);
    sectionHeader('AI Behaviour Insight');
    sectionBgBox(70);
    y += 8;
    const aiInsight = [
      'Current behaviour patterns indicate low physical activity and inconsistent health tracking. If these patterns persist, they may contribute to gradual weight gain and reduced overall wellness.',
      'Introducing regular exercise sessions and consistent tracking habits may significantly improve both physical and mental health outcomes.'
    ];
    aiInsight.forEach(line => {
      const lines = pdf.splitTextToSize(line, 480);
      checkPageBreak(lines.length * 15);
      pdf.text(lines, 50, y);
      y += lines.length * 15 + 2;
    });
    y += 8;

    // Section: Metric Trends Table
    checkPageBreak(70);
    sectionHeader('Metric Trends');
    sectionBgBox(70);
    y += 8;
    const trends = [
      ['Metric', 'Trend'],
      ['Sleep', report.sleepHours < 35 ? 'Decreasing' : 'Stable'],
      ['Exercise', report.exerciseMins < 30 ? 'Stable (Low)' : 'Improving'],
      ['Weight', 'See Weight Analysis'],
      ['Nutrition Tracking', report.nutritionCount < 3 ? 'Inconsistent' : 'Consistent'],
    ];
    let tx = 50, tcolWidths = [100, 200];
    trends.forEach((row, i) => {
      checkPageBreak(18);
      let x = tx;
      row.forEach((cell, j) => {
        let cellLines = pdf.splitTextToSize(String(cell), tcolWidths[j] - 10);
        pdf.text(cellLines, x, y, { maxWidth: tcolWidths[j] - 10 });
        x += tcolWidths[j];
      });
      y += (i === 0 ? 18 : 16);
    });

    pdf.save(`wellness_medical_report_${report?.period || 'period'}.pdf`);
  };

  useEffect(() => {
    async function load() {
      const uname = user?.username || "guest";
      try {
        const [workouts, sleep, nutrition, mood, goals, journal, schedule] = await Promise.all([
          getWorkoutLogs(uname).catch(() => []),
          getSleepLogs(uname).catch(() => []),
          getNutritionLogs(uname).catch(() => []),
          getMoodLogs(uname).catch(() => []),
          getGoals(uname).catch(() => []),
          getJournalEntries(uname).catch(() => []),
          getSchedule(uname).catch(() => []),
        ]);
        setStats({ workouts: workouts.length, sleep: sleep.length, nutrition: nutrition.length, mood: mood.length,
          goalsActive: goals.filter(g => g.status === "active").length,
          goalsCompleted: goals.filter(g => g.status === "completed").length,
          journal: journal.length, schedule: schedule.length });
      } catch (err) { console.error(err); }
      setLoading(false);
    }
    load();
  }, [user]);

  // Helper: get date range for period
  function getDateRange(period) {
    const now = new Date();
    let start, end = new Date(now);
    if (period === "day") {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (period === "week") {
      const day = now.getDay();
      start = new Date(now);
      start.setDate(now.getDate() - day);
    } else if (period === "month") {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }
    return [start, end];
  }

  // Helper: filter logs by date
  function filterByDate(logs, dateField, start, end) {
    return logs.filter(l => {
      const d = new Date(l[dateField]);
      return d >= start && d <= end;
    });
  }

  // Helper: analyze and generate assertion
  function generateAssertion(sleepHours, caffeine, exerciseMins) {
    if (sleepHours < 6 && caffeine > 2 && exerciseMins < 20) {
      return "Low sleep combined with high caffeine intake and lack of exercise may be affecting your focus and energy today.";
    }
    if (sleepHours < 6 && caffeine > 2) {
      return "Your sleep was lower than recommended and caffeine intake was high. This combination may contribute to reduced focus and energy. Taking adequate sleep and moderating caffeine may improve productivity.";
    }
    if (sleepHours < 6) {
      return "Your sleep was lower than recommended. Try to get more rest for better health and focus.";
    }
    if (caffeine > 2) {
      return "Caffeine intake was high. Consider moderating to avoid negative effects on sleep and focus.";
    }
    if (exerciseMins < 20) {
      return "Exercise was lower than recommended. Increasing activity may boost your energy and mood.";
    }
    return "Your sleep, caffeine, and exercise levels were within healthy ranges. Keep up the good work!";
  }

  // Generate report handler
  async function handleGenerateReport() {
    setReportLoading(true);
    setReportError("");
    setReport(null);
    const uname = user?.username || "guest";
    try {
      const [sleepLogs, nutritionLogs, workoutLogs, moodLogs, goals, journalEntries, schedule] = await Promise.all([
        getSleepLogs(uname).catch(() => []),
        getNutritionLogs(uname).catch(() => []),
        getWorkoutLogs(uname).catch(() => []),
        getMoodLogs(uname).catch(() => []),
        getGoals(uname).catch(() => []),
        getJournalEntries(uname).catch(() => []),
        getSchedule(uname).catch(() => []),
      ]);
      const [start, end] = getDateRange(reportPeriod);
      // Sleep: sum hours
      const sleepPeriod = filterByDate(sleepLogs, "date", start, end);
      const totalSleep = sleepPeriod.reduce((sum, l) => sum + (parseFloat(l.hours) || 0), 0);
      // Caffeine: sum coffee/caffeine entries (assume nutrition log has type/desc)
      const nutritionPeriod = filterByDate(nutritionLogs, "date", start, end);
      const caffeineCount = nutritionPeriod.filter(l => {
        const t = (l.type || "").toLowerCase();
        const d = (l.description || "").toLowerCase();
        return t.includes("coffee") || t.includes("caffeine") || d.includes("coffee") || d.includes("caffeine");
      }).length;
      const totalCalories = nutritionPeriod.reduce((sum, l) => sum + (parseFloat(l.calories) || 0), 0);
      // Exercise: sum minutes
      const workoutPeriod = filterByDate(workoutLogs, "date", start, end);
      const totalExercise = workoutPeriod.reduce((sum, l) => sum + (parseFloat(l.duration) || parseFloat(l.duration_min) || 0), 0);
      // Mood: count and average
      const moodPeriod = filterByDate(moodLogs, "date", start, end);
      const moodCount = moodPeriod.length;
      const avgMood = moodCount > 0 ? (moodPeriod.reduce((sum, l) => sum + (parseFloat(l.mood_score) || 0), 0) / moodCount).toFixed(1) : "-";
      // Goals: active and completed
      const activeGoals = goals.filter(g => g.status === "active").length;
      const completedGoals = goals.filter(g => g.status === "completed").length;
      // Journal: count
      const journalCount = journalEntries.filter(j => {
        const d = new Date(j.date);
        return d >= start && d <= end;
      }).length;
      // Schedule: count
      const scheduleCount = schedule.filter(s => {
        const d = new Date(s.date || s.start_date);
        return d >= start && d <= end;
      }).length;
      // Workouts: count
      const workoutCount = workoutPeriod.length;
      // Assertion
      const assertion = generateAssertion(totalSleep, caffeineCount, totalExercise);
      setReport({
        period: reportPeriod,
        sleepHours: totalSleep,
        caffeine: caffeineCount,
        exerciseMins: totalExercise,
        moodCount,
        avgMood,
        nutritionCount: nutritionPeriod.length,
        totalCalories,
        activeGoals,
        completedGoals,
        journalCount,
        scheduleCount,
        workoutCount,
        assertion,
      });
    } catch (err) {
      setReportError("Failed to generate report.");
    }
    setReportLoading(false);
  }

  const initial = user?.username?.charAt(0).toUpperCase() || "?";

  return (
    <div className="container py-4 wb-narrow">
      <h2 className="wb-page-header mb-4">
        <i className="bi bi-person me-2"></i>Profile
      </h2>

      {/* Profile Card */}
      <div className="wb-card-static p-4 mb-4">
        <div className="d-flex align-items-center gap-3">
          <div className="wb-avatar">{initial}</div>
          <div>
            <h4 className="fw-bold mb-1">{user?.username || "Guest"}</h4>
            <p className="text-muted mb-0">
              <i className="bi bi-envelope me-1"></i>
              {user?.email || "No email"}
            </p>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="wb-card-static p-4 mb-4">
        <h5 className="fw-bold mb-3">
          <i className="bi bi-gear me-2"></i>Preferences
        </h5>
        <div className="d-flex align-items-center gap-3">
          <span className="text-muted">Theme:</span>
          <button className="btn btn-wb-primary btn-sm" onClick={toggleTheme}>
            {darkMode ? (
              <><i className="bi bi-sun-fill me-1"></i>Switch to Light</>
            ) : (
              <><i className="bi bi-moon-stars-fill me-1"></i>Switch to Dark</>
            )}
          </button>
        </div>
      </div>

      {/* Wellness Summary */}
      <div className="wb-card-static p-4 mb-4">
        <h5 className="fw-bold mb-3">
          <i className="bi bi-clipboard-data me-2"></i>Wellness Summary
        </h5>
        {loading ? (
          <div className="text-center py-3">
            <div className="spinner-border spinner-border-sm text-primary"></div>
          </div>
        ) : stats ? (
          <div className="row g-3">
            {[
              { label: "Workouts", value: stats.workouts, icon: "bi-heart-pulse", color: "danger" },
              { label: "Sleep Logs", value: stats.sleep, icon: "bi-moon-stars", color: "primary" },
              { label: "Nutrition Logs", value: stats.nutrition, icon: "bi-egg-fried", color: "success" },
              { label: "Mood Logs", value: stats.mood, icon: "bi-emoji-smile", color: "warning" },
              { label: "Active Goals", value: stats.goalsActive, icon: "bi-trophy", color: "info" },
              { label: "Goals Completed", value: stats.goalsCompleted, icon: "bi-check-circle", color: "success" },
              { label: "Journal Entries", value: stats.journal, icon: "bi-journal-text", color: "primary" },
              { label: "Scheduled Activities", value: stats.schedule, icon: "bi-calendar-week", color: "danger" },
            ].map((s, i) => (
              <div className="col-6 col-md-3" key={i}>
                <div className="text-center p-2 rounded-3" style={{ background: "rgba(99,102,241,0.04)" }}>
                  <i className={`bi ${s.icon} text-${s.color}`} style={{ fontSize: "1.2rem" }}></i>
                  <div className="fs-4 fw-bold">{s.value}</div>
                  <small className="text-muted">{s.label}</small>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">Unable to load stats.</p>
        )}
      </div>

      {/* Generate Report */}
      <div className="wb-card-static p-4 mb-4">
        <h5 className="fw-bold mb-3">
          <i className="bi bi-file-earmark-text me-2"></i>Generate Wellness Report
        </h5>
        <div className="d-flex align-items-center gap-3 mb-3">
          <label htmlFor="report-period" className="form-label mb-0">Period:</label>
          <select id="report-period" className="form-select w-auto" value={reportPeriod} onChange={e => setReportPeriod(e.target.value)}>
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <button className="btn btn-wb-primary" onClick={handleGenerateReport} disabled={reportLoading}>
            {reportLoading ? <span className="spinner-border spinner-border-sm"></span> : <><i className="bi bi-bar-chart-line me-1"></i>Generate</>}
          </button>
          {report && (
            <button className="btn btn-success" onClick={handleDownloadPDF}>
              <i className="bi bi-download me-1"></i>Download PDF
            </button>
          )}
        </div>
        {reportError && <div className="alert alert-danger py-2">{reportError}</div>}
        {report && (
          <div ref={reportRef} className={`border rounded p-3 ${darkMode ? 'bg-dark text-light' : 'bg-light'}`} style={{ minWidth: 320, maxWidth: 600 }}>
            <h4 className="fw-bold mb-3 text-center">Wellness Report</h4>
            <div className="mb-2"><strong>Period:</strong> {report.period.charAt(0).toUpperCase() + report.period.slice(1)}</div>
            <div className="mb-2"><strong>Total Sleep:</strong> {report.sleepHours} hours</div>
            <div className="mb-2"><strong>Caffeine Intake:</strong> {report.caffeine} times</div>
            <div className="mb-2"><strong>Exercise:</strong> {report.exerciseMins} minutes</div>
            <div className="mb-2"><strong>Workouts:</strong> {report.workoutCount}</div>
            <div className="mb-2"><strong>Mood Logs:</strong> {report.moodCount} {report.moodCount > 0 && (<span>(Avg: {report.avgMood})</span>)}</div>
            <div className="mb-2"><strong>Nutrition Logs:</strong> {report.nutritionCount} {report.nutritionCount > 0 && (<span>(Total Calories: {report.totalCalories})</span>)}</div>
            <div className="mb-2"><strong>Active Goals:</strong> {report.activeGoals}</div>
            <div className="mb-2"><strong>Completed Goals:</strong> {report.completedGoals}</div>
            <div className="mb-2"><strong>Journal Entries:</strong> {report.journalCount}</div>
            <div className="mb-2"><strong>Scheduled Activities:</strong> {report.scheduleCount}</div>
            <div className="alert alert-info mt-3 mb-0" style={{ background: darkMode ? '#23272f' : undefined, color: darkMode ? '#fff' : undefined }}>{report.assertion}</div>
          </div>
        )}
      </div>

      {/* Logout */}
      <button className="btn btn-danger btn-lg w-100" onClick={logout}>
        <i className="bi bi-box-arrow-right me-2"></i>Logout
      </button>
    </div>
  );
}
