import FloatingVue from 'floating-vue';

export default defineNuxtPlugin(nuxtApp => {
	nuxtApp.vueApp.use(FloatingVue, {
		themes: {
			'tooltip-primary':         { $extend: 'tooltip', $resetCss: false },
			'tooltip-secondary':       { $extend: 'tooltip', $resetCss: false },
			'tooltip-info':            { $extend: 'tooltip', $resetCss: false },
			'tooltip-warning':         { $extend: 'tooltip', $resetCss: false },
			'tooltip-error':           { $extend: 'tooltip', $resetCss: false },
			'tooltip-success':         { $extend: 'tooltip', $resetCss: false },
			'dropdown-primary':        { $extend: 'dropdown', $resetCss: false },
			'dropdown-secondary':      { $extend: 'dropdown', $resetCss: false },
			'dropdown-info':           { $extend: 'dropdown', $resetCss: false },
			'dropdown-warning':        { $extend: 'dropdown', $resetCss: false },
			'dropdown-error':          { $extend: 'dropdown', $resetCss: false },
			'dropdown-success':        { $extend: 'dropdown', $resetCss: false },
		}
	});
})
