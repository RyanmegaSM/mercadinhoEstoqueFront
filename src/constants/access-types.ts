export const AccessTypes = {
  ADMIN: 1,
  MANAGER: 2,
  EMPLOYEE: 3,
} as const;

export type AccessType = typeof AccessTypes[keyof typeof AccessTypes];