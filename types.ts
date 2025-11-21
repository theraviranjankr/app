
export enum DayOfWeek {
  Monday = 'Montag',
  Tuesday = 'Dienstag',
  Wednesday = 'Mittwoch',
  Thursday = 'Donnerstag',
  Friday = 'Freitag',
  Saturday = 'Samstag',
  Sunday = 'Sonntag'
}

export interface ClassSession {
  id: string;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  subject: string;
  teacher: string;
  room?: string;
  type?: 'Lecture' | 'Lab' | 'Seminar';
}

export interface AttendanceRecord {
  missedHours: number; // 1 hour = 45 mins typically, but policy mentions "Double Hours"
  lastUpdated: string;
}

export interface PolicySection {
  title: string;
  content: string;
  important?: boolean;
}

export interface CalendarEvent {
  id: string;
  date: Date;
  title: string;
  location?: string;
  description?: string;
  isAllDay: boolean;
}

export interface Student {
  id: number;
  lastName: string;
  firstName: string;
  email: string;
  role: 'Teilnehmer/in' | 'Trainer/in';
  nationality?: string;
  course: '26 TI G1' | '26 TI G2' | 'Other' | 'Both';
}

export interface SyllabusItem {
  id: string;
  title: string;
  isDone: boolean;
  addedBy?: 'user' | 'system';
  lastRevised?: string; // ISO Date string
  revisionCount?: number;
}

export interface SubjectMeta {
  moodleName: string;
  moodleUrl?: string; // Direct URL if known
  teacher: string;
  color: string;
  iconColor: string;
  defaultTopic: string;
  defaultBullets: string[];
  fullSyllabus?: string[]; // Optional full list of topics provided by user
}

export interface Flashcard {
  id: string;
  front: string; // German word/phrase
  back: string; // Definition/Translation
  context?: string; // Example sentence
  nextReview: number; // Timestamp
  interval: number; // Days
  easeFactor: number; // SM-2 multiplier
  repetitions: number;
}

export interface Grade {
  id: string;
  name: string; // e.g. "Klausur 1"
  value: number; // 1.0 - 6.0
  weight: number; // e.g. 1 for normal, 2 for big exam
  date: string;
}

export interface GradeSubject {
  id: string;
  name: string;
  grades: Grade[];
  targetGrade?: number;
}
