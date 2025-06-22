import z from "zod";

const viebeSchema = z.object({
  mood: z.string().min(1, { message: "mood is required" }),
  description: z.string().optional(),
});
export default viebeSchema;
