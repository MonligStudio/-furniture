import type { Metadata } from "next";
import { Suspense } from "react";
import { CategoryStrip } from "@/components/products/category-strip";
import { PageHero } from "@/components/layout/page-hero";
import { ProductExplorer } from "@/components/products/product-explorer";

export const metadata: Metadata = {
  title: "Ürünler",
  description:
    "Salon, köşe, yemek odası ve yatak odası takımları; Puffy yatak ve tekil parçalar. Kumaş, ölçü ve modül seçenekleriyle.",
};

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Koleksiyon"
        title={["Ürünler"]}
        description="Mağazada sergilenen koleksiyonun tamamı. Her ürünün kumaş, ölçü ve modül seçenekleri sipariş sırasında yeniden kurulabilir."
      />

      <CategoryStrip />

      {/* useSearchParams istemcide okunuyor; Suspense sınırı zorunlu. */}
      <Suspense
        fallback={
          <div className="shell edge-note py-20 text-fg-faint">
            Ürünler yükleniyor…
          </div>
        }
      >
        <ProductExplorer />
      </Suspense>
    </>
  );
}
