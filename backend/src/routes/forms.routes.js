/**
 * Formlardan gelen kayıtlar: iletişim mesajı, ürün teklifi, katalog talebi.
 *
 * Kayıt JSON deposuna yazılır. E-posta/SMS bildirimi henüz yok — eklenecekse
 * `insert` çağrısından sonra tek bir servis çağrısı yeterli (bkz. README).
 */
import { Router } from "express";
import { insert } from "../db/json-store.js";
import { validate } from "../middleware/validate.js";
import {
  catalogRequestSchema,
  contactSchema,
  quoteSchema,
} from "../utils/schemas.js";

export const formsRouter = Router();

/** İstek üstverisi: hangi sayfadan, hangi tarayıcıdan geldi. */
function meta(req) {
  return {
    source: req.get("referer") ?? null,
    userAgent: req.get("user-agent") ?? null,
  };
}

formsRouter.post("/contact", validate(contactSchema), async (req, res) => {
  const record = await insert("messages", { ...req.body, ...meta(req) });

  res.status(201).json({
    ok: true,
    id: record.id,
    message: "Mesajınız bize ulaştı. Mesai saatleri içinde dönüş yapacağız.",
  });
});

formsRouter.post("/quotes", validate(quoteSchema), async (req, res) => {
  const record = await insert("quotes", { ...req.body, ...meta(req) });

  res.status(201).json({
    ok: true,
    id: record.id,
    message: `${req.body.productName} için talebiniz alındı. En kısa sürede arayacağız.`,
  });
});

formsRouter.post(
  "/catalog-requests",
  validate(catalogRequestSchema),
  async (req, res) => {
    const record = await insert("catalogRequests", {
      ...req.body,
      ...meta(req),
    });

    res.status(201).json({
      ok: true,
      id: record.id,
      message: "Talebiniz alındı. Kataloğu e-posta adresinize göndereceğiz.",
    });
  },
);
