<script setup lang="ts">
import useUser from '~/store/user';

definePageMeta({ middleware: 'guest', layout: 'clean' });
const api = useApi();

/** state */
const username = ref('');
const password = ref('');

/** helper state */
const show_password = ref(false);
const form_submit_loading = ref(false);
const credential_error = ref(false);
const {t} = useI18n()

/** watch */
watch(username, () => { credential_error.value = false })
watch(password, () => { credential_error.value = false; })

async function login() {
	form_submit_loading.value = true;

	const usp = new URLSearchParams();
	usp.append('username', username.value);
	usp.append('password', password.value);

	const {data} = await api.get(`/users/login?${usp}`)

	if(data){
		const user = useUser();
		user.token = data;

		notify.success(t('Login succeeded'));
		credential_error.value = false;
		await navigateTo('/');
	}
	else {
		notify.error(t('Something went wrong. Please try again'));
		credential_error.value = true;
	}

	form_submit_loading.value = false;
}
</script>

<template>
<div>
	<Title>{{ $t('Login') }}</Title>
	<section class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
		<div class="max-w-[512px] mx-auto bg-base-100 rounded-2xl px-3">
			<h3 class="header">
				<img class="mx-auto text-emerald-500 h-20 hidden dark:block" src="/logo.png"   />
				<img class="mx-auto text-emerald-500 h-20 block dark:hidden rounded-xl" src="/logo-light.jpg"   />
				<p class="mt-3 mb-4 text-center">{{ $t('Welcome Back') }}</p>
			</h3>
			<form class="" @submit.prevent>
				<input v-model.trim="username" type="text" :placeholder="$t('Username')" :aria-label="$t('Username')" class="font-serif input input-bordered w-full" @keyup.enter="login()">
				<div class="grid my-3 grid-cols-[1fr_28px] gap-[0_.4rem] ">
					<input v-model="password" :type="(show_password) ? 'text' : 'password'" autocomplete="true" :placeholder="$t('Password')" :aria-label="$t('Password')" class="font-serif input input-bordered w-full" @keyup.enter="login()">
					<button type="button" class="p-0 border-0 btn btn-ghost !bg-transparent text-emerald-600 hover:text-blue-500" @click="show_password = !show_password">
						<Icon :name="show_password ? 'zondicons:view-show' : 'zondicons:view-hide'" class="text-3xl" />
					</button>
				</div>
			</form>
		
			<button type="submit" class="btn btn-outline hover:btn-success" :class="{'loading loading-bars mx-auto': form_submit_loading}" @click="login()">
				{{ $t('Login') }}
			</button>
		</div>
	</section>
</div>
</template>
