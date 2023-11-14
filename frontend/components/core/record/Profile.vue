<script setup lang="ts">
import FileUploader from '~/components/common/form/FileUploader.vue';
import useAdminEmployee from '~/store/adminEmployee';

const api = useApi();
const admin_employee = useAdminEmployee();
const {t} = useI18n();

const fu = ref<InstanceType<typeof FileUploader>>();
const name = ref('');
const username = ref('');
const password = ref('');

name.value = admin_employee.employee.name as string;
username.value = admin_employee.employee.username as string;

async function updateName(){
	await api.post(`/admin/core/employees/${admin_employee.employee_id}`, {name: name.value});
	await admin_employee.getEmployeeProfile();
	notify.success(t('Name has been updated.'));
}
async function updateUsername(){
	if(username.value){
		const {data} = await api.post(`/admin/core/employees/${admin_employee.employee_id}`, {username: username.value});
		if(data){
			await admin_employee.getEmployeeProfile();
			notify.success(t('Username has been updated.'));
		}
		else notify.error(t('Username has been taken'));
	}
	else notify.error(t('Please type a username'));
}
async function updatePassword(){
	if(password.value){
		await api.post(`/admin/core/employees/${admin_employee.employee_id}`, {password: password.value});
		await admin_employee.getEmployeeProfile();
		notify.success(t('Password has been updated.'));
	}
	else notify.error(t('Please choose a password'));
}

onMounted(()=>{
	fu.value?.uppy.on('upload-success', async (_file, res) => {
		if(res.body.success){
			await admin_employee.getEmployeeProfile();
		}
	})
});
</script>

<template>
<div>
	<div class="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-x-4 sm:gap-y-3">
		<p>{{ $t('Name') }}:</p>
		<div class="input-group">
			<input type="text" v-model="name" :placeholder="$t('Name')" class="input input-bordered w-full" @keyup.enter="updateName()" />
			<button @click="updateName()" class="btn btn-outline hover:btn-success">{{ $t('Update') }}</button>
		</div>
		<p>{{ $t('Username') }}:</p>
		<div class="input-group">
			<input type="text" v-model.trim="username" placeholder="Username" class="input input-bordered w-full" @keyup.enter="updateUsername()" />
			<button @click="updateUsername()" class="btn btn-outline hover:btn-success">{{ $t('Update') }}</button>
		</div>
		<p>{{ $t('Password') }}: </p>
		<div class="input-group">
			<input type="text" v-model.trim="password" :placeholder="$t('Password')" class="input input-bordered w-full" @keyup.enter="updatePassword()" />
			<button @click="updatePassword()" class="btn btn-outline hover:btn-success">{{$t('Update')}}</button>
		</div>
		<p>{{ $t('Profile image') }}:</p>
		<div>
			<FileUploader layout="profile_img" ref="fu" :uid="admin_employee.employee_id" />
		</div>
	</div>
</div>
</template>
