export function isRequestParameterObject(value: unknown): value is object {
	return typeof value === "object";
}

export function isRequestParameterArray(value: unknown): value is Array<unknown> {
	return Array.isArray(value);
}

export function isRequestParameterNumber(value: unknown): value is number {
	return typeof value === "number";
}

export function isRequestParameterString(value: unknown): value is string {
	return typeof value === "string";
}

export function isRequestParameterBoolean(value: unknown): value is boolean {
	return typeof value === "boolean";
}

export function isRequestParameterNull(value: unknown): value is null {
	return value === null;
}
