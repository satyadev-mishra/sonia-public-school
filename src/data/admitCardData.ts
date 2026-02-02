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
  startTime: "08:30 AM",
  endTime: "11:30 AM",
  class: {
    "9": {
      subjects: [
        { "name": "Hindi", "day": "Tuesday", "date": "17-02-2026" },
        { "name": "Social Science", "day": "Thursday", "date": "19-02-2026" },
        { "name": "English", "day": "Saturday", "date": "21-02-2026" },
        { "name": "Math", "day": "Monday", "date": "23-02-2026" },
        { "name": "Science", "day": "Wednesday", "date": "25-02-2026" },
        { "name": "Physical Edu", "day": "Friday", "date": "27-02-2026" },
        { "name": "SKT", "day": "Monday", "date": "02-03-2026" },
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
        { "name": "English (Core/Elective)", "day": "Monday", "date": "16-02-2026" },
        { "name": "Hindi (Core/Elective) ", "day": "Wednesday", "date": "18-02-2026" },
        { "name": "Physical Edu", "day": "Tuesday", "date": "24-02-2026" },
        { "name": "History", "day": "Friday", "date": "27-02-2026" },
        { "name": "Political Sci.", "day": "Saturday", "date": "28-02-2026" },
      ]
    },
    "11-commerce": {
      subjects: [
        { "name": "English (Core/Elective)", "day": "Monday", "date": "16-02-2026" },
        { "name": "Hindi (Core/Elective) ", "day": "Wednesday", "date": "18-02-2026" },
        { "name": "Economics", "day": "Monday", "date": "23-02-2026" },
        { "name": "Accountancy", "day": "Wednesday", "date": "25-02-2026" },
        { "name": "Business Studies", "day": "Friday", "date": "27-02-2026" },
        { "name": "Maths", "day": "Monday", "date": "02-03-2026" },
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
