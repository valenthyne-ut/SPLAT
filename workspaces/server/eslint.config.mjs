import globals from "globals";
import eslint from "@eslint/js";
import tslint from "typescript-eslint";

export default [
	{ ignores: ["dist", "eslint.config.mjs"] },
	{ files: ["**/*.{js,mjs,cjs,ts}"] },
	{ 
		languageOptions: { 
			globals: {
				...globals.node,
				...globals.es2025
			},
			parserOptions: {
				project: true,
				tsconfigRootDir: import.meta.dirname
			}
		} 
	},
	eslint.configs.recommended,
	...tslint.configs.recommendedTypeChecked,
	{
		rules: {
			"indent": ["error", "tab"],
			"semi": ["error", "always"],
			"quotes": ["warn", "double"]
		}
	}
];