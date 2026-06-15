import { HomeSection, HomeSectionCreateInput, HomeSectionUpdateInput } from "../types/homeSection/homeSection.types";

export async function getHomeSections(): Promise<HomeSection[]> {
  const res = await fetch("/api/admin/home-sections");
  if (!res.ok) throw new Error("Failed to fetch home sections");
  return res.json();
}

export async function createHomeSection(data: HomeSectionCreateInput): Promise<HomeSection> {
  const res = await fetch("/api/admin/home-sections", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create home section");
  return res.json();
}

export async function updateHomeSection(id: string, data: HomeSectionUpdateInput): Promise<HomeSection> {
  const res = await fetch(`/api/admin/home-sections/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update home section");
  return res.json();
}

export async function deleteHomeSection(id: string): Promise<void> {
  const res = await fetch(`/api/admin/home-sections/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete home section");
}

export async function reorderHomeSections(items: { id: string; display_order: number }[]): Promise<void> {
  const res = await fetch("/api/admin/home-sections/reorder", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(items),
  });
  if (!res.ok) throw new Error("Failed to reorder home sections");
}
