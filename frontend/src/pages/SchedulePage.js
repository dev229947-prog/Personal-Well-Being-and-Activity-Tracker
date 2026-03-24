import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getSchedule, addScheduleEntry, addScheduleBulk, clearSchedule, updateScheduleEntry } from "../services/api";
import WeeklySchedule from "../components/WeeklySchedule";
import ScheduleForm from "../components/ScheduleForm";
import ActivityTimer from "../components/ActivityTimer";
import { ActivityPieChart } from "../components/Charts";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/* ══════════════════════════════════════════
   Sample schedule templates
   ══════════════════════════════════════════ */
const TEMPLATES = [
  {
    key: "student",
    label: "University Student",
    icon: "bi-mortarboard",
    color: "#6366f1",
    desc: "Lectures, labs, study sessions, gym & social time",
    entries: [
      // Monday
      { day_of_week: 0, title: "Calculus Lecture",       activity_type: "study",    start_time: "08:00", end_time: "10:00", color: "#6366f1" },
      { day_of_week: 0, title: "Physics Lab",            activity_type: "study",    start_time: "10:30", end_time: "12:30", color: "#8b5cf6" },
      { day_of_week: 0, title: "Lunch Break",            activity_type: "break",    start_time: "12:30", end_time: "13:30", color: "#ef4444" },
      { day_of_week: 0, title: "Programming Workshop",   activity_type: "study",    start_time: "14:00", end_time: "16:00", color: "#6366f1" },
      { day_of_week: 0, title: "Gym Session",            activity_type: "gym",      start_time: "17:00", end_time: "18:30", color: "#10b981" },
      // Tuesday
      { day_of_week: 1, title: "English Literature",     activity_type: "study",    start_time: "09:00", end_time: "11:00", color: "#6366f1" },
      { day_of_week: 1, title: "Study Group",            activity_type: "study",    start_time: "11:30", end_time: "13:00", color: "#8b5cf6" },
      { day_of_week: 1, title: "Lunch Break",            activity_type: "break",    start_time: "13:00", end_time: "14:00", color: "#ef4444" },
      { day_of_week: 1, title: "Data Structures",        activity_type: "study",    start_time: "14:30", end_time: "16:30", color: "#6366f1" },
      { day_of_week: 1, title: "Evening Reading",        activity_type: "reading",  start_time: "19:00", end_time: "20:00", color: "#ec4899" },
      // Wednesday
      { day_of_week: 2, title: "Chemistry Lecture",      activity_type: "study",    start_time: "08:00", end_time: "10:00", color: "#6366f1" },
      { day_of_week: 2, title: "Math Tutorial",          activity_type: "study",    start_time: "10:30", end_time: "12:00", color: "#8b5cf6" },
      { day_of_week: 2, title: "Lunch Break",            activity_type: "break",    start_time: "12:00", end_time: "13:00", color: "#ef4444" },
      { day_of_week: 2, title: "Lab Work",               activity_type: "study",    start_time: "13:30", end_time: "15:30", color: "#6366f1" },
      { day_of_week: 2, title: "Gym Session",            activity_type: "gym",      start_time: "17:00", end_time: "18:30", color: "#10b981" },
      // Thursday
      { day_of_week: 3, title: "Statistics Class",       activity_type: "study",    start_time: "09:00", end_time: "11:00", color: "#6366f1" },
      { day_of_week: 3, title: "Group Project",          activity_type: "meeting",  start_time: "11:30", end_time: "13:00", color: "#8b5cf6" },
      { day_of_week: 3, title: "Lunch Break",            activity_type: "break",    start_time: "13:00", end_time: "14:00", color: "#ef4444" },
      { day_of_week: 3, title: "Office Hours",           activity_type: "meeting",  start_time: "14:00", end_time: "15:00", color: "#f59e0b" },
      { day_of_week: 3, title: "Library Study",          activity_type: "study",    start_time: "16:00", end_time: "18:00", color: "#6366f1" },
      // Friday
      { day_of_week: 4, title: "Seminar",                activity_type: "study",    start_time: "09:00", end_time: "11:00", color: "#8b5cf6" },
      { day_of_week: 4, title: "Lunch Break",            activity_type: "break",    start_time: "12:00", end_time: "13:00", color: "#ef4444" },
      { day_of_week: 4, title: "Assignment Work",        activity_type: "study",    start_time: "13:30", end_time: "15:30", color: "#6366f1" },
      { day_of_week: 4, title: "Social / Free Time",     activity_type: "personal", start_time: "17:00", end_time: "19:00", color: "#06b6d4" },
      // Saturday
      { day_of_week: 5, title: "Gym Session",            activity_type: "gym",      start_time: "10:00", end_time: "11:30", color: "#10b981" },
      { day_of_week: 5, title: "Part-time Job",          activity_type: "work",     start_time: "13:00", end_time: "17:00", color: "#f59e0b" },
      { day_of_week: 5, title: "Social Evening",         activity_type: "personal", start_time: "19:00", end_time: "21:00", color: "#06b6d4" },
      // Sunday
      { day_of_week: 6, title: "Sleep In / Relax",       activity_type: "personal", start_time: "10:00", end_time: "11:00", color: "#06b6d4" },
      { day_of_week: 6, title: "Assignment Review",      activity_type: "study",    start_time: "14:00", end_time: "17:00", color: "#6366f1" },
      { day_of_week: 6, title: "Meal Prep",              activity_type: "personal", start_time: "18:00", end_time: "19:30", color: "#06b6d4" },
    ],
  },
  {
    key: "employee",
    label: "Office Employee",
    icon: "bi-briefcase",
    color: "#f59e0b",
    desc: "9-to-5 work, commute, meetings, gym & family time",
    entries: [
      // Monday
      { day_of_week: 0, title: "Morning Workout",        activity_type: "gym",      start_time: "06:30", end_time: "07:30", color: "#10b981" },
      { day_of_week: 0, title: "Commute to Office",      activity_type: "commute",  start_time: "08:00", end_time: "08:45", color: "#64748b" },
      { day_of_week: 0, title: "Team Standup",            activity_type: "meeting",  start_time: "09:00", end_time: "09:30", color: "#8b5cf6" },
      { day_of_week: 0, title: "Focused Work",            activity_type: "work",     start_time: "09:30", end_time: "12:00", color: "#f59e0b" },
      { day_of_week: 0, title: "Lunch Break",             activity_type: "break",    start_time: "12:00", end_time: "13:00", color: "#ef4444" },
      { day_of_week: 0, title: "Afternoon Work",          activity_type: "work",     start_time: "13:00", end_time: "17:00", color: "#f59e0b" },
      { day_of_week: 0, title: "Commute Home",            activity_type: "commute",  start_time: "17:00", end_time: "17:45", color: "#64748b" },
      { day_of_week: 0, title: "Family / Personal Time",  activity_type: "personal", start_time: "18:30", end_time: "20:00", color: "#06b6d4" },
      // Tuesday
      { day_of_week: 1, title: "Morning Workout",        activity_type: "gym",      start_time: "06:30", end_time: "07:30", color: "#10b981" },
      { day_of_week: 1, title: "Commute to Office",      activity_type: "commute",  start_time: "08:00", end_time: "08:45", color: "#64748b" },
      { day_of_week: 1, title: "Project Meeting",         activity_type: "meeting",  start_time: "09:00", end_time: "10:00", color: "#8b5cf6" },
      { day_of_week: 1, title: "Deep Work",               activity_type: "work",     start_time: "10:00", end_time: "12:00", color: "#f59e0b" },
      { day_of_week: 1, title: "Lunch Break",             activity_type: "break",    start_time: "12:00", end_time: "13:00", color: "#ef4444" },
      { day_of_week: 1, title: "Afternoon Work",          activity_type: "work",     start_time: "13:00", end_time: "17:00", color: "#f59e0b" },
      { day_of_week: 1, title: "Commute Home",            activity_type: "commute",  start_time: "17:00", end_time: "17:45", color: "#64748b" },
      { day_of_week: 1, title: "Evening Reading",         activity_type: "reading",  start_time: "20:00", end_time: "21:00", color: "#ec4899" },
      // Wednesday
      { day_of_week: 2, title: "Morning Workout",        activity_type: "gym",      start_time: "06:30", end_time: "07:30", color: "#10b981" },
      { day_of_week: 2, title: "Commute to Office",      activity_type: "commute",  start_time: "08:00", end_time: "08:45", color: "#64748b" },
      { day_of_week: 2, title: "Team Standup",            activity_type: "meeting",  start_time: "09:00", end_time: "09:30", color: "#8b5cf6" },
      { day_of_week: 2, title: "Focused Work",            activity_type: "work",     start_time: "09:30", end_time: "12:00", color: "#f59e0b" },
      { day_of_week: 2, title: "Lunch Break",             activity_type: "break",    start_time: "12:00", end_time: "13:00", color: "#ef4444" },
      { day_of_week: 2, title: "Client Presentation",     activity_type: "meeting",  start_time: "14:00", end_time: "15:30", color: "#8b5cf6" },
      { day_of_week: 2, title: "Afternoon Work",          activity_type: "work",     start_time: "15:30", end_time: "17:00", color: "#f59e0b" },
      { day_of_week: 2, title: "Commute Home",            activity_type: "commute",  start_time: "17:00", end_time: "17:45", color: "#64748b" },
      // Thursday
      { day_of_week: 3, title: "Morning Workout",        activity_type: "gym",      start_time: "06:30", end_time: "07:30", color: "#10b981" },
      { day_of_week: 3, title: "Commute to Office",      activity_type: "commute",  start_time: "08:00", end_time: "08:45", color: "#64748b" },
      { day_of_week: 3, title: "Sprint Planning",         activity_type: "meeting",  start_time: "09:00", end_time: "10:00", color: "#8b5cf6" },
      { day_of_week: 3, title: "Deep Work",               activity_type: "work",     start_time: "10:00", end_time: "12:00", color: "#f59e0b" },
      { day_of_week: 3, title: "Lunch Break",             activity_type: "break",    start_time: "12:00", end_time: "13:00", color: "#ef4444" },
      { day_of_week: 3, title: "Afternoon Work",          activity_type: "work",     start_time: "13:00", end_time: "17:00", color: "#f59e0b" },
      { day_of_week: 3, title: "Commute Home",            activity_type: "commute",  start_time: "17:00", end_time: "17:45", color: "#64748b" },
      { day_of_week: 3, title: "Family Dinner",           activity_type: "personal", start_time: "19:00", end_time: "20:30", color: "#06b6d4" },
      // Friday
      { day_of_week: 4, title: "Commute to Office",      activity_type: "commute",  start_time: "08:00", end_time: "08:45", color: "#64748b" },
      { day_of_week: 4, title: "Team Retrospective",      activity_type: "meeting",  start_time: "09:00", end_time: "10:00", color: "#8b5cf6" },
      { day_of_week: 4, title: "Focused Work",            activity_type: "work",     start_time: "10:00", end_time: "12:00", color: "#f59e0b" },
      { day_of_week: 4, title: "Team Lunch",              activity_type: "break",    start_time: "12:00", end_time: "13:30", color: "#ef4444" },
      { day_of_week: 4, title: "Wrap-up & Planning",      activity_type: "work",     start_time: "13:30", end_time: "16:00", color: "#f59e0b" },
      { day_of_week: 4, title: "Commute Home",            activity_type: "commute",  start_time: "16:00", end_time: "16:45", color: "#64748b" },
      { day_of_week: 4, title: "Date Night / Social",     activity_type: "personal", start_time: "19:00", end_time: "21:00", color: "#06b6d4" },
      // Saturday
      { day_of_week: 5, title: "Sleep In",                activity_type: "personal", start_time: "09:00", end_time: "10:00", color: "#06b6d4" },
      { day_of_week: 5, title: "Grocery Shopping",        activity_type: "personal", start_time: "10:30", end_time: "12:00", color: "#06b6d4" },
      { day_of_week: 5, title: "Gym / Sports",            activity_type: "gym",      start_time: "14:00", end_time: "15:30", color: "#10b981" },
      { day_of_week: 5, title: "Hobbies / Leisure",       activity_type: "personal", start_time: "17:00", end_time: "19:00", color: "#06b6d4" },
      // Sunday
      { day_of_week: 6, title: "Morning Jog",             activity_type: "gym",      start_time: "08:00", end_time: "09:00", color: "#10b981" },
      { day_of_week: 6, title: "Meal Prep",               activity_type: "personal", start_time: "11:00", end_time: "13:00", color: "#06b6d4" },
      { day_of_week: 6, title: "Family Time",             activity_type: "personal", start_time: "15:00", end_time: "18:00", color: "#06b6d4" },
      { day_of_week: 6, title: "Plan Next Week",          activity_type: "work",     start_time: "20:00", end_time: "21:00", color: "#f59e0b" },
    ],
  },
  {
    key: "doctor",
    label: "Doctor / Medical",
    icon: "bi-heart-pulse",
    color: "#10b981",
    desc: "Hospital rounds, clinics, surgeries & on-call hours",
    entries: [
      // Monday
      { day_of_week: 0, title: "Morning Rounds",         activity_type: "work",     start_time: "06:30", end_time: "08:00", color: "#10b981" },
      { day_of_week: 0, title: "OPD / Clinic Hours",     activity_type: "work",     start_time: "08:30", end_time: "12:00", color: "#3b82f6" },
      { day_of_week: 0, title: "Lunch Break",             activity_type: "break",    start_time: "12:00", end_time: "12:45", color: "#ef4444" },
      { day_of_week: 0, title: "Surgery / Procedures",    activity_type: "work",     start_time: "13:00", end_time: "16:00", color: "#8b5cf6" },
      { day_of_week: 0, title: "Patient Follow-ups",      activity_type: "work",     start_time: "16:00", end_time: "17:30", color: "#10b981" },
      { day_of_week: 0, title: "Medical Reading",         activity_type: "reading",  start_time: "20:00", end_time: "21:00", color: "#ec4899" },
      // Tuesday
      { day_of_week: 1, title: "Morning Rounds",         activity_type: "work",     start_time: "06:30", end_time: "08:00", color: "#10b981" },
      { day_of_week: 1, title: "OPD / Clinic Hours",     activity_type: "work",     start_time: "08:30", end_time: "12:00", color: "#3b82f6" },
      { day_of_week: 1, title: "Lunch Break",             activity_type: "break",    start_time: "12:00", end_time: "12:45", color: "#ef4444" },
      { day_of_week: 1, title: "Case Discussions",        activity_type: "meeting",  start_time: "13:00", end_time: "14:30", color: "#f59e0b" },
      { day_of_week: 1, title: "Ward Duty",               activity_type: "work",     start_time: "14:30", end_time: "17:00", color: "#10b981" },
      { day_of_week: 1, title: "Exercise / Gym",          activity_type: "gym",      start_time: "18:00", end_time: "19:00", color: "#10b981" },
      // Wednesday
      { day_of_week: 2, title: "Morning Rounds",         activity_type: "work",     start_time: "06:30", end_time: "08:00", color: "#10b981" },
      { day_of_week: 2, title: "Surgery Day",             activity_type: "work",     start_time: "08:30", end_time: "13:00", color: "#8b5cf6" },
      { day_of_week: 2, title: "Lunch Break",             activity_type: "break",    start_time: "13:00", end_time: "13:45", color: "#ef4444" },
      { day_of_week: 2, title: "Post-Op Follow-ups",      activity_type: "work",     start_time: "14:00", end_time: "16:00", color: "#10b981" },
      { day_of_week: 2, title: "Research / Publishing",   activity_type: "study",    start_time: "16:30", end_time: "18:00", color: "#6366f1" },
      // Thursday
      { day_of_week: 3, title: "Morning Rounds",         activity_type: "work",     start_time: "06:30", end_time: "08:00", color: "#10b981" },
      { day_of_week: 3, title: "OPD / Clinic Hours",     activity_type: "work",     start_time: "08:30", end_time: "12:00", color: "#3b82f6" },
      { day_of_week: 3, title: "Lunch Break",             activity_type: "break",    start_time: "12:00", end_time: "12:45", color: "#ef4444" },
      { day_of_week: 3, title: "Medical Conference",      activity_type: "meeting",  start_time: "13:00", end_time: "15:00", color: "#f59e0b" },
      { day_of_week: 3, title: "Patient Consultations",   activity_type: "work",     start_time: "15:00", end_time: "17:30", color: "#10b981" },
      { day_of_week: 3, title: "Family Time",             activity_type: "personal", start_time: "19:00", end_time: "21:00", color: "#06b6d4" },
      // Friday
      { day_of_week: 4, title: "Morning Rounds",         activity_type: "work",     start_time: "06:30", end_time: "08:00", color: "#10b981" },
      { day_of_week: 4, title: "OPD / Clinic Hours",     activity_type: "work",     start_time: "08:30", end_time: "12:00", color: "#3b82f6" },
      { day_of_week: 4, title: "Lunch Break",             activity_type: "break",    start_time: "12:00", end_time: "12:45", color: "#ef4444" },
      { day_of_week: 4, title: "Admin & Paperwork",       activity_type: "work",     start_time: "13:00", end_time: "15:00", color: "#f59e0b" },
      { day_of_week: 4, title: "Week Wrap-up",            activity_type: "work",     start_time: "15:00", end_time: "16:00", color: "#10b981" },
      // Saturday
      { day_of_week: 5, title: "On-Call / Emergency",     activity_type: "work",     start_time: "08:00", end_time: "14:00", color: "#ef4444" },
      { day_of_week: 5, title: "Exercise",                activity_type: "gym",      start_time: "16:00", end_time: "17:00", color: "#10b981" },
      { day_of_week: 5, title: "Leisure / Hobbies",       activity_type: "personal", start_time: "18:00", end_time: "20:00", color: "#06b6d4" },
      // Sunday
      { day_of_week: 6, title: "Rest & Family",           activity_type: "personal", start_time: "09:00", end_time: "12:00", color: "#06b6d4" },
      { day_of_week: 6, title: "Medical Journal Reading", activity_type: "reading",  start_time: "15:00", end_time: "17:00", color: "#ec4899" },
      { day_of_week: 6, title: "Plan Next Week",          activity_type: "work",     start_time: "20:00", end_time: "21:00", color: "#f59e0b" },
    ],
  },
  {
    key: "housewife",
    label: "Homemaker",
    icon: "bi-house-heart",
    color: "#ec4899",
    desc: "Cooking, childcare, household chores, self-care & errands",
    entries: [
      // Monday
      { day_of_week: 0, title: "Morning Routine & Prayer",activity_type: "personal", start_time: "06:00", end_time: "07:00", color: "#06b6d4" },
      { day_of_week: 0, title: "Prepare Breakfast",       activity_type: "personal", start_time: "07:00", end_time: "08:00", color: "#ec4899" },
      { day_of_week: 0, title: "Kids School Drop-off",    activity_type: "commute",  start_time: "08:00", end_time: "08:45", color: "#64748b" },
      { day_of_week: 0, title: "Household Cleaning",      activity_type: "work",     start_time: "09:00", end_time: "11:00", color: "#f59e0b" },
      { day_of_week: 0, title: "Grocery Shopping",        activity_type: "personal", start_time: "11:30", end_time: "13:00", color: "#06b6d4" },
      { day_of_week: 0, title: "Lunch Preparation",       activity_type: "personal", start_time: "13:00", end_time: "14:00", color: "#ec4899" },
      { day_of_week: 0, title: "Kids School Pick-up",     activity_type: "commute",  start_time: "14:30", end_time: "15:15", color: "#64748b" },
      { day_of_week: 0, title: "Help with Homework",      activity_type: "study",    start_time: "15:30", end_time: "17:00", color: "#6366f1" },
      { day_of_week: 0, title: "Dinner Preparation",      activity_type: "personal", start_time: "17:30", end_time: "19:00", color: "#ec4899" },
      { day_of_week: 0, title: "Self-Care / Reading",     activity_type: "reading",  start_time: "21:00", end_time: "22:00", color: "#ec4899" },
      // Tuesday
      { day_of_week: 1, title: "Morning Routine",         activity_type: "personal", start_time: "06:00", end_time: "07:00", color: "#06b6d4" },
      { day_of_week: 1, title: "Prepare Breakfast",       activity_type: "personal", start_time: "07:00", end_time: "08:00", color: "#ec4899" },
      { day_of_week: 1, title: "Kids Drop-off",           activity_type: "commute",  start_time: "08:00", end_time: "08:45", color: "#64748b" },
      { day_of_week: 1, title: "Laundry & Ironing",       activity_type: "work",     start_time: "09:00", end_time: "11:00", color: "#f59e0b" },
      { day_of_week: 1, title: "Yoga / Exercise",         activity_type: "gym",      start_time: "11:00", end_time: "12:00", color: "#10b981" },
      { day_of_week: 1, title: "Lunch Preparation",       activity_type: "personal", start_time: "12:30", end_time: "13:30", color: "#ec4899" },
      { day_of_week: 1, title: "Kids Pick-up",            activity_type: "commute",  start_time: "14:30", end_time: "15:15", color: "#64748b" },
      { day_of_week: 1, title: "Children Activities",     activity_type: "personal", start_time: "15:30", end_time: "17:00", color: "#06b6d4" },
      { day_of_week: 1, title: "Dinner Preparation",      activity_type: "personal", start_time: "17:30", end_time: "19:00", color: "#ec4899" },
      // Wednesday
      { day_of_week: 2, title: "Morning Routine",         activity_type: "personal", start_time: "06:00", end_time: "07:00", color: "#06b6d4" },
      { day_of_week: 2, title: "Prepare Breakfast",       activity_type: "personal", start_time: "07:00", end_time: "08:00", color: "#ec4899" },
      { day_of_week: 2, title: "Kids Drop-off",           activity_type: "commute",  start_time: "08:00", end_time: "08:45", color: "#64748b" },
      { day_of_week: 2, title: "Deep Cleaning",           activity_type: "work",     start_time: "09:00", end_time: "12:00", color: "#f59e0b" },
      { day_of_week: 2, title: "Lunch & Rest",            activity_type: "break",    start_time: "12:00", end_time: "13:30", color: "#ef4444" },
      { day_of_week: 2, title: "Kids Pick-up",            activity_type: "commute",  start_time: "14:30", end_time: "15:15", color: "#64748b" },
      { day_of_week: 2, title: "Help with Homework",      activity_type: "study",    start_time: "15:30", end_time: "17:00", color: "#6366f1" },
      { day_of_week: 2, title: "Dinner Preparation",      activity_type: "personal", start_time: "17:30", end_time: "19:00", color: "#ec4899" },
      // Thursday
      { day_of_week: 3, title: "Morning Routine",         activity_type: "personal", start_time: "06:00", end_time: "07:00", color: "#06b6d4" },
      { day_of_week: 3, title: "Prepare Breakfast",       activity_type: "personal", start_time: "07:00", end_time: "08:00", color: "#ec4899" },
      { day_of_week: 3, title: "Kids Drop-off",           activity_type: "commute",  start_time: "08:00", end_time: "08:45", color: "#64748b" },
      { day_of_week: 3, title: "Errands & Bills",         activity_type: "personal", start_time: "09:00", end_time: "11:00", color: "#06b6d4" },
      { day_of_week: 3, title: "Yoga / Exercise",         activity_type: "gym",      start_time: "11:00", end_time: "12:00", color: "#10b981" },
      { day_of_week: 3, title: "Lunch Preparation",       activity_type: "personal", start_time: "12:30", end_time: "13:30", color: "#ec4899" },
      { day_of_week: 3, title: "Kids Pick-up",            activity_type: "commute",  start_time: "14:30", end_time: "15:15", color: "#64748b" },
      { day_of_week: 3, title: "Park / Outdoor Play",     activity_type: "personal", start_time: "15:30", end_time: "17:00", color: "#10b981" },
      { day_of_week: 3, title: "Dinner Preparation",      activity_type: "personal", start_time: "17:30", end_time: "19:00", color: "#ec4899" },
      // Friday
      { day_of_week: 4, title: "Morning Routine",         activity_type: "personal", start_time: "06:00", end_time: "07:00", color: "#06b6d4" },
      { day_of_week: 4, title: "Prepare Breakfast",       activity_type: "personal", start_time: "07:00", end_time: "08:00", color: "#ec4899" },
      { day_of_week: 4, title: "Kids Drop-off",           activity_type: "commute",  start_time: "08:00", end_time: "08:45", color: "#64748b" },
      { day_of_week: 4, title: "Weekly Meal Prep",        activity_type: "personal", start_time: "09:00", end_time: "12:00", color: "#ec4899" },
      { day_of_week: 4, title: "Kids Pick-up",            activity_type: "commute",  start_time: "14:30", end_time: "15:15", color: "#64748b" },
      { day_of_week: 4, title: "Family Evening",          activity_type: "personal", start_time: "18:00", end_time: "21:00", color: "#06b6d4" },
      // Saturday
      { day_of_week: 5, title: "Sleep In & Relax",        activity_type: "personal", start_time: "08:00", end_time: "09:30", color: "#06b6d4" },
      { day_of_week: 5, title: "Family Brunch",           activity_type: "break",    start_time: "10:00", end_time: "11:30", color: "#ef4444" },
      { day_of_week: 5, title: "Family Outing",           activity_type: "personal", start_time: "13:00", end_time: "17:00", color: "#06b6d4" },
      { day_of_week: 5, title: "Light Dinner",            activity_type: "personal", start_time: "18:00", end_time: "19:00", color: "#ec4899" },
      // Sunday
      { day_of_week: 6, title: "Relaxed Morning",         activity_type: "personal", start_time: "08:00", end_time: "10:00", color: "#06b6d4" },
      { day_of_week: 6, title: "Meal Prep for Week",      activity_type: "personal", start_time: "11:00", end_time: "14:00", color: "#ec4899" },
      { day_of_week: 6, title: "Family Time",             activity_type: "personal", start_time: "15:00", end_time: "18:00", color: "#06b6d4" },
      { day_of_week: 6, title: "Plan Next Week",          activity_type: "work",     start_time: "20:00", end_time: "21:00", color: "#f59e0b" },
    ],
  },
  {
    key: "freelancer",
    label: "Freelancer / Remote Worker",
    icon: "bi-laptop",
    color: "#8b5cf6",
    desc: "Flexible work blocks, client calls, personal projects & fitness",
    entries: [
      // Monday
      { day_of_week: 0, title: "Morning Jog",             activity_type: "gym",      start_time: "07:00", end_time: "08:00", color: "#10b981" },
      { day_of_week: 0, title: "Deep Work Block",         activity_type: "work",     start_time: "09:00", end_time: "12:00", color: "#8b5cf6" },
      { day_of_week: 0, title: "Lunch Break",             activity_type: "break",    start_time: "12:00", end_time: "13:00", color: "#ef4444" },
      { day_of_week: 0, title: "Client Calls",            activity_type: "meeting",  start_time: "13:00", end_time: "14:30", color: "#f59e0b" },
      { day_of_week: 0, title: "Project Work",            activity_type: "work",     start_time: "15:00", end_time: "18:00", color: "#8b5cf6" },
      { day_of_week: 0, title: "Personal Project",        activity_type: "personal", start_time: "19:30", end_time: "21:00", color: "#06b6d4" },
      // Tuesday
      { day_of_week: 1, title: "Yoga / Stretch",          activity_type: "gym",      start_time: "07:00", end_time: "08:00", color: "#10b981" },
      { day_of_week: 1, title: "Deep Work Block",         activity_type: "work",     start_time: "09:00", end_time: "12:00", color: "#8b5cf6" },
      { day_of_week: 1, title: "Lunch Break",             activity_type: "break",    start_time: "12:00", end_time: "13:00", color: "#ef4444" },
      { day_of_week: 1, title: "Admin & Invoicing",       activity_type: "work",     start_time: "13:30", end_time: "15:00", color: "#f59e0b" },
      { day_of_week: 1, title: "Learning / Upskill",      activity_type: "study",    start_time: "15:30", end_time: "17:00", color: "#6366f1" },
      { day_of_week: 1, title: "Evening Walk",            activity_type: "personal", start_time: "18:00", end_time: "19:00", color: "#10b981" },
      // Wednesday
      { day_of_week: 2, title: "Morning Jog",             activity_type: "gym",      start_time: "07:00", end_time: "08:00", color: "#10b981" },
      { day_of_week: 2, title: "Deep Work Block",         activity_type: "work",     start_time: "09:00", end_time: "12:00", color: "#8b5cf6" },
      { day_of_week: 2, title: "Lunch Break",             activity_type: "break",    start_time: "12:00", end_time: "13:00", color: "#ef4444" },
      { day_of_week: 2, title: "Client Presentation",     activity_type: "meeting",  start_time: "14:00", end_time: "15:30", color: "#f59e0b" },
      { day_of_week: 2, title: "Project Work",            activity_type: "work",     start_time: "16:00", end_time: "18:00", color: "#8b5cf6" },
      // Thursday
      { day_of_week: 3, title: "Yoga / Stretch",          activity_type: "gym",      start_time: "07:00", end_time: "08:00", color: "#10b981" },
      { day_of_week: 3, title: "Deep Work Block",         activity_type: "work",     start_time: "09:00", end_time: "12:00", color: "#8b5cf6" },
      { day_of_week: 3, title: "Lunch Break",             activity_type: "break",    start_time: "12:00", end_time: "13:00", color: "#ef4444" },
      { day_of_week: 3, title: "Networking / Coffee Chat", activity_type: "meeting", start_time: "14:00", end_time: "15:00", color: "#f59e0b" },
      { day_of_week: 3, title: "Project Work",            activity_type: "work",     start_time: "15:30", end_time: "18:00", color: "#8b5cf6" },
      { day_of_week: 3, title: "Reading",                 activity_type: "reading",  start_time: "20:00", end_time: "21:00", color: "#ec4899" },
      // Friday
      { day_of_week: 4, title: "Morning Jog",             activity_type: "gym",      start_time: "07:00", end_time: "08:00", color: "#10b981" },
      { day_of_week: 4, title: "Light Work / Review",     activity_type: "work",     start_time: "09:00", end_time: "12:00", color: "#8b5cf6" },
      { day_of_week: 4, title: "Lunch Break",             activity_type: "break",    start_time: "12:00", end_time: "13:00", color: "#ef4444" },
      { day_of_week: 4, title: "Personal Project",        activity_type: "personal", start_time: "14:00", end_time: "16:00", color: "#06b6d4" },
      { day_of_week: 4, title: "Social Evening",          activity_type: "personal", start_time: "18:00", end_time: "20:00", color: "#06b6d4" },
      // Saturday
      { day_of_week: 5, title: "Sleep In",                activity_type: "personal", start_time: "09:00", end_time: "10:00", color: "#06b6d4" },
      { day_of_week: 5, title: "Gym / Sports",            activity_type: "gym",      start_time: "10:30", end_time: "12:00", color: "#10b981" },
      { day_of_week: 5, title: "Hobbies / Creative Work", activity_type: "personal", start_time: "14:00", end_time: "17:00", color: "#ec4899" },
      // Sunday
      { day_of_week: 6, title: "Relaxed Morning",         activity_type: "personal", start_time: "09:00", end_time: "11:00", color: "#06b6d4" },
      { day_of_week: 6, title: "Meal Prep",               activity_type: "personal", start_time: "12:00", end_time: "14:00", color: "#ec4899" },
      { day_of_week: 6, title: "Plan Next Week",          activity_type: "work",     start_time: "19:00", end_time: "20:00", color: "#f59e0b" },
    ],
  },
];

export default function SchedulePage() {
  const { user } = useAuth();
  const uname = user?.username || "guest";
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editEntry, setEditEntry] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [applyingTemplate, setApplyingTemplate] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [previewEntries, setPreviewEntries] = useState([]);
  const [editingIdx, setEditingIdx] = useState(null);

  const load = React.useCallback(async () => {
    try { setEntries(await getSchedule(uname)); } catch (e) { console.error(e); }
    setLoading(false);
  }, [uname]);
  useEffect(() => { load(); }, [load]);

  const handleSave = async (data) => {
    try {
      if (editEntry) { await updateScheduleEntry(editEntry.id, { ...data, user_name: uname }); }
      else { await addScheduleEntry({ ...data, user_name: uname }); }
      setEditEntry(null);
      setShowForm(false);
      load();
    } catch (e) { console.error(e); }
  };

  const handleEdit = (entry) => {
    setEditEntry(entry);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openPreview = (template) => {
    setPreviewTemplate(template);
    setPreviewEntries(template.entries.map((e, i) => ({ ...e, _id: i })));
    setEditingIdx(null);
  };

  const closePreview = () => { setPreviewTemplate(null); setPreviewEntries([]); setEditingIdx(null); };

  const updatePreviewEntry = (idx, field, value) => {
    setPreviewEntries(prev => prev.map((e, i) => i === idx ? { ...e, [field]: value } : e));
  };

  const deletePreviewEntry = (idx) => {
    setPreviewEntries(prev => prev.filter((_, i) => i !== idx));
    setEditingIdx(null);
  };

  const applyTemplate = async () => {
    if (!previewEntries.length) return;
    setApplyingTemplate(true);
    try {
      await clearSchedule(uname);
      const cleaned = previewEntries.map(({ _id, ...rest }) => rest);
      await addScheduleBulk(uname, cleaned);
      await load();
      closePreview();
      setShowTemplates(false);
    } catch (e) { console.error(e); }
    setApplyingTemplate(false);
  };

  // Activity type distribution for pie chart
  const typeCounts = entries.reduce((acc, e) => { acc[e.activity_type] = (acc[e.activity_type] || 0) + 1; return acc; }, {});
  const pieData = Object.entries(typeCounts).map(([name, value]) => ({ name, value }));

  // Day distribution
  const dayCounts = entries.reduce((acc, e) => { acc[e.day_of_week] = (acc[e.day_of_week] || 0) + 1; return acc; }, {});
  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  const todayName = DAYS[todayIdx];
  const todayEntries = entries.filter(e => e.day_of_week === todayIdx);

  if (loading) return <div className="container py-5 text-center"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="wb-page-header mb-0"><i className="bi bi-calendar-week me-2"></i>Weekly Schedule</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary" onClick={() => setShowTimer(!showTimer)}>
            <i className={`bi ${showTimer ? "bi-x-lg" : "bi-stopwatch"} me-1`}></i>{showTimer ? "Hide Timer" : "Activity Timer"}
          </button>
          <button className="btn btn-outline-info" onClick={() => setShowTemplates(!showTemplates)}>
            <i className={`bi ${showTemplates ? "bi-x-lg" : "bi-collection"} me-1`}></i>{showTemplates ? "Hide Templates" : "Use Template"}
          </button>
          <button className="btn btn-wb-primary" onClick={() => { setEditEntry(null); setShowForm(!showForm); }}>
            <i className={`bi ${showForm ? "bi-x-lg" : "bi-plus-lg"} me-1`}></i>{showForm ? "Close Form" : "Add Activity"}
          </button>
        </div>
      </div>

      {/* Template Selector */}
      {showTemplates && (
        <div className="wb-card-static p-4 mb-4">
          <h5 className="fw-bold mb-1 wb-card-title"><i className="bi bi-collection me-2"></i>Choose a Schedule Template</h5>
          <p className="text-muted small mb-3">Pick a template to preview &amp; customise before applying.</p>
          <div className="row g-3">
            {TEMPLATES.map(t => (
              <div className="col-6 col-lg-4" key={t.key}>
                <div className="p-3 rounded-3 h-100" role="button" onClick={() => openPreview(t)}
                  style={{ background: `${t.color}10`, border: `2px solid ${t.color}30`, cursor: "pointer", transition: "all .2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = t.color; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 4px 15px ${t.color}25`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = `${t.color}30`; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <i className={`bi ${t.icon}`} style={{ fontSize: "1.6rem", color: t.color }}></i>
                    <span className="fw-bold">{t.label}</span>
                  </div>
                  <div className="text-muted small mb-2">{t.desc}</div>
                  <span className="badge" style={{ background: t.color, color: "#fff" }}>{t.entries.length} activities</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Template Preview Modal ── */}
      {previewTemplate && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,.55)" }} onClick={closePreview}>
          <div className="modal-dialog modal-xl modal-dialog-scrollable" onClick={e => e.stopPropagation()}>
            <div className="modal-content" style={{ borderTop: `4px solid ${previewTemplate.color}` }}>
              <div className="modal-header py-2">
                <h5 className="modal-title d-flex align-items-center gap-2 mb-0">
                  <i className={`bi ${previewTemplate.icon}`} style={{ color: previewTemplate.color, fontSize: "1.4rem" }}></i>
                  {previewTemplate.label} — Preview &amp; Edit
                </h5>
                <button className="btn-close" onClick={closePreview}></button>
              </div>

              <div className="modal-body" style={{ maxHeight: "70vh" }}>
                <p className="text-muted small mb-3">
                  <i className="bi bi-info-circle me-1"></i>
                  Click the <i className="bi bi-pencil"></i> icon on any activity to edit it, or <i className="bi bi-trash"></i> to remove it before applying.
                </p>

                {DAYS.map((dayName, dayIdx) => {
                  const dayEntries = previewEntries
                    .map((e, origIdx) => ({ ...e, origIdx }))
                    .filter(e => e.day_of_week === dayIdx)
                    .sort((a, b) => (a.start_time || "").localeCompare(b.start_time || ""));
                  if (!dayEntries.length) return null;
                  return (
                    <div key={dayIdx} className="mb-3">
                      <h6 className="fw-bold mb-2" style={{ color: previewTemplate.color }}>
                        <i className="bi bi-calendar3 me-1"></i>{dayName}
                        <span className="badge bg-secondary ms-2 fw-normal" style={{ fontSize: ".7rem" }}>{dayEntries.length}</span>
                      </h6>
                      <div className="position-relative" style={{ paddingLeft: 18, borderLeft: `2px solid ${previewTemplate.color}30` }}>
                        {dayEntries.map(entry => {
                          const isEditing = editingIdx === entry.origIdx;
                          return (
                            <div key={entry.origIdx} className="d-flex align-items-start gap-2 mb-2 position-relative">
                              {/* timeline dot */}
                              <span style={{ position: "absolute", left: -24, top: 8, width: 10, height: 10, borderRadius: "50%", background: entry.color || previewTemplate.color, border: "2px solid #fff", boxShadow: `0 0 0 2px ${entry.color || previewTemplate.color}40` }}></span>

                              {isEditing ? (
                                /* ── inline edit row ── */
                                <div className="flex-grow-1 p-2 rounded-3" style={{ background: `${previewTemplate.color}08`, border: `1px solid ${previewTemplate.color}30` }}>
                                  <div className="row g-2 align-items-end">
                                    <div className="col-sm-4">
                                      <label className="form-label mb-0 small">Title</label>
                                      <input className="form-control form-control-sm" value={entry.title}
                                        onChange={e => updatePreviewEntry(entry.origIdx, "title", e.target.value)} />
                                    </div>
                                    <div className="col-6 col-sm-2">
                                      <label className="form-label mb-0 small">Start</label>
                                      <input type="time" className="form-control form-control-sm" value={entry.start_time}
                                        onChange={e => updatePreviewEntry(entry.origIdx, "start_time", e.target.value)} />
                                    </div>
                                    <div className="col-6 col-sm-2">
                                      <label className="form-label mb-0 small">End</label>
                                      <input type="time" className="form-control form-control-sm" value={entry.end_time}
                                        onChange={e => updatePreviewEntry(entry.origIdx, "end_time", e.target.value)} />
                                    </div>
                                    <div className="col-sm-2">
                                      <label className="form-label mb-0 small">Type</label>
                                      <select className="form-select form-select-sm" value={entry.activity_type}
                                        onChange={e => updatePreviewEntry(entry.origIdx, "activity_type", e.target.value)}>
                                        {["study","gym","work","meeting","break","personal","reading","commute","other"].map(t => (
                                          <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                                        ))}
                                      </select>
                                    </div>
                                    <div className="col-sm-2 d-flex gap-1 align-items-end">
                                      <input type="color" className="form-control form-control-sm form-control-color p-0" style={{ width: 32, height: 31 }} value={entry.color || "#6366f1"}
                                        onChange={e => updatePreviewEntry(entry.origIdx, "color", e.target.value)} />
                                      <button className="btn btn-sm btn-outline-success" onClick={() => setEditingIdx(null)} title="Done">
                                        <i className="bi bi-check-lg"></i>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                /* ── read-only row ── */
                                <div className="flex-grow-1 d-flex align-items-center gap-2 p-2 rounded-3"
                                  style={{ background: `${entry.color || previewTemplate.color}10` }}>
                                  <span className="badge" style={{ background: entry.color || previewTemplate.color, color: "#fff", minWidth: 90 }}>
                                    {entry.start_time} – {entry.end_time}
                                  </span>
                                  <span className="fw-semibold">{entry.title}</span>
                                  <span className="text-muted small ms-auto d-none d-sm-inline">{entry.activity_type}</span>
                                  <button className="btn btn-sm btn-outline-secondary py-0 px-1" title="Edit" onClick={() => setEditingIdx(entry.origIdx)}>
                                    <i className="bi bi-pencil" style={{ fontSize: ".75rem" }}></i>
                                  </button>
                                  <button className="btn btn-sm btn-outline-danger py-0 px-1" title="Remove" onClick={() => deletePreviewEntry(entry.origIdx)}>
                                    <i className="bi bi-trash" style={{ fontSize: ".75rem" }}></i>
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="modal-footer d-flex justify-content-between">
                <span className="text-muted small"><i className="bi bi-list-check me-1"></i>{previewEntries.length} activities across {new Set(previewEntries.map(e => e.day_of_week)).size} days</span>
                <div className="d-flex gap-2">
                  <button className="btn btn-outline-secondary" onClick={closePreview}>Cancel</button>
                  <button className="btn btn-wb-primary" onClick={applyTemplate} disabled={applyingTemplate || !previewEntries.length}>
                    {applyingTemplate
                      ? <><span className="spinner-border spinner-border-sm me-1"></span>Applying…</>
                      : <><i className="bi bi-check2-all me-1"></i>Apply Template</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KPI */}
      <div className="row g-3 mb-4">
        {[
          { label: "Total Activities", value: entries.length, icon: "bi-list-check", color: "primary" },
          { label: "Today's Activities", value: todayEntries.length, icon: "bi-calendar-day", color: "success" },
          { label: "Activity Types", value: Object.keys(typeCounts).length, icon: "bi-tags", color: "info" },
          { label: "Busiest Day", value: DAYS[Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0]?.[0]] || "N/A", icon: "bi-graph-up", color: "warning" },
        ].map((k, i) => (
          <div className="col-6 col-md-3" key={i}>
            <div className="wb-card-static p-3 text-center h-100">
              <i className={`bi ${k.icon} text-${k.color}`} style={{ fontSize: "1.4rem" }}></i>
              <div className="fw-bold fs-5 mt-1">{k.value}</div>
              <div className="text-muted small">{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Timer */}
      {showTimer && (
        <div className="mb-4">
          <ActivityTimer />
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="wb-card-static p-4 mb-4">
          <h5 className="fw-bold mb-3 wb-card-title">
            <i className={`bi ${editEntry ? "bi-pencil" : "bi-plus-circle"} me-2`}></i>
            {editEntry ? "Edit Activity" : "New Activity"}
          </h5>
          <ScheduleForm entry={editEntry} onSave={handleSave} onCancel={() => { setShowForm(false); setEditEntry(null); }} />
        </div>
      )}

      {/* Weekly Grid */}
      <WeeklySchedule entries={entries} onEdit={handleEdit} onRefresh={load} />

      {/* Charts */}
      {entries.length > 0 && (
        <div className="row g-4 mt-2">
          <div className="col-md-6">
            <ActivityPieChart data={pieData} title="Activity Type Distribution" />
          </div>
          <div className="col-md-6">
            <div className="wb-card-static p-4">
              <h6 className="fw-bold wb-card-title mb-3"><i className="bi bi-bar-chart me-2"></i>Scheduled Hours per Day</h6>
              <div className="d-flex align-items-end gap-2" style={{ height: 200 }}>
                {DAYS.map((d, idx) => {
                  const dayEntries = entries.filter(e => e.day_of_week === idx);
                  const hours = dayEntries.reduce((sum, e) => {
                    if (!e.start_time || !e.end_time) return sum;
                    const [sh, sm] = e.start_time.split(":").map(Number);
                    const [eh, em] = e.end_time.split(":").map(Number);
                    return sum + ((eh * 60 + em) - (sh * 60 + sm)) / 60;
                  }, 0);
                  const maxHrs = Math.max(...DAYS.map((_, di) =>
                    entries.filter(e => e.day_of_week === di).reduce((s, e) => {
                      if (!e.start_time || !e.end_time) return s;
                      const [sh, sm] = e.start_time.split(":").map(Number);
                      const [eh, em] = e.end_time.split(":").map(Number);
                      return s + ((eh * 60 + em) - (sh * 60 + sm)) / 60;
                    }, 0)
                  ), 1);
                  return (
                    <div key={d} className="d-flex flex-column align-items-center flex-fill">
                      <div className="small fw-bold mb-1">{hours.toFixed(1)}h</div>
                      <div className="rounded-pill w-100"
                        style={{ height: `${(hours / maxHrs) * 150}px`, minHeight: 4, background: idx === todayIdx ? "#6366f1" : "rgba(99,102,241,0.2)", transition: "height 0.3s" }} />
                      <div className="text-muted mt-1" style={{ fontSize: "0.7rem" }}>{d.slice(0, 3)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Today's Schedule */}
      {todayEntries.length > 0 && (
        <div className="wb-card-static p-4 mt-4">
          <h5 className="fw-bold mb-3 wb-card-title"><i className="bi bi-calendar-check me-2"></i>Today's Schedule ({todayName})</h5>
          <div className="row g-2">
            {todayEntries.sort((a, b) => (a.start_time || "").localeCompare(b.start_time || "")).map(e => (
              <div className="col-md-4" key={e.id}>
                <div className="p-3 rounded-3" style={{ background: `${e.color || "#6366f1"}15`, borderLeft: `3px solid ${e.color || "#6366f1"}` }}>
                  <div className="fw-bold">{e.activity_type}</div>
                  <div className="text-muted small">{e.start_time} – {e.end_time}</div>
                  {e.notes && <div className="small mt-1">{e.notes}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
