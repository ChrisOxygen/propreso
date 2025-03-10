declare interface SessionUser {
  id: string;
  hasCreatedProfile: boolean;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}
