"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Trash2, ArrowLeftRight, Save, X, ImageIcon, Sun, Moon, Plus, AlertCircle } from "lucide-react";
import { useSiteHighlight, useUpdateSiteHighlight, useUploadSiteHighlightImage } from "../../hooks/banner/useSiteHighlight.hook";
import { isApiError } from "../../utils/isApiError";
import Image from "next/image";
import { AdminUploadBox } from "../primitives/AdminUploadBox";
import { Button } from "../primitives/Button";
import { Modal } from "../primitives/Modal";

export default function SiteHightlight() {
    const [isEditing, setIsEditing] = useState(false);
    const { data: highlight, isLoading } = useSiteHighlight();
    const updateMutation = useUpdateSiteHighlight();
    const uploadMutation = useUploadSiteHighlightImage();

    const [previewLight, setPreviewLight] = useState<string | null>(null);
    const [previewDark, setPreviewDark] = useState<string | null>(null);
    const [progressLight, setProgressLight] = useState<number | null>(null);
    const [progressDark, setProgressDark] = useState<number | null>(null);
    const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);

    useEffect(() => {
        if (!isEditing && highlight) {
            setPreviewLight(highlight.image_url_light || null);
            setPreviewDark(highlight.image_url_dark || null);
        } else if (!isEditing && !highlight) {
            setPreviewLight(null);
            setPreviewDark(null);
        }
    }, [isEditing, highlight]);

    const handleUpload = async (files: FileList, type: "light" | "dark") => {
        const file = files[0];
        if (!file) return;

        const setProgress = type === "light" ? setProgressLight : setProgressDark;
        const setPreview = type === "light" ? setPreviewLight : setPreviewDark;

        setProgress(0);
        try {
            const res = await uploadMutation.mutateAsync({
                file,
                onProgress: (p) => setProgress(p),
            });
            setPreview(res.url);
        } catch (err: unknown) {
            if (isApiError(err)) {
                toast.error(err.message);
            } else {
                toast.error("Falha no upload");
            }
        } finally {
            setProgress(null);
        }
    };

    const handleSave = async () => {
        if (!previewLight && !previewDark) {
            toast.error("Ao menos uma imagem deve ser enviada");
            return;
        }

        try {
            await updateMutation.mutateAsync({
                image_url_light: previewLight || "",
                image_url_dark: previewDark || "",
            });
            toast.success("Highlight atualizado");
            setIsEditing(false);
        } catch (err: unknown) {
            if (isApiError(err)) {
                toast.error(err.message);
            } else {
                toast.error("Falha ao salvar highlight");
            }
        }
    };

    const handleDelete = async () => {
        if (!confirm("Remover o highlight do site permanentemente?")) return;
        try {
            await updateMutation.mutateAsync({
                image_url_light: "",
                image_url_dark: "",
            });
            toast.success("Highlight removido");
        } catch (err: unknown) {
            if (isApiError(err)) {
                toast.error(err.message);
            } else {
                toast.error("Falha ao remover highlight");
            }
        }
    };

    const hasHighlight = highlight?.image_url_light || highlight?.image_url_dark;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
                <div>
                    <h1 className="font-shrikhand text-3xl tracking-wider text-white">SITE HIGHLIGHT</h1>
                </div>
                {!isEditing ? (
                    <button
                        onClick={() => setIsWarningModalOpen(true)}
                        className="flex items-center gap-2 border border-brand-pink bg-linear-to-r from-[var(--brand-pink)] to-brand-pink px-4 py-2 font-mono text-base font-bold tracking-widest text-black uppercase transition-colors hover:bg-brand-pink-light rounded-none"
                    >
                        {hasHighlight ? (
                            <>
                                <ArrowLeftRight size={17} />
                                [ Trocar Highlight ]
                            </>
                        ) : (
                            <>
                                <Plus size={17} />
                                [ Adicionar Highlight ]
                            </>
                        )}
                    </button>
                ) : (
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="flex items-center gap-2 border border-white/20 px-4 py-2 font-mono text-base tracking-widest text-white/50 uppercase transition-all hover:text-white"
                        >
                            <X size={17} />
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={updateMutation.isPending}
                            className="flex items-center gap-2 border border-brand-pink bg-linear-to-r from-[var(--brand-pink)] to-brand-pink px-4 py-2 font-mono text-base font-bold tracking-widest text-black uppercase transition-colors hover:bg-brand-pink-light disabled:opacity-50 rounded-none"
                        >
                            <Save size={17} />
                            [ {updateMutation.isPending ? "Salvando..." : "Salvar"} ]
                        </button>
                    </div>
                )}
            </div>

            {isLoading ? (
                <div className="border-2 border-dashed border-white/10 bg-[#050505] p-20 text-center animate-pulse">
                    <div className="font-mono text-base tracking-[0.4em] text-white/15 uppercase">
                        CARREGANDO...
                    </div>
                </div>
            ) : isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-2 border-dashed border-brand-pink/30 bg-[#050505]">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 font-mono text-base tracking-widest text-white/60 uppercase">
                            <Sun size={17} className="text-brand-pink" />
                            Versão Claro
                        </div>
                        {previewLight ? (
                            <div className="relative border-2 border-white/10 group bg-white/5">
                                <Image
                                    src={previewLight}
                                    alt="Light Highlight"
                                    width={1920}
                                    height={1080}
                                    className="w-full h-auto"
                                    unoptimized
                                />
                                <button
                                    onClick={() => setPreviewLight(null)}
                                    className="absolute top-2 right-2 bg-black/60 p-2 text-white/60 hover:text-brand-pink transition-colors backdrop-blur-sm"
                                >
                                    <Trash2 size={19} />
                                </button>
                            </div>
                        ) : (
                            <AdminUploadBox
                                title="Enviar Highlight Claro"
                                subtitle="PNG, JPG, WEBP (Ideal: 1920x520)"
                                icon={<ImageIcon size={24} />}
                                accept="image/*"
                                isUploading={progressLight !== null}
                                progress={progressLight}
                                onFilesSelect={(files) => handleUpload(files, "light")}
                                themeColor="cyan"
                            />
                        )}
                        <p className="font-mono text-[11px] text-brand-pink/50 uppercase tracking-widest mt-2 flex items-center gap-1.5">
                            <AlertCircle size={13} />
                            Resolução Recomendada: 1920x520
                        </p>
                    </div>
                    
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 font-mono text-base tracking-widest text-white/60 uppercase">
                            <Moon size={17} className="text-brand-pink" />
                            Versão Escuro
                        </div>
                        {previewDark ? (
                            <div className="relative border-2 border-white/10 group bg-white/5">
                                <Image
                                    src={previewDark}
                                    alt="Dark Highlight"
                                    width={1920}
                                    height={1080}
                                    className="w-full h-auto"
                                    unoptimized
                                />
                                <button
                                    onClick={() => setPreviewDark(null)}
                                    className="absolute top-2 right-2 bg-black/60 p-2 text-white/60 hover:text-brand-pink transition-colors backdrop-blur-sm"
                                >
                                    <Trash2 size={19} />
                                </button>
                            </div>
                        ) : (
                            <AdminUploadBox
                                title="Enviar Highlight Escuro"
                                subtitle="PNG, JPG, WEBP (Ideal: 1920x520)"
                                icon={<ImageIcon size={24} />}
                                accept="image/*"
                                isUploading={progressDark !== null}
                                progress={progressDark}
                                onFilesSelect={(files) => handleUpload(files, "dark")}
                                themeColor="pink"
                            />
                        )}
                        <p className="font-mono text-[11px] text-brand-pink/50 uppercase tracking-widest mt-2 flex items-center gap-1.5">
                            <AlertCircle size={13} />
                            Resolução Recomendada: 1920x520
                        </p>
                    </div>
                </div>
            ) : !hasHighlight ? (
                <div className="border-2 border-dashed border-white/10 bg-[#050505] p-20 text-center">
                    <div className="font-mono text-base tracking-[0.4em] text-white/15 uppercase">
                        NENHUM HIGHLIGHT ATIVO
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="isolate">
                        <div className="-z-1 flex h-fit items-center justify-center overflow-hidden pt-2">
                            {highlight?.image_url_dark ? (
                                <Image
                                    src={highlight.image_url_dark}
                                    alt={"sale"}
                                    width={1920}
                                    height={1080}
                                    priority
                                    quality={100}
                                    role="img"
                                    className="drop-shadow-[4px_-4px_0px] drop-shadow-brand-purple dark:drop-shadow-brand-dark-surface-2"
                                    unoptimized
                                />
                            ) : highlight?.image_url_light ? (
                                <Image
                                    src={highlight.image_url_light}
                                    alt={"sale"}
                                    width={1920}
                                    height={1080}
                                    priority
                                    quality={100}
                                    role="img"
                                    className="drop-shadow-[4px_-4px_0px] drop-shadow-brand-purple dark:drop-shadow-brand-dark-surface-2"
                                    unoptimized
                                />
                            ) : null}
                        </div>

                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 border border-brand-pink/30 px-4 py-2.5 shadow-[inset_0_0_15px_rgba(255,0,182,0.05)] transition-colors duration-150 hover:bg-[#050505] mt-2 bg-[#050505] rounded-none">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className={`inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-widest px-2 py-0.5 border border-brand-pink/30 text-brand-pink bg-brand-pink/5`}>
                                    <span className={`w-1.5 h-1.5 rounded-none bg-brand-pink animate-pulse`} />
                                    {"//"} ATIVO AGORA
                                </span>
                            </div>

                            <div className="flex items-center gap-1">
                                <button
                                    onClick={handleDelete}
                                    disabled={updateMutation.isPending}
                                    className="p-1.5 text-white/25 transition-colors hover:text-brand-pink disabled:opacity-20"
                                    title="Deletar"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Modal
                open={isWarningModalOpen}
                onOpenChange={setIsWarningModalOpen}
                title="Atenção às Dimensões"
                size="md"
            >
                <div className="space-y-6">
                    <div className="flex flex-col gap-4">
                        <p className="font-poppins text-base text-white/70">
                            Para garantir a melhor qualidade visual na vitrine da loja, recomendamos fortemente que as imagens de Highlight tenham exatamente as dimensões de:
                        </p>
                        <div className="bg-[#111] border border-white/10 p-4 text-center">
                            <span className="font-shrikhand text-2xl text-brand-pink tracking-wider">
                                1920 x 520
                            </span>
                            <span className="block font-mono text-[12px] text-white/40 uppercase mt-2">Pixels (Largura x Altura)</span>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
                        <Button variant="secondary" onClick={() => setIsWarningModalOpen(false)}>
                            Cancelar
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => {
                                setIsWarningModalOpen(false);
                                setPreviewLight(highlight?.image_url_light || null);
                                setPreviewDark(highlight?.image_url_dark || null);
                                setIsEditing(true);
                            }}
                        >
                            Estou ciente, continuar
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
