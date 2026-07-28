import { z } from "zod";

// Mirrors the server's boundary checks so users get friendly messages before the round-trip.
export const testimonialSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  email: z.string().trim().min(1, "Email is required.").email("Please enter a valid email."),
  company: z.string().trim().optional(),
  text: z.string().trim().min(10, "Testimonial must be at least 10 characters."),
  rating: z.number().int().min(1, "Please pick a star rating.").max(5),
});

// Returns { ok:true } or { ok:false, errors:{field:message} } — first message per field.
export function validateTestimonial(input) {
  const r = testimonialSchema.safeParse(input);
  if (r.success) return { ok: true };
  const errors = {};
  for (const issue of r.error.issues) {
    const k = issue.path[0];
    if (!errors[k]) errors[k] = issue.message;
  }
  return { ok: false, errors };
}
