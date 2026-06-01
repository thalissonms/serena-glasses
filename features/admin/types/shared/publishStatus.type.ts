export type PublishStatus = "live" | "scheduled" | "expired" | "inactive";

export interface PublishableEntity {
  active: boolean;
  starts_at?: string | null;
  ends_at?: string | null;
}
