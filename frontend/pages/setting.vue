<script setup lang="ts">
import Password from '~/lib/mist/Password';
import PasswordStrength from '~/components/common/form/PasswordStrength.vue';
import FileUploader from '~/components/common/form/FileUploader.vue';
import useUser from '~/store/user';

definePageMeta({middleware: 'auth'});
const user = useUser();
const api = useApi();
const fu = ref<InstanceType<typeof FileUploader>>();
const { locale, setLocale } = useI18n()
const {t} = useI18n()

const tab = ref<'username'|'password'|'profile_img'|'language'>('username');
const password = ref('');
const show_password = ref(false);
const password_error = ref(false);
const password_entropy = computed(() => Password.entropy(password.value.trim()));	

async function updateUsername(){
	if(user.username.trim()){
		const {data} =  await api.post(`/users/update_username/${user.username.trim()}`);
		if(data){
			notify.success(t('Username has been changed.'));
			await user.getProfile();
		}
		else notify.error(t('Username has been taken already.'));
	}
	else notify.success(t('Username is required.'));
}

async function updatePassword(){
	password_entropy.value > 50 ? password_error.value = false : password_error.value = true;
	if(password_entropy.value > 50){
		await api.post(`/users/update_password/${password.value}`)
		notify.success(t('Password reset successful'));
	}
	else notify.error(t('Weak password'));
}

/** secondary function */
function generatePassword() {
	const rand = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
	password.value = Password.generate(rand(16, 24));
	show_password.value = true;
}
function copyPassword() {
	if (password.value === '') {
		notify.error(t('Empty passwords cannot be copied'));
	}
	else {
		navigator.clipboard.writeText(password.value).then(() => {
			notify.success(t('The password is copied'));
		}, (err) => {
			notify.error(`${t("Can't copy. Something is wrong")}. ${err}`);
		});
	}
}
onMounted(()=>{
	fu.value?.uppy.on('upload-success', (_file, res) => {
		if(res.body.success) user.profile_img = res.body.data;
	})
});
</script>

<template>
<div class="mx-6">
	<Title>{{ $t('Setting') }}</Title>

	<h1 class="text-center font-bold text-3xl">{{ $t('Setting') }}</h1>

	<div class="tabs tabs-boxed mb-2 mt-3">
		<button class="tab" :class="{'tab-active': tab==='username'}" @click="tab='username'">{{ $t('Username') }}</button> 
		<button class="tab" :class="{'tab-active': tab==='password'}" @click="tab='password'">{{ $t('Password') }}</button>
		<button class="tab" :class="{'tab-active': tab==='profile_img'}" @click="tab='profile_img'">{{ $t('Profile image') }}</button>
		<button class="tab" :class="{'tab-active': tab==='language'}" @click="tab='language'">{{ $t('Language') }}</button>
	</div>

	<div v-if="tab==='username'" class="input-group">
		<input type="text" v-model="user.username" :placeholder="$t('Username')" class="input input-bordered w-full" @keyup.enter="updateUsername()" />
		<button @click="updateUsername()" class="btn btn-outline hover:btn-success">{{ $t('Update') }}</button>
	</div>

	<div v-if="tab==='password'">
			<div class="grid grid-cols-[1fr_repeat(3,_28px)] gap-2 mt-2">
				<input v-model="password" :type="(show_password) ? 'text' : 'password'" :placeholder="$t('Password')" :aria-label="$t('Password')" autocomplete="true" class="font-serif input input-bordered w-full" @keyup.enter="updatePassword()" />
				<button type="button" class="p-0 border-0 btn bg-transparent text-emerald-500 hover:text-blue-500" @click="generatePassword"><Icon name="fluent:key-reset-20-filled" class="text-3xl" /></button>
				<button type="button" class="p-0 border-0 btn bg-transparent text-emerald-500 hover:text-blue-500" @click="copyPassword"><Icon name="ion:md-copy" class="text-3xl" /></button>
				<button type="button" class="p-0 border-0 btn bg-transparent text-emerald-500 hover:text-blue-500" @click="show_password = !show_password">
					<Icon :name="show_password ? 'zondicons:view-show' : 'zondicons:view-hide'" class="text-3xl" />
				</button>
			</div>
			<p v-if="password_error" class="text-danger my-3">* {{ $t('Please enter a reasonable password (minimum)') }}</p>
			<PasswordStrength :entropy="password_entropy" class="mt-4" />
			<div class="w-full">
				<button @click="updatePassword()" class="btn btn-info block mx-auto mt-4">{{ $t('Update') }}</button>
			</div>
	</div>

	<div v-show="tab==='profile_img'">
		<FileUploader layout="profile_img" ref="fu" />
	</div>

	<div v-if="tab==='language'">
		<div class="join grow">
			<button type="button" class="join-item grow btn btn-sm btn-accent btn-outline" :class="{'btn-active': locale==='en'}" @click="setLocale('en')" >English</button>
			<button type="button" class="join-item grow btn btn-sm btn-accent btn-outline" :class="{'btn-active': locale==='es'}" @click="setLocale('es')" >Español</button>
			<button type="button" class="join-item grow btn btn-sm btn-accent btn-outline" :class="{'btn-active': locale==='ar'}" @click="setLocale('ar')" >عربي</button>
			<button type="button" class="join-item grow btn btn-sm btn-accent btn-outline" :class="{'btn-active': locale==='bn'}" @click="setLocale('bn')" >বাংলা</button>
			<button type="button" class="join-item grow btn btn-sm btn-accent btn-outline" :class="{'btn-active': locale==='zh-CN'}" @click="setLocale('zh-CN')" >中国人</button>
		</div>
	</div>
	
</div>
</template>
