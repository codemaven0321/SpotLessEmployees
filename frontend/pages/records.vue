<script setup lang="ts">
import useUser from '~/store/user';
import type { Record } from '~/types/core';
import useSetting from '~/store/setting';

definePageMeta({
	middleware: 'employee'
});

const api = useApi();
const user = useUser();
const setting = useSetting();
const records = ref<Record[]>([]);
const date = ref<null|Date>(null);
const sort = ref('');
const loading = ref(false);

async function getRecords(){
	loading.value = true;

	const usp = new URLSearchParams();
	if(date.value) usp.append('date', dtf.searchDate(date.value.valueOf()));
	if(sort.value) usp.append('sort', sort.value);
	const {data} =await api.get(`/employee/records?${usp.toString()}`);
	records.value = data;

	loading.value = false;
}
await getRecords();

async function reset(){
	date.value = null;
	sort.value = '';
	await getRecords();
}
</script>

<template>
<div class="mx-2">
	
	<!-- filters -->
	<section class="flex flex-wrap mb-2 gap-2">
		<VDatePicker v-model="date" :is-dark="setting.ui.colorMode.value==='dark'" class="">
			<template #default="{ inputValue, inputEvents }">
				<input class="input input-bordered" :value="inputValue" v-on="inputEvents" placeholder="Date" />
			</template>
		</VDatePicker>
		<div><Multiselect v-model="sort" :options="['Date (Desc)', 'Date (Asc)']" label="sort" :searchable="false" placeholder="Sort" :closeOnDeselect="true" class="!w-[14.5rem] input-md !capitalize" /></div>
		<button @click="getRecords()" class="btn btn-outline hover:btn-info"><Icon name="ic:baseline-filter-alt" class="text-3xl" />{{ $t('Filter') }}</button>
		<button @click="reset()" class="btn btn-outline hover:btn-info"><Icon name="fluent:arrow-reset-24-regular" class="text-3xl" />{{ $t('Reset') }}</button>
	</section>

	<div v-if="loading" class="flex items-center gap-3">
		<span class="loading loading-spinner"></span>
		{{$t('Loading')}}
	</div>
	<div v-else>
		<div v-if="records.length">
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
				<div v-for="record of records" :key="record.id" class="card card-compact w-full max-w-[40rem] bg-base-300">
					<div class="card-body">
						<div class="card-actions justify-end items-center">
							<p class="flex items-center gap-x-2">
								<span class="inline-flex gap-x-0.5 items-center"><Icon name="material-symbols:calendar-month-outline-rounded" />{{ $t('Date') }}: </span>
								{{ dtf(record.date) }}
							</p>
						</div>
						<p class="flex items-center gap-x-2">
							<span class="inline-flex gap-x-0.5 items-center"><Icon name="material-symbols:location-on-outline" /> {{ $t('Location') }}:</span>
							{{ record.address }}
						</p>
						<p class="flex items-center gap-x-2">
							<span class="inline-flex gap-x-0.5 items-center"><Icon name="typcn:stopwatch" />{{ $t('Worked hour') }}:</span>
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
		<div v-else class="alert alert-success">{{ $t('No records') }}</div>
	</div>



</div>
</template>
