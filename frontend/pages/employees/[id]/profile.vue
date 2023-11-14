<script setup lang="ts">
import HeaderAndTabs from '~/components/core/employees/header_and_tabs.vue';
import Profile from '~/components/core/record/Profile.vue';

definePageMeta({
	middleware: 'admin'
});
</script>

<template>
<div class="px-2 max-w-3xl mx-auto">
	<Title>{{ $t('Employee') }}</Title>

	<HeaderAndTabs />
	<Profile />

</div>
</template>
