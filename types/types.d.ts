declare interface SessionUser {
  id: string;
  hasCreatedProfile: boolean;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

declare interface CreateProfileState {
  currentStep: number;
  userInformation: userProfileData;
}

declare interface userProfileData {
  jobTitle: string;
  skills: string[];
  bio: string;
  projects?: ProfileProject[];
  isDefaultProfile: boolean;
}

declare interface CreateProfileAction {
  type: string;
  payload?: any;
}

declare interface ProfileProject {
  title: string;
  liveLink?: string;
  githubLink?: string;
  description: string;
}

declare interface User {
  fullName: string;
  image: string | null;
  id: string;
  email: string;
  password: string | null;
  hasCreatedProfile: boolean;
  provider: string | null;
  providerId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

declare interface PrismaSkill {
  id: string;
  name: string;
}

declare interface PrismaProject {
  id: string;
  title: string;
  description: string;
  liveLink: string | null;
  githubLink: string | null;
}

declare interface PrismaUserProfile {
  id: string;
  jobTitle: string;
  bio: string;
  isDefault: boolean;
  userId: string;
  skills: string[];
  projects: PrismaProject[];
}
