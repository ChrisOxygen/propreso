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
  isVerified: boolean;
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
  profileStength: number;
  profileStengthMessage: string;
}

declare interface JobDetailsFromPlatform {
  url?: string;
  html: string;
  timestamp?: string | Date;
}

declare interface AnalizedUpworkJobData {
  jobDetails: {
    title: string; // Required field
    description: string; // Required field
    type?: "Hourly" | "Fixed-Price";
    projectLength?: string;
    experienceLevel?: string;
    hourlyRate?: {
      min?: string;
      max?: string;
    };
    skills?: string[];
    connectsRequired?: string;
  };
  clientInfo?: {
    clientName?: string; // New field for client's name
    location?: string;
    city?: string;
    rating?: string;
    reviews?: string;
    jobsPosted?: string;
    hireRate?: string;
    totalSpent?: string;
    memberSince?: string;
    paymentVerified?: boolean;
    phoneVerified?: boolean;
  };
}

declare type FlattenedItem = Record<string, string | boolean | number>;

declare type FetchStateStatusType =
  | null
  | "fetchJobDetails"
  | "analizingJobDetails"
  | "generatingProposal"
  | "ready"
  | "error";

declare interface SkeletonLoaderProps {
  /** Text to display in the middle of the skeleton */
  text?: string;
  /** Width of the skeleton (Tailwind class) */
  width?: string;
  /** Height of the skeleton (Tailwind class) */
  height?: string;
  /** Border radius (Tailwind class) */
  rounded?: string;
  /** Text size (Tailwind class) */
  textSize?: string;
  /** Text color (Tailwind class) */
  textColor?: string;
  /** Whether to animate the skeleton */
  animate?: boolean;
  /** Additional CSS classes */
  className?: string;
}

declare interface ServerJobDetails {
  id: string;
  userId: string;
  jobUrl: string;
  jobHtml: string;
  timestamp: Date;
}

declare interface UserInformation {
  jobTitle: string;
  skills: string[];
  bio: string;
  projects: {
    title: string;
    description: string;
    liveLink?: string;
    githubLink?: string;
  }[];
  isDefaultProfile: boolean;
}

// declare interface CreateProfileState {
//   currentStep: number;
//   userInformation: UserInformation;
// }

declare interface ProjectCardProps {
  project: Project;
  onUpdate?: (updatedProject: Project) => void;
}

declare interface ProjectStrengthData {
  strength: number;
  suggestions: {
    name: string;
    description: string;
    examples: string[];
  }[];
}

declare interface ProjectStrengthProps {
  strength: number;
  suggestions: {
    name: string;
    description: string;
    examples: string[];
  }[];
  isLoading: boolean;
}
