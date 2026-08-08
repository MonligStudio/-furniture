/**
 * Mağaza ekibinin gelen kayıtları okuduğu uçlar.
 *
 * Hepsi `x-admin-token` başlığı ister (bkz. middleware/admin-auth.js).
 * Örnek:
 *
 *     curl -H "x-admin-token: $ADMIN_TOKEN" http://localhost:4100/api/admin/messages
 */
import { Router } from "express";
import { counts, list } from "../db/json-store.js";
import { adminAuth } from "../middleware/admin-auth.js";

export const adminRouter = Router();

adminRouter.use(adminAuth);

adminRouter.get("/summary", async (req, res) => {
  res.json({ ok: true, data: await counts() });
});

adminRouter.get("/messages", async (req, res) => {
  const data = await list("messages", { limit: Number(req.query.limit ?? 100) });
  res.json({ ok: true, count: data.length, data });
});

adminRouter.get("/quotes", async (req, res) => {
  const data = await list("quotes", { limit: Number(req.query.limit ?? 100) });
  res.json({ ok: true, count: data.length, data });
});

adminRouter.get("/catalog-requests", async (req, res) => {
  const data = await list("catalogRequests", {
    limit: Number(req.query.limit ?? 100),
  });
  res.json({ ok: true, count: data.length, data });
});
