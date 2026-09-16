export type UserRole = "admin" | "user";

/** Domain user, mapped from the backend's snake_case CurrentUserSerializer. */
export type User = {
  /** Django's default AutoField PK — accounts.User doesn't use the UUID BaseModel. */
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  personnelCode: string | null;
  nationalCode: string | null;
  phoneNumber: string;
  position: string;
  organizationId: string | null;
  organizationName: string | null;
  role: UserRole;
  avatar: string | null;
  isStaff: boolean;
  isSuperuser: boolean;
};
