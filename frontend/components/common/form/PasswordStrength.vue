<script setup lang="ts">
defineProps({
	entropy: {
		type: Number,
		required: true
	}
});
</script>

<template>
<div v-if="entropy>0" class="text-center">
	<div v-if="entropy <= 25" class="text-rose-600">
		<Icon name="bi:emoji-angry" class="text-2xl mx-auto animate-bounce-horizontal animate-[bounce-horizontal_.5s_infinite]" />
		<p>{{$t('Poor password')}} ({{ $t('Strength') }} : {{entropy}} )</p>
	</div>
	<div v-else-if="entropy > 25 && entropy <= 50" class="text-rose-600">
		<Icon name="bi:emoji-frown" class="text-2xl mx-auto animate-bounce-horizontal" />
		<p>{{$t('Weak password')}} ({{$t('Strength')}} : {{entropy}} )</p>
	</div>
	<div v-else-if="entropy > 51 && entropy <= 75" class="text-sky-500">
		<Icon name="iconoir:emoji-ball" class="text-2xl mx-auto animate-pulse" />
		<p class="mb-0 d-inline-block ms-2">{{ $t('Reasonable password') }} ({{$t('Strength')}}: {{entropy}} )</p>
	</div>
	<div v-else-if="entropy > 75 && entropy <= 100" class="text-blue-600">
		<Icon name="bi:emoji-smile" class="text-2xl mx-auto animate-bounce" />
		<p class="mb-0 d-inline-block ms-2">{{ $t('Good password') }} ({{$t('Strength')}} : {{entropy}} )</p>
	</div>
	<div v-else-if="entropy > 100" class="text-emerald-500">
		<Icon name="bi:emoji-heart-eyes" class="text-2xl mx-auto animate-[bounce_.5s_infinite]" />
		<p class="mb-0 d-inline-block ms-2">{{ $t('Excellent password') }} ({{$t('Strength')}} : {{entropy}} )</p>
	</div>
</div>
</template>
