import { notFound } from "next/navigation";
import { getSupabaseServer } from "@shared/lib/supabase/server";
import { ReviewFormClient } from "@features/reviews/components/ReviewFormClient";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ token: string }>;
}

export default async function ReviewPage({ params }: Props) {
  const { token } = await params;

  const supabase = getSupabaseServer();

  const { data: review } = await supabase
    .from("product_reviews")
    .select(
      `id, author_name, city, purchased_at, review_submitted_at, review_token_expires_at,
       products ( name, product_images ( url, position ) )`,
    )
    .eq("review_token", token)
    .maybeSingle();

  if (!review) notFound();

  const expired =
    review.review_token_expires_at &&
    new Date(review.review_token_expires_at) < new Date();

  const alreadySubmitted = !!review.review_submitted_at;

  const product = review.products as unknown as {
    name: string;
    product_images: { url: string; position: number | null }[];
  } | null;

  const images = product?.product_images ?? [];
  const thumb =
    images.sort((a, b) => (a.position ?? 99) - (b.position ?? 99))[0]?.url ?? null;

  const purchasedAt = review.purchased_at
    ? new Date(review.purchased_at).toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <main className="min-h-screen bg-[#FFF0FA] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="font-poppins font-black text-3xl uppercase tracking-tight text-black mb-1"
            style={{ letterSpacing: "0.04em" }}
          >
            SERENA GLASSES
          </h1>
          <div className="h-1 w-16 bg-brand-pink mx-auto" />
        </div>

        <div className="bg-white border-4 border-black shadow-[6px_6px_0_#FF00B6] p-6 md:p-8">
          {alreadySubmitted ? (
            <SubmittedState name={review.author_name} />
          ) : expired ? (
            <ExpiredState />
          ) : (
            <>
              {/* Product info */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b-2 border-black">
                {thumb && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumb}
                    alt={product?.name ?? ""}
                    className="w-16 h-16 object-cover border-2 border-black shrink-0"
                  />
                )}
                <div>
                  <p className="font-poppins font-black text-sm uppercase tracking-wider text-black">
                    {product?.name ?? "Produto"}
                  </p>
                  {review.author_name && (
                    <p className="text-xs text-gray-500 mt-0.5">{review.author_name}</p>
                  )}
                  {(review.city || purchasedAt) && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {[review.city, purchasedAt].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
              </div>

              <p className="font-poppins font-semibold text-sm text-gray-700 mb-6">
                Como foi sua experiência com este produto?
              </p>

              <ReviewFormClient
                reviewId={review.id}
                token={token}
                productName={product?.name ?? "Produto"}
              />
            </>
          )}
        </div>
      </div>
    </main>
  );
}

function SubmittedState({ name }: { name: string }) {
  return (
    <div className="text-center py-4">
      <div className="text-5xl mb-4">★</div>
      <h2 className="font-poppins font-black text-xl uppercase text-black mb-2">
        Obrigada, {name}!
      </h2>
      <p className="text-sm text-gray-600 leading-relaxed">
        Seu comentário foi enviado e será analisado pela nossa equipe. Assim que aprovado, ele aparecerá na página do produto.
      </p>
      <p className="text-xs text-gray-400 mt-4">
        Compartilhe sua foto com a gente no Instagram{" "}
        <strong className="text-brand-pink">@serenaglasses</strong>
      </p>
    </div>
  );
}

function ExpiredState() {
  return (
    <div className="text-center py-4">
      <h2 className="font-poppins font-black text-xl uppercase text-black mb-2">
        Link expirado
      </h2>
      <p className="text-sm text-gray-600 leading-relaxed">
        Este link de avaliação expirou. Entre em contato pelo Instagram{" "}
        <strong>@serenaglasses</strong> se precisar de ajuda.
      </p>
    </div>
  );
}
