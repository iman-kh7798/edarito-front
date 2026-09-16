import type { User, UserRole } from "../model/types";

/** Raw shape of `CurrentUserSerializer` (apps.accounts.serializers). */
export type UserDTO = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  personnel_code: string | null;
  national_code: string | null;
  phone_number: string;
  position: string;
  organization: string | null;
  organization_name: string | null;
  role: UserRole;
  avatar: string | null;
  is_staff: boolean;
  is_superuser: boolean;
};

export function mapUserDto(dto: UserDTO): User {
  const fullName = `${dto.first_name} ${dto.last_name}`.trim();
  return {
    id: dto.id,
    username: dto.username,
    firstName: dto.first_name,
    lastName: dto.last_name,
    fullName: fullName || dto.username,
    email: dto.email,
    personnelCode: dto.personnel_code,
    nationalCode: dto.national_code,
    phoneNumber: dto.phone_number,
    position: dto.position,
    organizationId: dto.organization,
    organizationName: dto.organization_name,
    role: dto.role,
    avatar: dto.avatar,
    isStaff: dto.is_staff,
    isSuperuser: dto.is_superuser,
  };
}
