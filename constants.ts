
import { ClassSession, DayOfWeek, PolicySection, Student, SubjectMeta } from './types';

export const ICS_CALENDAR_URL = "https://outlook.office365.com/owa/calendar/61b28cdaf770498faac2eccc6d8c53f1@hs-coburg.de/e0f3f7417ff04b799f28f66d6a97c1d316607739002608296343/S-1-8-2405105858-2574225194-3384497871-3013577122/reachcalendar.ics";
export const MOODLE_URL = "https://moodle.hs-coburg.de/my/courses.php";
export const CONTACT_EMAIL = "studienkolleg@hs-coburg.de";

export const WEEK_SCHEDULE: ClassSession[] = [
  // Monday
  { id: 'm1', day: DayOfWeek.Monday, startTime: '08:15', endTime: '09:00', subject: 'Analysis', teacher: 'Hadwiger', room: '9-006', type: 'Lecture' },
  { id: 'm2', day: DayOfWeek.Monday, startTime: '09:00', endTime: '09:45', subject: 'Analysis', teacher: 'Hadwiger', room: '9-006', type: 'Lecture' },
  { id: 'm3', day: DayOfWeek.Monday, startTime: '10:00', endTime: '10:45', subject: 'Physik', teacher: 'Stößel', room: '9-006', type: 'Lecture' },
  { id: 'm4', day: DayOfWeek.Monday, startTime: '10:45', endTime: '11:30', subject: 'Physik', teacher: 'Stößel', room: '9-006', type: 'Lecture' },
  { id: 'm5', day: DayOfWeek.Monday, startTime: '12:15', endTime: '13:00', subject: 'Deutsch', teacher: 'Klug', room: '9-006', type: 'Lecture' },
  { id: 'm6', day: DayOfWeek.Monday, startTime: '13:00', endTime: '13:45', subject: 'Deutsch', teacher: 'Klug', room: '9-006', type: 'Lecture' },

  // Tuesday
  { id: 't1', day: DayOfWeek.Tuesday, startTime: '08:15', endTime: '09:00', subject: 'Physik-Praktikum', teacher: 'Stößel', room: '9-006', type: 'Lab' },
  { id: 't2', day: DayOfWeek.Tuesday, startTime: '09:00', endTime: '09:45', subject: 'Physik-Praktikum', teacher: 'Stößel', room: '9-006', type: 'Lab' },
  { id: 't3', day: DayOfWeek.Tuesday, startTime: '10:00', endTime: '10:45', subject: 'Informatik', teacher: 'Pfeffer', room: '4-319', type: 'Lab' },
  { id: 't4', day: DayOfWeek.Tuesday, startTime: '10:45', endTime: '11:30', subject: 'Informatik', teacher: 'Pfeffer', room: '4-319', type: 'Lab' },
  { id: 't5', day: DayOfWeek.Tuesday, startTime: '12:15', endTime: '13:00', subject: 'Chemie', teacher: 'Ohlraun', room: '9-006', type: 'Lecture' },
  { id: 't6', day: DayOfWeek.Tuesday, startTime: '13:00', endTime: '13:45', subject: 'Chemie', teacher: 'Ohlraun', room: '9-006', type: 'Lecture' },
  { id: 't7', day: DayOfWeek.Tuesday, startTime: '14:00', endTime: '14:45', subject: 'Deutsch', teacher: 'Kessel', room: '9-006', type: 'Lecture' },
  { id: 't8', day: DayOfWeek.Tuesday, startTime: '14:45', endTime: '15:30', subject: 'Deutsch', teacher: 'Kessel', room: '9-006', type: 'Lecture' },

  // Wednesday
  { id: 'w1', day: DayOfWeek.Wednesday, startTime: '08:15', endTime: '09:00', subject: 'Darstellende Geometrie', teacher: 'Dietel', room: '9-006', type: 'Lecture' },
  { id: 'w2', day: DayOfWeek.Wednesday, startTime: '09:00', endTime: '09:45', subject: 'Darstellende Geometrie', teacher: 'Dietel', room: '9-006', type: 'Lecture' },
  { id: 'w3', day: DayOfWeek.Wednesday, startTime: '10:00', endTime: '10:45', subject: 'Deutsch', teacher: 'Kessel', room: '9-006', type: 'Lecture' },
  { id: 'w4', day: DayOfWeek.Wednesday, startTime: '10:45', endTime: '11:30', subject: 'Deutsch', teacher: 'Kessel', room: '9-006', type: 'Lecture' },
  { id: 'w5', day: DayOfWeek.Wednesday, startTime: '12:15', endTime: '13:00', subject: 'Geometrie', teacher: 'Kessler', room: '9-006', type: 'Lecture' },
  { id: 'w6', day: DayOfWeek.Wednesday, startTime: '13:00', endTime: '13:45', subject: 'Geometrie', teacher: 'Kessler', room: '9-006', type: 'Lecture' },
  { id: 'w7', day: DayOfWeek.Wednesday, startTime: '14:00', endTime: '14:45', subject: 'Physik-Praktikum', teacher: 'Stößel', room: '9-006', type: 'Lab' },
  { id: 'w8', day: DayOfWeek.Wednesday, startTime: '14:45', endTime: '15:30', subject: 'Physik-Praktikum', teacher: 'Stößel', room: '9-006', type: 'Lab' },

  // Thursday
  { id: 'th1', day: DayOfWeek.Thursday, startTime: '08:15', endTime: '09:00', subject: 'Deutsch', teacher: 'Klug', room: '9-006', type: 'Lecture' },
  { id: 'th2', day: DayOfWeek.Thursday, startTime: '09:00', endTime: '09:45', subject: 'Deutsch', teacher: 'Klug', room: '9-006', type: 'Lecture' },
  { id: 'th3', day: DayOfWeek.Thursday, startTime: '10:00', endTime: '10:45', subject: 'Analysis', teacher: 'Hadwiger', room: '9-006', type: 'Lecture' },
  { id: 'th4', day: DayOfWeek.Thursday, startTime: '10:45', endTime: '11:30', subject: 'Analysis', teacher: 'Hadwiger', room: '9-006', type: 'Lecture' },
  { id: 'th5', day: DayOfWeek.Thursday, startTime: '12:15', endTime: '13:00', subject: 'Chemie', teacher: 'Ohlraun', room: '9-006', type: 'Lecture' },
  { id: 'th6', day: DayOfWeek.Thursday, startTime: '13:00', endTime: '13:45', subject: 'Chemie', teacher: 'Ohlraun', room: '9-006', type: 'Lecture' },
  { id: 'th7', day: DayOfWeek.Thursday, startTime: '14:00', endTime: '14:45', subject: 'Informatik', teacher: 'Pfeffer', room: '4-319', type: 'Lab' },
  { id: 'th8', day: DayOfWeek.Thursday, startTime: '14:45', endTime: '15:30', subject: 'Informatik', teacher: 'Pfeffer', room: '4-319', type: 'Lab' },

  // Friday
  { id: 'f1', day: DayOfWeek.Friday, startTime: '08:15', endTime: '09:00', subject: 'Physik', teacher: 'Stößel', room: '9-006', type: 'Lecture' },
  { id: 'f2', day: DayOfWeek.Friday, startTime: '09:00', endTime: '09:45', subject: 'Physik', teacher: 'Stößel', room: '9-006', type: 'Lecture' },
  { id: 'f3', day: DayOfWeek.Friday, startTime: '10:00', endTime: '10:45', subject: 'Geometrie', teacher: 'Kessler', room: '9-006', type: 'Lecture' },
  { id: 'f4', day: DayOfWeek.Friday, startTime: '10:45', endTime: '11:30', subject: 'Geometrie', teacher: 'Kessler', room: '9-006', type: 'Lecture' },
  { id: 'f5', day: DayOfWeek.Friday, startTime: '11:45', endTime: '12:30', subject: 'Darstellende Geometrie', teacher: 'Dietel', room: '9-006', type: 'Lecture' },
  { id: 'f6', day: DayOfWeek.Friday, startTime: '12:30', endTime: '13:15', subject: 'Darstellende Geometrie', teacher: 'Dietel', room: '9-006', type: 'Lecture' },
];

export const ATTENDANCE_POLICIES: PolicySection[] = [
  {
    title: "Allgemeine Pflichten",
    content: "Studierende müssen pünktlich am gesamten Unterricht und an Pflichtveranstaltungen teilnehmen. Die Anwesenheit wird ab dem ersten Tag geprüft."
  },
  {
    title: "Fehlzeiten & Exmatrikulation",
    content: "Unentschuldigte Fehlzeiten werden geahndet. Mehr als 40 Fehlstunden (20 Doppelstunden) ohne ausreichende Entschuldigung führen zur Exmatrikulation.",
    important: true
  },
  {
    title: "Krankmeldung",
    content: "Muss bis spätestens 08:00 Uhr des Fehltages per E-Mail (Name, Kurs) an studienkolleg@hs-coburg.de erfolgen. Bei Erkrankung während des Tages beim Dozenten abmelden und E-Mail senden."
  },
  {
    title: "Attestpflicht",
    content: "Bei häufigen Fehlzeiten kann Attestpflicht ab dem ersten Tag verhängt werden. Bei angekündigten Leistungsnachweisen ist IMMER ein Attest vom ersten Krankheitstag erforderlich, sonst Note 6.",
    important: true
  },
  {
    title: "Befreiung",
    content: "Für unaufschiebbare Termine muss 1 Woche vorher ein schriftlicher Antrag im Sekretariat gestellt werden."
  }
];

export const SUBJECT_METADATA: Record<string, SubjectMeta> = {
  "Analysis": { 
    moodleName: "Studienkolleg - Analysis 26 WiSe 2025/26 (Hadwiger)",
    moodleUrl: "https://moodle.hs-coburg.de/course/view.php?id=16845",
    teacher: "Herr Hadwiger", 
    color: "bg-blue-50 border-blue-200", 
    iconColor: "text-blue-600",
    defaultTopic: "1. Mathematische Grundlagen",
    defaultBullets: ["1.1 Zahlenbereiche", "1.2 Grundoperationen", "1.3 Gleichungen"],
    fullSyllabus: [
      "1. Mathematische Grundlagen",
      "1.1 Zahlenbereiche",
      "1.2 Mathematische Grundoperationen",
      "1.3 Gleichungen",
      "1.4 Mengenlehre",
      "2. Funktionen (Grundlagen)",
      "2.2 Lineare Funktionen",
      "2.3 Quadratische Funktionen (Not in Exam 1)"
    ]
  },
  "Physik": { 
    moodleName: "WiSe 2526 Physik 26 TI G2",
    moodleUrl: "https://moodle.hs-coburg.de/course/view.php?id=16579",
    teacher: "Herr Stößel", 
    color: "bg-indigo-50 border-indigo-200", 
    iconColor: "text-indigo-600",
    defaultTopic: "2. Dynamik",
    defaultBullets: ["Bewegungsgleichungen", "Freier Fall", "Wurf"],
    fullSyllabus: [
      "0. Praktikum (V00 - V05)",
      "1. Grundlagen der Physik",
      "2. Dynamik zweidimensionaler Bewegungen",
      "2.1 Geschwindigkeit",
      "2.2 Gleichförmige Bewegung",
      "2.3 Newtonsche Bewegungsgleichung",
      "2.4 Beschleunigung und Kraft",
      "2.5 Gleichmäßig beschleunigte Bewegung",
      "2.6 Gewichtskraft und Freier Fall",
      "2.7 Senkrechter Wurf",
      "2.8 Waagrechter Wurf",
      "2.9 Schräger Wurf",
      "2.10 Kräftezerlegung und -addition"
    ]
  },
  "Informatik": { 
    moodleName: "WS 2025_26 Studienkolleg Informatik TIG2 1. Semester (Pfeffer)",
    moodleUrl: "https://moodle.hs-coburg.de/course/view.php?id=16223",
    teacher: "Herr Pfeffer", 
    color: "bg-purple-50 border-purple-200", 
    iconColor: "text-purple-600",
    defaultTopic: "3. Zahlensysteme",
    defaultBullets: ["Binärsystem", "Hexadezimalsystem", "Umrechnungen"],
    fullSyllabus: [
      "1. Information (Speichern)",
      "2. Textverarbeitung",
      "2.x Klassendiagramme",
      "3. Zahlensysteme",
      "3.1 - 3.14 Umrechnungen & Aufgaben"
    ]
  },
  "Chemie": { 
    moodleName: "WiSe 2526 Chemie 26TI (Ohlraun)",
    moodleUrl: "https://moodle.hs-coburg.de/course/view.php?id=16869",
    teacher: "Frau Ohlraun", 
    color: "bg-green-50 border-green-200", 
    iconColor: "text-green-600",
    defaultTopic: "2. Atombau",
    defaultBullets: ["Bohrsches Atommodell", "Periodensystem", "Elektronenkonfiguration"],
    fullSyllabus: [
      "1. Stoffe und Reaktionen",
      "1.2 Trennverfahren",
      "1.3 Chemische Reaktion & Gleichungen",
      "1.x Gasnachweise",
      "2. Atombau und Periodensystem",
      "Atommodell von John Dalton",
      "Periodensystem (PSE)"
    ]
  },
  "Deutsch (Klug)": { 
    moodleName: "Studienkolleg 26TIG2 Deutsch (Klug)",
    moodleUrl: "https://moodle.hs-coburg.de/course/view.php?id=16497",
    teacher: "Frau Klug", 
    color: "bg-orange-50 border-orange-200", 
    iconColor: "text-orange-600",
    defaultTopic: "Umwelt & Klima",
    defaultBullets: ["Kurzpräsentationen", "Grafikbeschreibung", "Grammatik"],
    fullSyllabus: [
      "Thema: Sprache und Kommunikation",
      "Thema: Die Stadt der Zukunft (Megastädte)",
      "Thema: Wasser & Wasserfußabdruck",
      "Thema: Umwelt & Klima (Treibhauseffekt)",
      "Kurzpräsentationen (ab 24.11)",
      "Grafikbeschreibung (Aufbau & Redemittel)",
      "Grammatik (Artikel, Passiv, Konjunktiv II, Nomen-Verb)"
    ]
  },
  "Deutsch (Kessel)": { 
    moodleName: "Studienkolleg Deutsch 26 TIG2 1. Semester (Kessel)",
    moodleUrl: "https://moodle.hs-coburg.de/course/view.php?id=16610",
    teacher: "Frau Kessel", 
    color: "bg-amber-50 border-amber-200", 
    iconColor: "text-amber-600",
    defaultTopic: "Deutsche Erfindungen",
    defaultBullets: ["Gutenberg", "Buchdruck", "Sprachstrukturen"],
    fullSyllabus: [
      "Deutschland und die Deutschen",
      "Gebrauchsanweisung für Deutschland",
      "Mark Twain: Die schreckliche deutsche Sprache",
      "Grammatik & Klausurvorbereitung",
      "Deutsche Erfindungen",
      "Gutenberg und der Buchdruck",
      "Sprachstrukturen (Satzbau)"
    ]
  },
  "Geometrie": { 
    moodleName: "Geometrie I TI G2 (Kessler)",
    moodleUrl: "https://moodle.hs-coburg.de/course/view.php?id=16958",
    teacher: "Frau Kessler", 
    color: "bg-teal-50 border-teal-200", 
    iconColor: "text-teal-600",
    defaultTopic: "V. Dreiecke im Detail",
    defaultBullets: ["Satzgruppe des Pythagoras", "Thaleskreis", "Sinus/Kosinus"],
    fullSyllabus: [
      "I. Grundlagen der Geometrie (Koordinaten, Punkte, Linien)",
      "II. Winkel (Doppelkreuzungen)",
      "III. Symmetrien und Grundkonstruktionen",
      "IV. Flächenberechnungen (Kreis)",
      "V. Dreiecke im Detail",
      "V.1 Besondere Dreiecke",
      "V.2 Thaleskreis",
      "V.3 Satzgruppe des Pythagoras",
      "V.5 Sinus, Kosinus, Tangens"
    ]
  },
  "Darstellende Geometrie": { 
    moodleName: "Studienkolleg - Darstellende Geometrie 1 (StR Dietel)",
    moodleUrl: "https://moodle.hs-coburg.de/course/view.php?id=16335",
    teacher: "Herr Dietel", 
    color: "bg-cyan-50 border-cyan-200", 
    iconColor: "text-cyan-600",
    defaultTopic: "Projektionsmethoden",
    defaultBullets: ["DIN Normen", "Orthogonale Darstellungen", "Axonometrie"],
    fullSyllabus: [
      "Grundlagen & Normen (DIN ISO)",
      "Grundkonstruktionen",
      "Regelmäßige Vielecke",
      "Kreisanschlüsse",
      "Linienarten und Bemaßung (DIN EN ISO 128)",
      "Projektionsmethoden (Orthogonal, Axonometrisch, Zentral)"
    ]
  },
};

export const STUDENT_LIST: Student[] = [
  // TRAINERS
  { id: 1001, lastName: "Hadwiger", firstName: "Markus", email: "markus.hadwiger@hs-coburg.de", role: "Trainer/in", nationality: "German", course: "Both" },
  { id: 1002, lastName: "Stößel", firstName: "Sebastian", email: "sebastian.stoessel@hs-coburg.de", role: "Trainer/in", nationality: "German", course: "Both" },
  { id: 1003, lastName: "Ohlraun", firstName: "Franziska", email: "franziska.ohlraun@hs-coburg.de", role: "Trainer/in", nationality: "German", course: "Both" },

  // 26 TI G2 (Your Course - Verified List)
  { id: 1, lastName: "Ashouri Mehranjani", firstName: "Mehdi", email: "Mehdi.Ashouri-Mehranjani@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Iranian", course: "26 TI G2" },
  { id: 2, lastName: "Colindres Osorto", firstName: "Genesis Soleil", email: "Genesis-Soleil.Colindres-Osorto@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Honduran/Latin American", course: "26 TI G2" },
  { id: 3, lastName: "Dadadzhanova", firstName: "Gulnoza", email: "Gulnoza.Dadadzhanova@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Uzbek/Tajik", course: "26 TI G2" },
  { id: 4, lastName: "De Maracaja E Nogueira", firstName: "Maria", email: "Maria.De-Maracaja-E-Nogueira@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Brazilian", course: "26 TI G2" },
  { id: 5, lastName: "El Azdy", firstName: "Saif-Eddine", email: "saif-eddine.el-azdy@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Moroccan/Algerian/Tunisian", course: "26 TI G2" },
  { id: 6, lastName: "Eremenko", firstName: "Nika", email: "Nika.Eremenko@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Ukrainian/Russian", course: "26 TI G2" },
  { id: 7, lastName: "Gana Nair", firstName: "Gowtham", email: "Gowtham.Gana-Nair@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Indian", course: "26 TI G2" },
  { id: 8, lastName: "Grosheva", firstName: "Tatiana", email: "Tatiana.Grosheva@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Russian/Ukrainian", course: "26 TI G2" },
  { id: 9, lastName: "Huynh", firstName: "Anh Minh Nhi", email: "Anh-Minh-Nhi.Huynh@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Vietnamese", course: "26 TI G2" },
  { id: 10, lastName: "Khodadadi", firstName: "Mohsen", email: "Mohsen.Khodadadi@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Afghanistan", course: "26 TI G2" },
  { id: 11, lastName: "Krasnoshtan", firstName: "Anna", email: "Anna.Krasnoshtan@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Ukrainian", course: "26 TI G2" },
  { id: 12, lastName: "Kumar", firstName: "Raviranjan", email: "raviranjan.kumar@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Indian", course: "26 TI G2" },
  { id: 13, lastName: "Masiutin", firstName: "Ilia", email: "ili1121s@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Russian", course: "26 TI G2" },
  { id: 14, lastName: "Matamoros Odio", firstName: "Alexa", email: "Alexa.Matamoros-Odio@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Costa Rican/Latin American", course: "26 TI G2" },
  { id: 15, lastName: "Nagimov", firstName: "Danila", email: "Danila.Nagimov@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Russian/Tatar", course: "26 TI G2" },
  { id: 16, lastName: "Olejak", firstName: "Jasmin", email: "Jasmin.Olejak@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "German/Polish", course: "26 TI G2" },
  { id: 17, lastName: "Pham", firstName: "Khanh Vi", email: "Khanh-Vi.Pham@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Vietnamese", course: "26 TI G2" },
  { id: 18, lastName: "Pulia", firstName: "Vadym", email: "Vadym.Pulia@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Ukrainian", course: "26 TI G2" },
  { id: 19, lastName: "Sokolov", firstName: "Anton", email: "Anton.Sokolov@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Russian", course: "26 TI G2" },
  { id: 20, lastName: "Sutamanont", firstName: "Nirawit", email: "Nirawit.Sutamanont@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Thai", course: "26 TI G2" },
  { id: 21, lastName: "Tararak", firstName: "Tymofii", email: "Tymofii.Tararak@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Ukrainian", course: "26 TI G2" },
  { id: 22, lastName: "Yaroshevskyi", firstName: "Vladyslav", email: "Vladyslav.Yaroshevskyi@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Ukrainian", course: "26 TI G2" },

  // 26 TI G1 (Partner Class)
  { id: 50, lastName: "Al-Baably", firstName: "Mohammed Bashir Yahya Ahmed", email: "mohammed.al-baably@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Yemeni/Egyptian/Arab", course: "26 TI G1" },
  { id: 51, lastName: "Ali", firstName: "Muhammad Ahtasham", email: "muhammad.ali@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Pakistani", course: "26 TI G1" },
  { id: 52, lastName: "Filipov", firstName: "Kiril", email: "kiril.filipov@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Bulgarian", course: "26 TI G1" },
  { id: 53, lastName: "Fogo", firstName: "Lanfo Abdoul-Bakir", email: "lanfo.fogo@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Burkinabe/Malian", course: "26 TI G1" },
  { id: 54, lastName: "Frolov", firstName: "Artem", email: "artem.frolov@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Russian/Ukrainian", course: "26 TI G1" },
  { id: 55, lastName: "Harb Arram", firstName: "Mohamad", email: "mohamad.harb@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Syrian/Lebanese", course: "26 TI G1" },
  { id: 56, lastName: "Ho", firstName: "Tran Duc Anh", email: "anh.ho@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Vietnamese", course: "26 TI G1" },
  { id: 57, lastName: "Holguin Flores", firstName: "Diego Eduardo", email: "diego.holguin@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Colombian/Peruvian", course: "26 TI G1" },
  { id: 58, lastName: "Islam", firstName: "Mohammed Tahmid", email: "tahmid.islam@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Bangladeshi", course: "26 TI G1" },
  { id: 59, lastName: "Katrych", firstName: "Pavlo", email: "pavlo.katrych@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Ukrainian", course: "26 TI G1" },
  { id: 60, lastName: "Kaung", firstName: "Nyan Linn", email: "nyanlinn.kaung@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Burmese (Myanmar)", course: "26 TI G1" },
  { id: 61, lastName: "Kawaf", firstName: "Abd Alkarem", email: "abd.kawaf@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Syrian/Arab", course: "26 TI G1" },
  { id: 62, lastName: "Kolomatskyi", firstName: "Yevhenii", email: "yevhenii.kolomatskyi@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Ukrainian", course: "26 TI G1" },
  { id: 63, lastName: "Krymgerey", firstName: "Adilet", email: "adilet.krymgerey@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Kazakh/Kyrgyz", course: "26 TI G1" },
  { id: 64, lastName: "Maiga", firstName: "Issa Attaoulahi", email: "issa.maiga@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Malian", course: "26 TI G1" },
  { id: 65, lastName: "Meghnoudj", firstName: "Samy", email: "samy.meghnoudj@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Algerian/Tunisian/Maghreb", course: "26 TI G1" },
  { id: 66, lastName: "Nguyen", firstName: "Minh Y", email: "minhy.nguyen@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Vietnamese", course: "26 TI G1" },
  { id: 67, lastName: "Piatkivskyi", firstName: "Vladyslav", email: "vladyslav.piatkivskyi@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Ukrainian", course: "26 TI G1" },
  { id: 68, lastName: "Sarvar", firstName: "Sarvar", email: "sarvar.sarvar@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Indian", course: "26 TI G1" },
  { id: 69, lastName: "Varma", firstName: "Dhruv Sanjeev", email: "dhruv.varma@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Indian", course: "26 TI G1" },
  { id: 70, lastName: "Vdovychenko", firstName: "Oleksandr", email: "oleksandr.vdovychenko@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Ukrainian", course: "26 TI G1" },
  
  // Others (Remaining from List of 62)
  { id: 71, lastName: "Afitserian", firstName: "Yurii", email: "yurii.afitserian@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Ukrainian", course: "Other" },
  { id: 72, lastName: "Bira Cizigire", firstName: "Benjamine", email: "benjamine.bira@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Congolese/Burkina Faso", course: "Other" },
  { id: 73, lastName: "Brusnitsyn", firstName: "Mykyta", email: "mykyta.brusnitsyn@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Ukrainian/Russian", course: "Other" },
  { id: 74, lastName: "Cao", firstName: "Thu Ha", email: "thuha.cao@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Vietnamese", course: "Other" },
  { id: 75, lastName: "Demydenko", firstName: "Polina", email: "polina.demydenko@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Ukrainian", course: "Other" },
  { id: 76, lastName: "Ho", firstName: "Thi Nhat Hoa", email: "hoa.ho@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Vietnamese", course: "Other" },
  { id: 77, lastName: "Khouya", firstName: "Alaa", email: "alaa.khouya@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Moroccan", course: "Other" },
  { id: 78, lastName: "Korpan", firstName: "Markiian", email: "markiian.korpan@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Ukrainian", course: "Other" },
  { id: 79, lastName: "Latypov", firstName: "Roman", email: "roman.latypov@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Russian/Tatar", course: "Other" },
  { id: 80, lastName: "Maroufi", firstName: "Mehrangiz", email: "mehrangiz.maroufi@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Iranian", course: "Other" },
  { id: 81, lastName: "Nguyen", firstName: "Thu Trang", email: "thutrang.nguyen@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Vietnamese", course: "Other" },
  { id: 82, lastName: "Petelchuk", firstName: "Yelyzaveta", email: "yelyzaveta.petelchuk@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Ukrainian", course: "Other" },
  { id: 83, lastName: "Phan", firstName: "Van Giang", email: "vangiang.phan@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Vietnamese", course: "Other" },
  { id: 84, lastName: "Polishchuk", firstName: "Olha", email: "olha.polishchuk@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Ukrainian", course: "Other" },
  { id: 85, lastName: "Savinets", firstName: "Marian", email: "marian.savinets@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Ukrainian", course: "Other" },
  { id: 86, lastName: "Shatska", firstName: "Ilona", email: "ilona.shatska@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Ukrainian", course: "Other" },
  { id: 87, lastName: "Todyrash", firstName: "Dmytro-Yaroslav", email: "dmytro.todyrash@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Ukrainian", course: "Other" },
  { id: 88, lastName: "Tran", firstName: "Ha Kien Anh", email: "hakienahn.tran@stud.hs-coburg.de", role: "Teilnehmer/in", nationality: "Vietnamese", course: "Other" }
];
