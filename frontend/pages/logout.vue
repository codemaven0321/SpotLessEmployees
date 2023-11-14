<script setup lang="ts">
import useUser from '~/store/user';

definePageMeta({ middleware: 'auth' });

onMounted(async () => {
	const user = useUser();
	const api = useApi();
	await api.delete('/users/logout', {
		headers: {
			'User-Authorization': user.token
		}
	});

	useCookie('ult').value = undefined;
	user.$reset();
	await navigateTo('/login');
});
</script>

<template>
<div></div>
</template>
