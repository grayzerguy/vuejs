// src/utils/format.ts

import { User } from "../entity/user.entity";



/**
 * מחזיר אובייקט משתמש מסונן - בלי סיסמה ופרטים רגישים
 */
export const formatUserResponse = (user: User) => {
  return {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    created_at: user.created_at,
  };
};

/**
 * קיצור תאריך לפורמט קריא (למשל: 2025-06-24)
 */
export const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

/**
 * קיצור טקסט עם שלוש נקודות אם ארוך מדי
 */
export const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? text.slice(0, maxLength - 3) + "..." : text;
};

/**
 * הפיכת אות ראשונה לאות גדולה
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
