<script setup lang="ts">
import UpdateRecord from '~/components/core/record/upsert.vue';
import useAdminEmployee from '~/store/adminEmployee';
import useSetting from '~/store/setting';

const api = useApi();
const admin_employee = useAdminEmployee();
const setting = useSetting();
const {t} = useI18n();

async function delRecord(record_id: string){
	await api.delete(`/admin/core/records/${record_id}`);
	await admin_employee.getRecords();
	notify.success(t('Record has been deleted.'));
}

async function reset(){
	admin_employee.records_date = null;
	admin_employee.records_sort = '';
	await admin_employee.getRecords();
}

await admin_employee.getRecords();
</script>

<template>
<div>
	<section class="flex flex-wrap mb-2 gap-2">
		<VDatePicker v-model="admin_employee.records_date" :is-dark="setting.ui.colorMode.value==='dark'" class="">
			<template #default="{ inputValue, inputEvents }">
				<input class="input input-bordered" :value="inputValue" v-on="inputEvents" placeholder="Date" />
			</template>
		</VDatePicker>
		<div><Multiselect v-model="admin_employee.records_sort" :options="['Date (Desc)', 'Date (Asc)']" label="sort" :searchable="false" placeholder="Sort" :closeOnDeselect="true" class="!w-[14.5rem] input-md !capitalize" /></div>
		<button @click="admin_employee.getRecords()" class="btn btn-outline hover:btn-info"><Icon name="ic:baseline-filter-alt" class="text-3xl" />{{ $t('Filter') }}</button>
		<button @click="reset()" class="btn btn-outline hover:btn-info"><Icon name="fluent:arrow-reset-24-regular" class="text-3xl" />{{ $t('Reset') }}</button>
	</section>

	<div v-if="admin_employee.records_loading" class="flex items-center gap-3">
		<span class="loading loading-spinner"></span>
		{{$t('Loading')}}
	</div>
	<div v-else>
		<div v-show="admin_employee.edit_record_id===''" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
			<div v-for="record of admin_employee.records" :key="record.id" class="card card-compact w-full max-w-[40rem] bg-base-300">
				<div class="card-body">
					<div class="card-actions justify-end items-center">
						<p class="flex items-center gap-x-2">
							<span class="inline-flex gap-x-0.5 items-center"><Icon name="material-symbols:calendar-month-outline-rounded" />{{ $t('Date') }}: </span>
							{{ dtf(record.date) }}
						</p>
						<button @click="delRecord(record.id)" class="btn btn-sm btn-square btn-ghost hover:btn-error hover:text-black"><Icon name="bi:trash3" class="text-lg" /></button>
						<button @click="admin_employee.edit_record_id=record.id" class="btn btn-sm rounded-lg btn-success btn-outline"><Icon name="material-symbols:contract-edit-outline-sharp" /></button>
					</div>
					<p class="flex items-center gap-x-2">
						<span class="inline-flex gap-x-0.5 items-center"><Icon name="material-symbols:nature-people-outline-sharp" /> {{ $t('Customer') }} Id:</span>
						{{ record.customer_id }}
					</p>
					<p class="flex items-center gap-x-2">
						<span class="inline-flex gap-x-0.5 items-center"><Icon name="material-symbols:location-on-outline" /> {{ $t('Address') }}:</span>
						{{ record.address }}
					</p>
					<p class="flex items-center gap-x-2">
						<span class="inline-flex gap-x-0.5 items-center"><Icon name="typcn:stopwatch" /> {{ $t('Worked hour') }}:</span>
						{{ record.worked_hour }}H
					</p>
					<p class="flex items-center gap-x-0.5">
						<Icon name="uil:moneybag-alt" /> {{ $t('Revenue') }}:
					</p>
					<table class="table">
						<tr class="border border-neutral">
							<td>{{ $t('Per Hour') }}</td>
							<td>${{ record.hourly_wage }}</td>
						</tr>
						<tr class="border border-neutral">
							<td>{{ $t('Total') }}</td>
							<td class="text-secondary font-mono font-bold text-lg">${{ record.worked_hour*record.hourly_wage }}</td>
						</tr>
						<tr class="border border-neutral">
							<td>{{ $t('Is paid') }}</td>
							<td class="font-mono font-bold text-lg" :class="record.is_paid ? 'text-success': 'text-error'">{{ record.is_paid ? $t('Yes') : $t('No') }}</td>
						</tr>
					</table>
					<p class="flex items-center gap-x-2">
						<span class="inline-flex gap-x-0.5 items-center"><Icon name="ic:sharp-note" /> {{ $t('Note') }}:</span>
						{{ record.note }}
					</p>
				</div>
			</div>
		</div>
	</div>
	<UpdateRecord v-show="admin_employee.edit_record_id!==''" intent="edit"/>

</div>
</template>
