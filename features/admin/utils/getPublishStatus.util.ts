import { PublishStatus, PublishableEntity } from "../types/shared/publishStatus.type";

export function getPublishStatus(entity: PublishableEntity): PublishStatus {
    const now = Date.now();
    if (!entity.active) return "inactive";
    if (entity.ends_at && new Date(entity.ends_at).getTime() < now) return "expired";
    if (entity.starts_at && new Date(entity.starts_at).getTime() > now) return "scheduled";
    return "live";
}
