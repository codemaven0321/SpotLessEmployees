<script setup lang="ts">
import type {User} from '~/types/core.d.ts';

const api = useApi();
const {t} =useI18n();

const employees = ref<User[]>([]);
const loading = ref(false);
const search_employee_name = ref('');
const employee_id_to_be_removed = ref('');

async function getEmployees(){
	loading.value = true;
	const {data} = await api.get('/admin/core/employees');
	employees.value = data;
	loading.value = false;
}
async function searchEmployees(){
	loading.value = true;
	const {data} = await api.get('/admin/core/employees?search='+search_employee_name.value);
	employees.value = data;
	loading.value = false;
}
await getEmployees();

async function delEmployee(){
	await api.delete(`/admin/core/employees/${employee_id_to_be_removed.value}`);
	employee_id_to_be_removed.value = '';
	notify.success(t('Employee has been removed.'));
	await getEmployees();
}
onUnmounted(()=>{
	employees.value = [];
});
</script>

<template>
<div>

	<div>
		<div class="input-group mb-2">
			<input type="text" v-model="search_employee_name" placeholder="Search employee" @keyup.enter="searchEmployees()" class="input input-bordered w-full max-w-xs" />
			<button @click="searchEmployees()" class="btn btn-outline hover:btn-info"><Icon name="material-symbols:search" class="text-3xl" /></button>
		</div>
		<CommonLoading v-if="loading" />
		<div v-else class="overflow-auto">

			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
				<div v-for="employee of employees" :key="employee.id">
					<div class="card card-compact w-full max-w-[40rem] bg-base-300 p-2">
						<div class="flex gap-x-2 items-end">
							<img :src="useFile('profile_img', employee.profile_img, 128)" class="w-20 h-20 rounded-xl" />
							<div>
								<p class="mt-2">{{ $t('Name') }}: {{ employee.name }}</p>
								<p class="mb-2">{{ $t('Username') }}: {{ employee.username }}</p>
							</div>
						</div>
						<div class="mt-2 flex flex-wrap gap-2">
							<NuxtLink :to="`/employees/${employee.id}/records`" class="btn btn-sm rounded-lg btn-success btn-outline">{{ $t('Records') }}</NuxtLink>
							<NuxtLink :to="`/employees/${employee.id}/profile`" class="btn btn-sm rounded-lg btn-info btn-outline">{{ $t('Profile') }}</NuxtLink>
							<button @click="employee_id_to_be_removed=employee.id" class="btn btn-sm rounded-lg btn-error btn-outline">
								<Icon name="bi:trash3" class="text-lg" />
							</button>
						</div>
					</div>
				</div>
			</div>

		</div>

	</div>

	<dialog class="modal" :class="{'modal-open': employee_id_to_be_removed!==''}">
	<div class="modal-box border border-dotted border-info">
		<h3 class="font-bold text-lg">{{$t('Confirmation')}}:</h3>
		<br>
		<p>Id: {{ employees.find(v=>v.id===employee_id_to_be_removed)?.id }}</p>
		<p>{{ $t('Name') }}: {{ employees.find(v=>v.id===employee_id_to_be_removed)?.name }}</p>
		<p>{{ $t('Username') }}: {{ employees.find(v=>v.id===employee_id_to_be_removed)?.username }}</p>
		<br>
		<div class="flex gap-x-2 justify-end">
			<button @click="employee_id_to_be_removed=''" class="btn btn-sm rounded-lg btn-neutral btn-outline border-0">{{ $t('Cancel') }}</button>
			<button @click="delEmployee()" class="btn btn-sm rounded-lg btn-error btn-outline">{{ $t('Remove') }}</button>
		</div>
	</div>
	<div class="modal-backdrop" @click="employee_id_to_be_removed=''">
		<button>{{ $t('close') }}</button>
	</div>
	</dialog>


</div>
</template>
