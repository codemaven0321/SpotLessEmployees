import { notify } from "@kyvg/vue3-notification";

export default {
	info(text: string){
		notify({
			title: text,
			type: 'info'
		})
	},
	warning(text: string){
		notify({
			title: text,
			type: 'warning'
		})
	},
	success(text: string){
		notify({
			title: text,
			type: 'success'
		})
	},
	error(text: string){
		notify({
			title: text,
			type: 'error'
		})
	}
};
