<script setup lang="ts">
import HeaderAndTabs from '~/components/core/employees/header_and_tabs.vue';
import Add from '~/components/core/record/upsert.vue';

definePageMeta({
	middleware: 'admin'
});
</script>

<template>
<div class="px-2 max-w-3xl mx-auto">
	<Title>{{ $t('Employee') }}</Title>

	<HeaderAndTabs />
	<Add intent="create" />

</div>
</template>
