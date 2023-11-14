<script setup lang="ts">
import useSetting from '~/store/setting';

const s = useSetting();
const { locale} = useI18n()

watch(()=>s.ui.grayscale, n=>{
	if(process.client) {
		const body = document.getElementsByTagName('body')[0];
		if(n) body.classList.add('grayscale');
		else body.classList.remove('grayscale');
	}
})
</script>

<template>
	<div :dir="locale==='ar' ? 'rtl':'ltr'">
		<NuxtLayout>
			<NuxtPage/>
		</NuxtLayout>
		<notifications position="bottom right" :duration="2000" :pause-on-hover="true" width="100%" />
	</div>
</template>
