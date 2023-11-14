<script setup lang="ts">
import useCustomers from '~/store/customers';
import Edit from '~/components/core/customers/upsert.vue';
import useSetting from '~/store/setting';

const api = useApi();
const customers = useCustomers();
const setting = useSetting();
const {t} = useI18n();


const customer_id_to_be_removed = ref(0);

async function delCustomer(){
	await api.delete(`/admin/core/customers/${customer_id_to_be_removed.value}`);
	customer_id_to_be_removed.value = 0;
	notify.success(t('Customer has been deleted.'));
	await customers.index();
}

async function reset(){
	customers.index_date = null;
	customers.index_status = '';
	customers.index_sort = '';
	await customers.index();
}


await customers.index();

onMounted(async ()=>{
	customers.edit_customer_id=0;
});
</script>

<template>
<div>
	<!-- filters -->
	<p class="mb-2">{{ $t('Today, you have ') }} {{ customers.today_customers_count }} {{ (customers.today_customers_count>1 ? $t('customers') : $t('customer')) }} </p>
	<section class="flex flex-wrap mb-2 gap-2">
		<VDatePicker v-model="customers.index_date" :is-dark="setting.ui.colorMode.value==='dark'" class="">
			<template #default="{ inputValue, inputEvents }">
				<input class="input input-bordered" :value="inputValue" v-on="inputEvents" placeholder="Date" />
			</template>
		</VDatePicker>
		<div><Multiselect v-model="customers.index_status" :options="['pending','price given','accepted','rejected','completed']" label="status" :searchable="false" placeholder="Status" :closeOnDeselect="true" class="!w-[14.5rem] input-md !capitalize" /></div>
		<div><Multiselect v-model="customers.index_sort" :options="['Date (Desc)', 'Date (Asc)']" label="sort" :searchable="false" placeholder="Sort" :closeOnDeselect="true" class="!w-[14.5rem] input-md !capitalize" /></div>
		<button @click="customers.index()" class="btn btn-outline hover:btn-info"><Icon name="ic:baseline-filter-alt" class="text-3xl" />{{$t('Filter')}}</button>
		<button @click="reset()" class="btn btn-outline hover:btn-info"><Icon name="fluent:arrow-reset-24-regular" class="text-3xl" />{{$t('Reset')}}</button>
	</section>

	<!-- index -->
	<div v-if="customers.index_loading" class="flex items-center gap-3">
		<span class="loading loading-spinner"></span>
		{{$t('Loading')}}
	</div>
	<div v-else>
		<div v-if="customers.customers.length">
			<div v-show="customers.edit_customer_id===0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
				<div v-for="customer of customers.customers" :key="customer.id" class="card card-compact w-full max-w-[40rem] bg-base-300">
					<div class="card-body">
						<div class="card-actions justify-end items-center">
							<p>Id: {{ customer.id }}</p>
							<button @click="customer_id_to_be_removed=customer.id" class="btn btn-sm btn-square btn-ghost hover:btn-error hover:text-black"><Icon name="bi:trash3" class="text-lg" /></button>
							<button @click="customers.edit_customer_id=customer.id" class="btn btn-sm rounded-lg btn-success btn-outline"><Icon name="material-symbols:contract-edit-outline-sharp" />{{$t('Edit')}}</button>
						</div>
						<p class="flex items-center gap-x-2">
							<span class="inline-flex gap-x-0.5 items-center"><Icon name="material-symbols:location-on-outline" /> {{ $t('Name') }}:</span>
							{{ customer.name }}
						</p>
						<p class="flex items-center gap-x-2">
							<span class="inline-flex gap-x-0.5 items-center"><Icon name="material-symbols:location-on-outline" /> {{ $t('Address') }}:</span>
							<span class="text-info">{{ customer.address }}</span>
						</p>
						<a :href="`tel:${customer.phone}`" class="flex items-center gap-x-2">
							<span class="inline-flex gap-x-0.5 items-center"><Icon name="material-symbols:call" /> {{ $t('Phone') }}:</span>
							<span class="link decoration-wavy">{{ customer.phone }}</span>
						</a>
						<p class="flex items-center gap-x-2">
							<span class="inline-flex gap-x-0.5 items-center"><Icon name="material-symbols:calendar-month-outline-rounded" /> {{ $t('Date') }}:</span>
							<span class="text-secondary">{{ dtf(customer.date) }}</span>
						</p>
						<p class="flex items-center gap-x-2">
							<span class="inline-flex gap-x-0.5 items-center"><Icon name="carbon:status-change" /> {{ $t('Status') }}:</span>
							<span class="text-success capitalize">{{ customer.status }}</span>
						</p>
						<p class="flex items-center gap-x-2">
							<span class="inline-flex gap-x-0.5 items-center"><Icon name="ic:sharp-note" /> {{ $t('Note') }}:</span>
							{{ customer.note }}
						</p>
						<p class="flex items-center flex-col justify-center gap-x-2">
							<span class="inline-flex gap-x-0.5 items-center"><Icon name="ic:sharp-note" /> {{ $t('Records') }}:</span>
						</p>
						<table class="table table-xs">
								<tr>
									<th class="text-center">User</th>
									<th class="text-center">Work</th>
									<th class="text-center">Is paid</th>
								</tr>
								<tr v-for="record, i of customer.records" :key="i">
									<td>
										<div class="text-center">
											<img :src="useFile('profile_img', record.profile_img, 128)" class="w-6 h-6 rounded-full mx-auto" />
											{{ record.name }}
										</div>
									</td>
									<td class="text-center">
										<p>${{ record.worked_hour*record.hourly_wage }}</p>
										<p>{{ record.worked_hour }}H * {{ record.hourly_wage }}</p>
									</td>
									<td class="font-mono font-bold text-lg text-center" :class="record.is_paid ? 'text-success': 'text-error'">{{ record.is_paid ? $t('Yes') : $t('No') }}</td>
								</tr>
							</table>
					</div>
				</div>
			</div>
		</div>
		<div v-else class="alert alert-info">
			{{ $t('No customers') }}
		</div>
	</div>


	<Edit v-show="customers.edit_customer_id!==0" intent="edit"/>

	<dialog class="modal" :class="{'modal-open': customer_id_to_be_removed!==0}">
		<div class="modal-box border border-dotted border-info">
			<h3 class="font-bold text-lg">Confirmation:</h3>
			<br>
			<p>Id: {{ customers.customers.find(v=>v.id===customer_id_to_be_removed)?.id }}</p>
			<p>{{$t('Name')}}: {{ customers.customers.find(v=>v.id===customer_id_to_be_removed)?.name }}</p>
			<p>{{$t('Address')}}: {{ customers.customers.find(v=>v.id===customer_id_to_be_removed)?.address }}</p>
			<br>
			<div class="flex gap-x-2 justify-end">
				<button @click="customer_id_to_be_removed=0" class="btn btn-sm rounded-lg btn-neutral btn-outline border-0">{{ $t('Cancel') }}</button>
				<button @click="delCustomer()" class="btn btn-sm rounded-lg btn-error btn-outline">{{ $t('Remove') }}</button>
			</div>
		</div>
		<div class="modal-backdrop" @click="customer_id_to_be_removed=0">
			<button>{{$t('close')}}</button>
		</div>
	</dialog>


</div>
</template>
