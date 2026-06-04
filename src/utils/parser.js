/**
 * Smart Parser for TaskFlow AI
 * Detects verbs, subjects, dates, and priorities from natural language.
 */

const VERBS = {
  submit: ['submit', 'give', 'hand in', 'upload', 'send'],
  practice: ['practice', 'solve', 'do', 'work on', 'try'],
  pay: ['pay', 'tax', 'fee', 'tuition', 'amount'],
  remind: ['remind', 'remember', 'alert', 'callback'],
  meeting: ['join', 'attend', 'meeting', 'class', 'lecture']
};

const SUBJECTS = ['school', 'tuition', 'tax', 'oregon', 'math', 'homework', 'practice', 'exam', 'test'];

/**
 * Given a day name, find the next occurrence of that day (including today if it matches).
 */
function getNextDayDate(dayName) {
  const dayMap = { sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6 };
  const targetDay = dayMap[dayName.toLowerCase()];
  if (targetDay === undefined) return null;
  
  const now = new Date();
  const currentDay = now.getDay();
  let daysAhead = targetDay - currentDay;
  if (daysAhead < 0) daysAhead += 7;
  if (daysAhead === 0) daysAhead = 7; // if today is the same day, assume next week
  
  const targetDate = new Date(now);
  targetDate.setDate(now.getDate() + daysAhead);
  targetDate.setHours(0, 0, 0, 0);
  return targetDate;
}

export const processMessage = (text) => {
  const lowercase = text.toLowerCase();
  
  // 1. Detect Action Verb
  let detectedVerb = 'task';
  for (const [verb, aliases] of Object.entries(VERBS)) {
    if (aliases.some(alias => lowercase.includes(alias))) {
      detectedVerb = verb;
      break;
    }
  }

  // 2. Detect Subject
  let detectedSubject = 'General';
  const subjectsInText = SUBJECTS.filter(sub => lowercase.includes(sub));
  if (subjectsInText.length > 0) {
    detectedSubject = subjectsInText[0].charAt(0).toUpperCase() + subjectsInText[0].slice(1);
  }

  // 3. Detect Deadline/Time (Simple Heuristic)
  let deadline = 'No due date';
  let deadlineDate = null;
  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  if (lowercase.includes('tomorrow')) {
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    deadline = `Tomorrow (${days[tomorrow.getDay()]})`;
    deadlineDate = tomorrow.toISOString();
  } else if (lowercase.includes('today')) {
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    deadline = `Today (${days[now.getDay()]})`;
    deadlineDate = today.toISOString();
  } else {
    // Check for day names
    for (const dayName of dayNames) {
      if (lowercase.includes(dayName)) {
        const nextDate = getNextDayDate(dayName);
        if (nextDate) {
          const capitalDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);
          deadline = capitalDay;
          deadlineDate = nextDate.toISOString();
        }
        break;
      }
    }
    if (!deadlineDate && lowercase.includes('soon')) {
      deadline = 'ASAP';
    }
  }
  
  // Extract potential time (e.g. 5pm, 10:00)
  const timeMatch = text.match(/(\d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM))/);
  if (timeMatch) {
    deadline += ` at ${timeMatch[1]}`;
  }

  // 4. Determine Priority
  let priority = 'low';
  if (detectedVerb === 'pay' || detectedVerb === 'submit' || lowercase.includes('urgent') || lowercase.includes('important')) {
    priority = 'high';
  } else if (detectedVerb === 'practice') {
    priority = 'medium';
  }

  return {
    id: Date.now(),
    originalText: text,
    title: text.length > 40 ? text.substring(0, 40) + '...' : text,
    verb: detectedVerb,
    subject: detectedSubject,
    deadline,
    deadlineDate,
    priority,
    status: 'pending',
    createdAt: new Date().toISOString(),
    note: ''
  };
};
