import { PublishStatus } from "../types/shared/publishStatus.type";

export const PUBLISH_STATUS_CONFIG: Record<PublishStatus, { dot: string; label: string; cls: string }> = {
    live: {
        dot: "bg-[#00F0FF]",
        label: "Ativo",
        cls: "border-[#00F0FF]/40 text-[#00F0FF] shadow-[0_0_8px_#00F0FF30]",
    },
    scheduled: {
        dot: "bg-[#FFD700]",
        label: "Agendado",
        cls: "border-[#FFD700]/40 text-[#FFD700]",
    },
    expired: {
        dot: "bg-white/20",
        label: "Expirado",
        cls: "border-white/20 text-white/30",
    },
    inactive: {
        dot: "bg-white/20",
        label: "Inativo",
        cls: "border-white/20 text-white/30",
    },
};
