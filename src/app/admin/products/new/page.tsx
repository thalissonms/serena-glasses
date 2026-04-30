import { requireAdmin } from "@shared/lib/auth/admin";
import ProductCreateForm from "@features/admin/components/ProductCreateForm";

export default async function AdminProductNewPage() {
  await requireAdmin();
  return (
    <div className="p-8">
      <ProductCreateForm />
    </div>
  );
}
