import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

/* Next 16'nın kendi flat config'i. `npm run lint` bunu kullanır. */
export default [
  ...coreWebVitals,
  ...typescript,
  { ignores: [".next/**", "out/**", "node_modules/**"] },
];
