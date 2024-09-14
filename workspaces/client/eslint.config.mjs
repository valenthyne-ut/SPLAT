import globals from "globals";
import eslint from "@eslint/js";
import tslint from "typescript-eslint";
import vuelint from "eslint-plugin-vue";

export default [
	{ ignores: ["dist", "eslint.config.mjs"] },
	{ files: ["**/*.{js,mjs,cjs,ts,vue}"] },
	{ 
		languageOptions: { 
			globals: { 
				...globals.browser,
				...globals.es2025
			},
			parserOptions: {
				project: [
					"tsconfig.json",
					"tsconfig.app.json",
					"tsconfig.node.json"
				],
				tsconfigRootDir: import.meta.dirname,
				extraFileExtensions: [".vue"],
				sourceType: "module"
			}
		}
	},
	eslint.configs.recommended,
	...tslint.configs.recommendedTypeChecked,
	...vuelint.configs["flat/essential"],
	{
		rules: {
			"indent": ["error", "tab"],
			"semi": ["error", "always"],
			"quotes": ["warn", "double"]
		}
	},
	{ 
		files: ["**/*.vue"], 
		languageOptions: {
			parserOptions: {
				parser: tslint.parser
			}
		},
		rules: {
			"indent": "off",
			"vue/script-indent": ["error", "tab", { "baseIndent": 1 }],
			"vue/html-indent": ["error", "tab"],
			"vue/html-self-closing": "off",
			"vue/singleline-html-element-content-newline": "off"
		}
	},
];