// eslint-disable-next-line import/no-extraneous-dependencies
import { ColorModeInstance } from '@nuxtjs/color-mode/dist/runtime/types';

interface UI {
	colorMode: ColorModeInstance,
	grayscale: boolean,
	sidebar: {
		expanded: boolean
	}
}

const useSetting = defineStore('setting', () => {
	const ui = reactive<UI>({
		colorMode: useNuxtApp().$colorMode,
		grayscale: false,
		sidebar: {
			expanded: false
		}
	});

	function changeColor(){
		if(ui.colorMode.value==='dark') ui.colorMode.preference = 'light';
		else if(ui.colorMode.value==='light') ui.colorMode.preference = 'dark';
	}

	return {
		ui, changeColor
	};
})

export default useSetting;

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useSetting, import.meta.hot))
