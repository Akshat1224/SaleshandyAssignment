import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, TextField, Label, Input, TextArea, toast } from "@heroui/react";
import { CheckCircleIcon, PhotoIcon } from "@heroicons/react/24/solid";
import Stars from "../components/Stars.jsx";
import { submitTestimonial } from "../lib/api.js";
import { validateTestimonial } from "../lib/schema.js";

const empty = { name: "", email: "", company: "", text: "" };

export default function Submit() {
  const [form, setForm] = useState(empty);
  const [rating, setRating] = useState(0);
  const [photo, setPhoto] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | sending | done
  const [errors, setErrors] = useState({});

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  async function onSubmit(e) {
    e.preventDefault();
    const check = validateTestimonial({ ...form, rating });
    if (!check.ok) {
      setErrors(check.errors);
      toast.danger("Please fix the highlighted fields.");
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("rating", rating);
      if (photo) fd.append("photo", photo);
      await submitTestimonial(fd);
      setStatus("done");
      toast.success("Testimonial submitted — awaiting review.");
    } catch (err) {
      setStatus("idle");
      toast.danger(err.message);
    }
  }

  if (status === "done") {
    return (
      <section className="mx-auto max-w-xl px-5 py-24 text-center">
        <CheckCircleIcon className="mx-auto h-16 w-16 text-success" />
        <h1 className="mt-4 text-3xl font-bold tracking-headline">Thank you!</h1>
        <p className="mt-2 text-muted">
          Your testimonial was submitted and is awaiting review. Once approved it'll appear on the wall.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button
            variant="primary"
            onPress={() => {
              setForm(empty);
              setRating(0);
              setPhoto(null);
              setErrors({});
              setStatus("idle");
            }}
          >
            Submit another
          </Button>
          <Button variant="outline" onPress={() => (window.location.href = "/wall")}>
            See the wall
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-xl px-5 py-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-headline">Share your experience</h1>
        <p className="mt-2 text-muted">
          Tell us how it went. Approved testimonials appear on our{" "}
          <Link to="/wall" className="font-semibold text-primary hover:underline">
            wall
          </Link>
          .
        </p>
      </div>

      <Card className="mt-5 border border-line p-6 shadow-sm">
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField isRequired value={form.name} onChange={set("name")}>
              <Label className="mb-1 block text-sm font-semibold">Name</Label>
              <Input placeholder="Jane Doe" />
              {errors.name && <p className="mt-1 text-sm text-error">{errors.name}</p>}
            </TextField>
            <TextField isRequired type="email" value={form.email} onChange={set("email")}>
              <Label className="mb-1 block text-sm font-semibold">Email</Label>
              <Input placeholder="jane@company.com" />
              {errors.email && <p className="mt-1 text-sm text-error">{errors.email}</p>}
            </TextField>
          </div>

          <TextField value={form.company} onChange={set("company")}>
            <Label className="mb-1 block text-sm font-semibold">
              Company <span className="font-normal text-muted">(optional)</span>
            </Label>
            <Input placeholder="Acme Inc." />
          </TextField>

          <div>
            <span className="mb-1 block text-sm font-semibold">Rating</span>
            <Stars value={rating} onChange={setRating} size="h-8 w-8" />
            {errors.rating && <p className="mt-1 text-sm text-error">{errors.rating}</p>}
          </div>

          <TextField isRequired value={form.text} onChange={set("text")}>
            <Label className="mb-1 block text-sm font-semibold">Your testimonial</Label>
            <TextArea rows={5} placeholder="What did you love? Be specific — it helps others." />
            {errors.text && <p className="mt-1 text-sm text-error">{errors.text}</p>}
          </TextField>

          <div>
            <span className="mb-1 block text-sm font-semibold">
              Photo <span className="font-normal text-muted">(optional)</span>
            </span>
            <label className="flex cursor-pointer items-center gap-3 rounded-md border border-dashed border-line px-4 py-3 text-sm text-muted hover:border-primary hover:text-primary">
              <PhotoIcon className="h-5 w-5" />
              {photo ? photo.name : "Add a headshot (max 3MB)"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isDisabled={status === "sending"}
            className="h-12"
          >
            {status === "sending" ? "Submitting…" : "Submit testimonial"}
          </Button>
        </form>
      </Card>
    </section>
  );
}
