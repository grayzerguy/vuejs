export function sanitizeUserUpdate(body: any) {
  const allowedFields = ["first_name", "last_name", "email", "password"];
  const sanitized: any = {};

  for (const key of allowedFields) {
    if (body[key]) {
      sanitized[key] = body[key];
    }
  }

  return sanitized;
}