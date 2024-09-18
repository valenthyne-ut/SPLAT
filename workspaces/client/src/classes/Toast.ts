export type ToastType =
	| "success"
	| "info"
	| "alert"
	| "error";

export class Toast {
	id: string;
	createdAt: number; // x seconds after epoch
	destroyAfter: number; // x seconds

	message: string;
	type: ToastType;
	disappearing: boolean;

	constructor(message: string, type: ToastType, destroyAfter: number) {
		this.id = Toast.randomId();
		this.createdAt = new Date().getTime() / 1000;
		this.destroyAfter = destroyAfter;

		this.message = message;
		this.type = type;
		this.disappearing = false;
	}

	private static randomId() {
		return [...crypto.getRandomValues(new Uint8Array(32))].map(m => ("0" + m.toString(16)).slice(-2)).join("");
	}
}