export interface Subject {
  name: string;
  day: string;
  date: string;
}

export interface ClassSchedule {
  subjects: Subject[];
}

export interface AdmitCardData {
  startTime: string;
  endTime: string;
  class: {
    '9': ClassSchedule;
    '10': ClassSchedule;
    '11-arts': ClassSchedule;
    '11-commerce': ClassSchedule;
    '12-arts': ClassSchedule;
    '12-commerce': ClassSchedule;
    '12-science': ClassSchedule;
  };
}

export const admitCardData: AdmitCardData = {
  startTime: "09:00 AM",
  endTime: "11:30 AM",
  class: {
    "9": {
      subjects: [
        { "name": "SCT.", "day": "Monday", "date": "2026-01-19" },
        { "name": "English", "day": "Tuesday", "date": "2026-01-20" },
        { "name": "Hindi", "day": "Wednesday", "date": "2026-01-21" },
        { "name": "SST", "day": "Thursday", "date": "2026-01-22" },
        { "name": "Physical Edu.", "day": "Saturday", "date": "2026-01-24" },
        { "name": "Mathematics", "day": "Tuesday", "date": "2026-01-27" },
        { "name": "SKT", "day": "Wednesday", "date": "2026-01-28" }
      ]
    },
    "10": {
      subjects: [
        { "name": "Mathematics", "day": "Monday", "date": "2026-01-19" },
        { "name": "Hindi", "day": "Tuesday", "date": "2026-01-20" },
        { "name": "English", "day": "Wednesday", "date": "2026-01-21" },
        { "name": "SST", "day": "Thursday", "date": "2026-01-22" },
        { "name": "SCT.", "day": "Saturday", "date": "2026-01-24" },
        { "name": "Physical Edu", "day": "Tuesday", "date": "2026-01-27" }
      ]
    },
    "11-arts": {
      subjects: [
        { "name": "English", "day": "Monday", "date": "2026-01-19" },
        { "name": "Pol. Sci", "day": "Tuesday", "date": "2026-01-20" },
        { "name": "History", "day": "Wednesday", "date": "2026-01-21" },
        { "name": "Hindi", "day": "Thursday", "date": "2026-01-22" },
        { "name": "Physical Edu", "day": "Saturday", "date": "2026-01-24" }
      ]
    },
    "11-commerce": {
      subjects: [
        { "name": "English", "day": "Monday", "date": "2026-01-19" },
        { "name": "Accounts", "day": "Tuesday", "date": "2026-01-20" },
        { "name": "B. Std.", "day": "Wednesday", "date": "2026-01-21" },
        { "name": "Hindi", "day": "Thursday", "date": "2026-01-22" },
        { "name": "ECO/Mathematics", "day": "Saturday", "date": "2026-01-24" }
      ]
    },
    "12-arts": {
      subjects: [
        { "name": "History", "day": "Monday", "date": "2026-01-19" },
        { "name": "English", "day": "Tuesday", "date": "2026-01-20" },
        { "name": "Pol. Sci", "day": "Wednesday", "date": "2026-01-21" },
        { "name": "Hindi", "day": "Thursday", "date": "2026-01-22" },
        { "name": "Physical Edu", "day": "Saturday", "date": "2026-01-24" }
      ]
    },
    "12-commerce": {
      subjects: [
        { "name": "Accounts", "day": "Monday", "date": "2026-01-19" },
        { "name": "English", "day": "Tuesday", "date": "2026-01-20" },
        { "name": "Mathematics", "day": "Wednesday", "date": "2026-01-21" },
        { "name": "Hindi", "day": "Thursday", "date": "2026-01-22" },
        { "name": "B. Std.", "day": "Saturday", "date": "2026-01-24" }
      ]
    },
    "12-science": {
      subjects: [
        { "name": "Chemistry", "day": "Monday", "date": "2026-01-19" },
        { "name": "English", "day": "Tuesday", "date": "2026-01-20" },
        { "name": "Mathematics/Bio", "day": "Wednesday", "date": "2026-01-21" },
        { "name": "Hindi", "day": "Thursday", "date": "2026-01-22" },
        { "name": "Physics", "day": "Saturday", "date": "2026-01-24" }
      ]
    }
  }
};
