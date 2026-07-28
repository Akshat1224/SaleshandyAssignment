import { useEffect, useState, useCallback } from "react";
import { Button, Card, Chip, Spinner, toast } from "@heroui/react";
import { CheckIcon, XMarkIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import Stars from "../components/Stars.jsx";
import { listTestimonials, setStatus as apiSetStatus } from "../lib/api.js";

const TABS = [
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

const sentimentColor = {
  positive: "bg-success/15 text-success",
  neutral: "bg-muted/15 text-muted",
  negative: "bg-error/15 text-error",
};

export default function Dashboard() {
  const [tab, setTab] = useState("pending");
  const [state, setState] = useState({ status: "loading", items: [], total: 0 });
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState(null);
  const limit = 12;

  const load = useCallback(async () => {
    setState((s) => ({ ...s, status: "loading" }));
    try {
      const data = await listTestimonials({ status: tab, page, limit });
      setState({ status: "ready", items: data.items??[], total: data.total??0 });
    } catch (err) {
      setState({ status: "error", items: [], total: 0, error: err.message });
    }
  }, [tab, page]);

  useEffect(() => {
    load();
  }, [load]);

  async function moderate(id, status) {
    setBusy(id);
    try {
      await apiSetStatus(id, status);
      // drop it from the current list without a full refetch
      setState((s) => ({ ...s, items: s.items.filter((t) => t.id !== id), total: s.total - 1 }));
      toast.success(status === "approved" ? "Testimonial approved." : "Testimonial rejected.");
    } catch (err) {
      toast.danger(err.message);
    } finally {
      setBusy(null);
    }
  }

  const pages = Math.max(1, Math.ceil(state.total / limit));

  return (
    <section className="mx-auto max-w-5xl px-5 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-headline">Moderation</h1>
          <p className="mt-1 text-muted">Review submissions, then approve or reject.</p>
        </div>
        <Button variant="outline" size="sm" onPress={load}>
          <ArrowPathIcon className="h-4 w-4" /> Refresh
        </Button>
      </div>

      {/* tabs */}
      <div className="mt-6 flex gap-2 border-b border-line">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setTab(t.key);
              setPage(1);
            }}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-semibold transition-colors ${
              tab === t.key
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {state.status === "loading" && (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        )}

        {state.status === "error" && (
          <div className="rounded-lg border border-error/30 bg-error/5 p-6 text-center text-error">
            {state.error}
            <div className="mt-3">
              <Button variant="outline" size="sm" onPress={load}>
                Try again
              </Button>
            </div>
          </div>
        )}

        {state.status === "ready" && state.items?.length === 0 && (
          <div className="rounded-lg border border-line bg-tertiary/40 py-20 text-center text-muted">
            No {tab} testimonials.
          </div>
        )}

        {state.status === "ready" && state.items?.length > 0 && (
          <div className="grid gap-4">
            {state.items.map((t) => (
              <Card key={t.id} className="border border-line p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      {t.photo_url ? (
                        <img src={t.photo_url} alt="" className="h-10 w-10 rounded-full object-cover" />
                      ) : (
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-info font-bold text-primary">
                          {t.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold">{t.name}</p>
                        <p className="truncate text-[13px] text-muted">
                          {t.company ? `${t.company} · ` : ""}
                          {t.email}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      <Stars value={t.rating} size="h-4 w-4" />
                      {t.sentiment && (
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold capitalize ${sentimentColor[t.sentiment]}`}
                        >
                          {t.sentiment}
                        </span>
                      )}
                    </div>

                    <p className="mt-3 text-sm leading-relaxed">{t.text}</p>
                    {t.summary && (
                      <p className="mt-2 text-[13px] italic text-muted">AI summary: {t.summary}</p>
                    )}
                  </div>

                  {tab !== "approved" && (
                    <Button
                      variant="primary"
                      size="sm"
                      isDisabled={busy === t.id}
                      onPress={() => moderate(t.id, "approved")}
                    >
                      <CheckIcon className="h-4 w-4" /> Approve
                    </Button>
                  )}
                  {tab !== "rejected" && (
                    <Button
                      variant="danger"
                      size="sm"
                      isDisabled={busy === t.id}
                      onPress={() => moderate(t.id, "rejected")}
                    >
                      <XMarkIcon className="h-4 w-4" /> Reject
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* pagination */}
        {state.status === "ready" && pages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-4">
            <Button variant="outline" size="sm" isDisabled={page <= 1} onPress={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <span className="text-sm text-muted">
              Page {page} of {pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              isDisabled={page >= pages}
              onPress={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
