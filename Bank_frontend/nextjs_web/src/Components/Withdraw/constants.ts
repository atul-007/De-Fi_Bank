import * as z from "zod";

export const formSchema = z.object({
  withdraw: z.string().min(1, {
    message: "Prompt is required.",
  }),
});
