import { ApiError } from "./errors.js";

/**
 * Zod şemasıyla gövde doğrulama.
 *
 * Geçersizse 400 döner ve hatalı alan adlarını da iletir; frontend
 * isterse alanın altında gösterebilir.
 */
export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const fields = {};
      for (const issue of result.error.issues) {
        const key = issue.path.join(".") || "form";
        if (!fields[key]) fields[key] = issue.message;
      }

      const error = new ApiError(400, "Lütfen formu kontrol edin.");
      error.fields = fields;
      return next(error);
    }

    req.body = result.data;
    next();
  };
}
