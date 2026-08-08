import { createApp } from "./app.js";
import { config } from "./config.js";

const app = createApp();

app.listen(config.port, () => {
  console.log(
    `escudo-api → http://localhost:${config.port} (${config.nodeEnv})`,
  );

  if (config.adminToken === "escudo-degistir") {
    console.warn(
      "⚠ ADMIN_TOKEN varsayılan değerde. Yayına çıkmadan önce .env içinden değiştirin.",
    );
  }
});
