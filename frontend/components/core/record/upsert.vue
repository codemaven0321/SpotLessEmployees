<script setup lang="ts">
import useSetting from '~/store/setting';
import useAdminEmployee from '~/store/adminEmployee';
// import { Customer } from '~/types/core.d.ts';

const setting = useSetting();
const api = useApi();
const $route = useRoute();
const props = defineProps<{
	intent: 'create'|'edit'
}>();
const admin_employee = useAdminEmployee();
const {t} = useI18n();

const address = ref('');
const hourly_wage = ref(0);
const note = ref('');
const date = ref(new Date());
const worked_hour = ref(0);
const is_paid = ref(false);
const customer_id = ref<number>();

function reset(){
	address.value = '';
	hourly_wage.value = 0;
	note.value = '';
	date.value = new Date();
	worked_hour.value = 0;
}

async function submit(){
	await api.post(`/admin/core/records/${admin_employee.employee_id}`, {
		"customer_id": customer_id.value || null,
		"address": address.value,
		"date": date.value.valueOf(),
		"worked_hour": worked_hour.value,
		"is_paid": is_paid.value,
		"hourly_wage": hourly_wage.value.toString(),
		"note": note.value,
	});
	notify.success(t('Record has been added.'));
	await navigateTo(`/employees/${$route.params.id}/records`);
	admin_employee.tab = 'records';
}

async function update(){
	await api.post(`/admin/core/records/update/${admin_employee.edit_record_id}`, {
		"customer_id": customer_id.value || null,
		"address": address.value,
		"date": date.value.valueOf(),
		"worked_hour": worked_hour.value,
		"is_paid": is_paid.value,
		"hourly_wage": hourly_wage.value.toString(),
		"note": note.value
	})
	await admin_employee.getRecords();
	notify.success(t('Record has been updated.'));
	reset();
	admin_employee.edit_record_id = '';
}

async function cancel(){
	reset();
	admin_employee.edit_record_id = '';
}
watch(()=>admin_employee.edit_record_id, async ()=>{
	if(admin_employee.edit_record_id){
		const {data} = await api.get(`/admin/core/records/show/${admin_employee.edit_record_id}`);
		customer_id.value = data.customer_id;
		address.value = data.address;
		hourly_wage.value = data.hourly_wage;
		note.value = data.note;
		is_paid.value = data.is_paid;
		worked_hour.value = data.worked_hour;
		date.value = new Date(data.date);
	}
})
</script>

<template>
<div>

	<div class="my-4">
		<div class="flex flex-col gap-6">
			<template v-if="intent==='edit'">
				<h1 class="text-2xl text-center">{{ $t('Edit Record') }}</h1>
				<p>Id: <span class="text-xs sm:text-base">{{admin_employee.edit_record_id}}</span></p>
			</template>
			<label class="grid grid-cols-1 md:grid-cols-[9rem_1fr] gap-x-4">
				<span>{{ $t('Customer ID') }}: </span>
				<input type="number" v-model="customer_id" :min="1" :placeholder="$t('Customer ID')" class="input input-bordered" />
			</label>
			<label class="grid grid-cols-1 md:grid-cols-[9rem_1fr] gap-x-4">
				<span>{{ $t('Address') }}: </span>
				<input type="text" v-model="address" :placeholder="$t('Address')" class="input input-bordered" />
			</label>
			<label class="grid grid-cols-1 md:grid-cols-[9rem_1fr] gap-x-4">
				<span>{{ $t('Date') }}: </span>
				<VDatePicker v-model="date" :is-dark="setting.ui.colorMode.value==='dark'">
					<template #default="{ inputValue, inputEvents }">
						<input class="input input-bordered" :value="inputValue" v-on="inputEvents" />
					</template>
				</VDatePicker>
			</label>
			<label class="grid grid-cols-1 md:grid-cols-[9rem_1fr] gap-x-4">
				<span>{{ $t('Worked Hour') }}: </span>
				<input type="number" v-model="worked_hour" :placeholder="$t('Worked Hour')" class="input input-bordered" />
			</label>
			<label class="grid grid-cols-1 md:grid-cols-[9rem_1fr] gap-x-4">
				<span>{{ $t('Hourly Wage') }} ($): </span>
				<input type="number" v-model="hourly_wage" :placeholder="$t('Hourly Wage')+' ($)'" class="input input-bordered" />
			</label>
			<label class="grid grid-cols-1 md:grid-cols-[9rem_1fr] gap-x-4">
				<span>{{ $t('Is paid') }}: </span>
				<input type="checkbox" v-model="is_paid" class="toggle toggle-primary" />
			</label>
			<label class="grid grid-cols-1 md:grid-cols-[9rem_1fr] gap-x-4">
				<span>{{$t('Note')}}: </span>
				<textarea v-model="note" class="textarea textarea-bordered" :placeholder="$t('Note')"></textarea>
			</label>
		</div>

		<div class="flex mt-4 justify-center gap-2">
			<button v-if="intent==='create'" @click="reset()" class="btn btn-outline border-none">{{ $t('Reset') }}</button>
			<button v-else-if="intent==='edit'" @click="cancel()" class="btn btn-outline border-none">{{ $t('Cancel') }}</button>
			<button v-if="intent==='create'" @click="submit()" class="btn btn-outline btn-success">{{$t('Create')}}</button>
			<button v-else-if="intent==='edit'" @click="update()" class="btn btn-outline btn-success">{{ $t('Update') }}</button>
		</div>

	</div>



</div>
</template>
