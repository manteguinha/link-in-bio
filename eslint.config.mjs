// Flat config nativo (ESLint 9). eslint-config-next 16 já exporta flat configs.
import next from "eslint-config-next"

const eslintConfig = [
  ...next,
  {
    ignores: [".next/**", "node_modules/**", "public/**", "scripts/**"],
  },
]

export default eslintConfig
