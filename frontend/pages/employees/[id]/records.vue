<script setup lang="ts">
import HeaderAndTabs from '~/components/core/employees/header_and_tabs.vue';
import Records from '~/components/core/record/records.vue';

definePageMeta({
	middleware: 'admin'
});
</script>

<template>
<div class="mx-2">
	<Title>{{ $t('Employee') }}</Title>

	<HeaderAndTabs />
	<Records />

</div>
</template>
