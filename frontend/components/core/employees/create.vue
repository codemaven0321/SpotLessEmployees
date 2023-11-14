<script setup lang="ts">
const api = useApi();;
const emit = defineEmits(['tab']);
const {t} = useI18n();

const name = ref('');
const username = ref('');
const password = ref('');

const error = reactive({
	username: false,
	password: false
})

function reset(){
	name.value = '';
	username.value = '';
	password.value = '';
}

async function create(){
	error.username=!username.value
	error.password=!password.value

	if(!error.username && !error.password){
		const {data} = await api.post('/admin/core/employees', {
			"username": username.value,
			"password": password.value,
			"name": name.value
		});
		if(data){
			emit('tab', 'index');
			notify.success(t('Employee has been added.'));
		}
		else notify.error(t('Username has been taken.'));
	}
	else notify.error(t('Please complete the form.'));
}

watch(username, ()=>{error.username=!username.value})
watch(password, ()=>{error.password=!password.value})
</script>

<template>
<div>

	<div class="my-4">
		<div class="flex flex-col gap-6">
			<label class="grid grid-cols-1 md:grid-cols-[9rem_1fr] gap-x-4">
				<span>{{ $t('Name') }}: </span>
				<input type="text" v-model="name" placeholder="Name" class="input input-bordered" />
			</label>
			<label class="grid grid-cols-1 md:grid-cols-[9rem_1fr] gap-x-4">
				<span>{{ $t('Username') }}: </span>
				<input type="text" v-model.trim="username" :placeholder="$t('Username')" class="input input-bordered" />
				<p v-if="error.username" class="text-error">* {{ $t('Username is required') }}</p>
			</label>
			<label class="grid grid-cols-1 md:grid-cols-[9rem_1fr] gap-x-4">
				<span>{{ $t('Password') }}: </span>
				<input type="text" v-model="password" :placeholder="$t('Password')" class="input input-bordered" />
				<p v-if="error.password" class="text-error">* {{ $t('Password is required') }}</p>
			</label>
		</div>

		<div class="flex mt-4 justify-center gap-2">
			<button @click="reset()" class="btn btn-outline border-none">{{$t('Reset')}}</button>
			<button @click="create()" class="btn btn-outline btn-success">{{ $t('Add') }}</button>
		</div>

	</div>



</div>
</template>
