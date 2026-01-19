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
        { "name": "Maths", "day": "Thursday", "date": "22-01-2026" },
        { "name": "English", "day": "Friday", "date": "23-01-2026" },
        { "name": "Science", "day": "Saturday", "date": "24-01-2026" },
        { "name": "Hindi", "day": "Wednesday", "date": "28-01-2026" },
        { "name": "Physical Edu", "day": "Thursday", "date": "29-01-2026" },
        { "name": "SKT", "day": "Friday", "date": "30-01-2026" },
        { "name": "Social Science", "day": "Monday", "date": "02-02-2026" }
      ]
    },
    "10": {
      subjects: [
        { "name": "Science.", "day": "Thursday", "date": "22-01-2026" },
        { "name": "Hindi", "day": "Friday", "date": "23-01-2026" },
        { "name": "Maths", "day": "Saturday", "date": "24-01-2026" },
        { "name": "Physical Edu", "day": "Wednesday", "date": "28-01-2026" },
        { "name": "English", "day": "Thursday", "date": "29-01-2026" },
        { "name": "Social Science", "day": "Friday", "date": "30-01-2026" },
      ]
    },
    "11-arts": {
      subjects: [
        { "name": "History", "day": "Friday", "date": "23-01-2026" },
        { "name": "English (Core/Elective)", "day": "Saturday", "date": "24-01-2026" },
        { "name": "Hindi (Core/Elective) ", "day": "Wednesday", "date": "28-01-2026" },
        { "name": "Political Sci.", "day": "Thursday", "date": "29-01-2026" },
        { "name": "Physical Edu", "day": "Monday", "date": "02-02-2026" },
      ]
    },
    "11-commerce": {
      subjects: [
        { "name": "Economics", "day": "Friday", "date": "23-01-2026" },
        { "name": "English (Core/Elective)", "day": "Saturday", "date": "24-01-2026" },
        { "name": "Hindi (Core/Elective)", "day": "Wednesday", "date": "28-01-2026" },
        { "name": "Accountancy", "day": "Friday", "date": "30-01-2026" },
        { "name": "Business Studies", "day": "Monday", "date": "02-02-2026" },
        { "name": "Maths", "day": "Tuesday", "date": "03-02-2026" },
      ]
    },
    "12-arts": {
      subjects: [
        { "name": "Political Sci.", "day": "Friday", "date": "23-01-2026" },
        { "name": "Hindi (Core/Elective)", "day": "Saturday", "date": "24-01-2026" },
        { "name": "English (Core/Elective)", "day": "Wednesday", "date": "28-01-2026" },
        { "name": "Physical Edu", "day": "Thursday", "date": "29-01-2026" },
        { "name": "History", "day": "Monday", "date": "02-02-2026" },
      ]
    },
    "12-commerce": {
      subjects: [
        { "name": "Maths", "day": "Friday", "date": "23-01-2026" },
        { "name": "Hindi (Core/Elective)", "day": "Saturday", "date": "24-01-2026" },
        { "name": "English (Core/Elective)", "day": "Wednesday", "date": "28-01-2026" },
        { "name": "Business Studies", "day": "Friday", "date": "30-01-2026" },
        { "name": "Accountancy", "day": "Monday", "date": "02-02-2026" },
        { "name": "Economics", "day": "Tuesday", "date": "03-02-2026" },
      ]
    },
    "12-science": {
      subjects: [
        { "name": "Maths/Biology", "day": "Friday", "date": "23-01-2026" },
        { "name": "Hindi (Core/Elective)", "day": "Saturday", "date": "24-01-2026" },
        { "name": "English (Core/Elective)", "day": "Wednesday", "date": "28-01-2026" },
        { "name": "Chemistry", "day": "Friday", "date": "30-01-2026" },
        { "name": "Physics", "day": "Monday", "date": "02-02-2026" }
      ]
    }
  }
};
