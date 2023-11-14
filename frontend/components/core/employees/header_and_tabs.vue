<script setup lang="ts">
import useAdminEmployee from '~/store/adminEmployee';

const admin_employee = useAdminEmployee();
const {params} = useRoute();
const id = params.id as string;

admin_employee.employee_id = id;
await admin_employee.getEmployeeProfile();
</script>

<template>
<div>

	<div>
		<h1 class="text-2xl text-center">{{ $t('Employee') }}</h1>
	</div>

	<div class="flex gap-x-2 items-end">
		<img :src="useFile('profile_img', admin_employee.employee.profile_img, 128)" class="w-20 h-20 rounded-xl" />
		<div>
			<p class="mt-2">{{ $t('Name') }}: {{ admin_employee.employee.name }}</p>
			<p class="mb-2">{{ $t('Username') }}: {{ admin_employee.employee.username }}</p>
		</div>
	</div>

	<div class="tabs tabs-boxed my-2">
		<NuxtLink :to="`/employees/${$route.params.id}/records`" class="tab" :class="{'tab-active': $route.name==='employees-id-records'}"   >{{ $t('Records') }}</NuxtLink> 
		<NuxtLink :to="`/employees/${$route.params.id}/create`" class="tab" :class="{'tab-active': $route.name==='employees-id-create'}" >{{$t('Add Record')}}</NuxtLink> 
		<NuxtLink :to="`/employees/${$route.params.id}/profile`" class="tab" :class="{'tab-active': $route.name==='employees-id-profile'}" >{{$t('Profile')}}</NuxtLink>
	</div>

</div>
</template>
