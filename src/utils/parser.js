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
  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  if (lowercase.includes('tomorrow')) {
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    deadline = `Tomorrow (${days[tomorrow.getDay()]})`;
  } else if (lowercase.includes('today')) {
    deadline = `Today (${days[now.getDay()]})`;
  } else if (lowercase.includes('monday')) deadline = 'Monday';
  else if (lowercase.includes('tuesday')) deadline = 'Tuesday';
  else if (lowercase.includes('wednesday')) deadline = 'Wednesday';
  else if (lowercase.includes('thursday')) deadline = 'Thursday';
  else if (lowercase.includes('friday')) deadline = 'Friday';
  else if (lowercase.includes('soon')) deadline = 'ASAP';
  
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
    priority,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
};
