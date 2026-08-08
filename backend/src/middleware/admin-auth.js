import { config } from "../config.js";
import { ApiError } from "./errors.js";

/**
 * Admin uçları için basit token kontrolü (`x-admin-token` başlığı).
 *
 * Panel/oturum yönetimi yok: bu uçlar yalnızca mağaza ekibinin gelen
 * form kayıtlarını okuması için var. Gerçek bir panel eklenirse buranın
 * yerini oturum tabanlı bir kimlik doğrulama alır.
 */
export function adminAuth(req, res, next) {
  const token = req.get("x-admin-token");

  if (!token || token !== config.adminToken) {
    return next(new ApiError(401, "Yetkisiz istek."));
  }

  next();
}
