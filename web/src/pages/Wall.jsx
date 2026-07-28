import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Spinner } from "@heroui/react";
import Stars from "../components/Stars.jsx";
import { listPublic } from "../lib/api.js";

export default function Wall() {
  const [state, setState] = useState({ status: "loading", items: [], total: 0 });
  const [page, setPage] = useState(1);
  const limit = 6;

  useEffect(() => {
    let live = true;
    setState((s) => ({ ...s, status: "loading" }));
    listPublic({ page, limit })
      .then((d) => live && setState({ status: "ready", items: d.items??[], total: d.total??0 }))
      .catch((err) => live && setState({ status: "error", items: [], total: 0, error: err.message }));
    return () => {
      live = false;
    };
  }, [page]);

  const pages = Math.max(1, Math.ceil(state.total / limit));
  const avg =
    state.items?.length > 0
      ? (state.items.reduce((s, t) => s + t.rating, 0) / state.items?.length).toFixed(1)
      : null;

  return (
    <section className="mx-auto max-w-6xl px-5 py-8">
      <div className="text-center">
        <span className="inline-block rounded-full bg-info px-3 py-1 text-[13px] font-semibold text-primary">
          Loved by customers
        </span>
        <h1 className="mt-3 text-4xl font-bold tracking-headline">What people are saying</h1>
        {state.total > 0 && (
          <p className="mt-2 flex items-center justify-center gap-2 text-muted">
            <Stars value={Math.round(avg)} size="h-5 w-5" />
            <span className="font-semibold text-ink">{avg}</span> from {state.total} approved testimonial
            {state.total > 1 ? "s" : ""}
          </p>
        )}
      </div>

      <div className="mt-6">
        {state.status === "loading" && (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        )}

        {state.status === "error" && (
          <div className="rounded-lg border border-error/30 bg-error/5 p-8 text-center text-error">
            Couldn't load testimonials. {state.error}
          </div>
        )}

        {state.status === "ready" && state.items?.length === 0 && (
          <div className="rounded-xl border border-line bg-tertiary/40 py-24 text-center">
            <p className="text-lg font-semibold">No testimonials yet</p>
            <p className="mt-1 text-muted">Be the first to share your experience.</p>
            <Link to="/">
              <Button variant="primary" className="mt-5">
                Write a testimonial
              </Button>
            </Link>
          </div>
        )}

        {state.status === "ready" && state.items?.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {state.items.map((t) => (
              <Card
                key={t.id}
                className="flex flex-col border border-line p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <Stars value={t.rating} size="h-4 w-4" />
                <p
                  title={t.text}
                  className="mt-3 line-clamp-4 flex-1 text-[15px] leading-relaxed text-ink"
                >
                  “{t.text}”
                </p>
                <div className="mt-5 flex items-center gap-3">
                  {t.photo_url ? (
                    <img src={t.photo_url} alt="" className="h-11 w-11 rounded-full object-cover" />
                  ) : (
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-info text-lg font-bold text-primary">
                      {t.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-semibold" title={t.name}>
                      {t.name}
                    </p>
                    {t.company && (
                      <p className="truncate text-[13px] text-muted" title={t.company}>
                        {t.company}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {state.status === "ready" && pages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-4">
            <Button variant="outline" size="sm" isDisabled={page <= 1} onPress={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <span className="text-sm text-muted">
              Page {page} of {pages}
            </span>
            <Button variant="outline" size="sm" isDisabled={page >= pages} onPress={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
