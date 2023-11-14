<script setup lang="ts">
import useCustomers from '~/store/customers';
import useSetting from '~/store/setting';

const customers = useCustomers();
const setting = useSetting();
const api = useApi();
const {t} = useI18n();

const props = defineProps<{
	intent: 'create'|'edit'
}>();

const name = ref('');
const address = ref('');
const phone = ref('');
const note = ref('');
const status = ref('pending');
const date = ref(new Date());

function reset(){
	name.value = '';
	address.value = '';
	note.value = '';
	date.value = new Date();
}

async function submit(){
	await api.post('/admin/core/customers', {
		"name": name.value,
		"address": address.value,
		"phone": phone.value,
		"date": date.value.valueOf(),
		"status": status.value,
		"note": note.value,
	});
	await customers.index();
	notify.success(t('Record has been added.'));
	customers.tab = 'index';
}

async function update(){
	await api.post(`/admin/core/customers/update/${customers.edit_customer_id}`, {
		"name": name.value,
		"address": address.value,
		"phone": phone.value,
		"date": date.value.valueOf(),
		"status": status.value,
		"note": note.value,
	})
	await customers.index();
	notify.success(t('Record has been updated.'));
	reset();
	customers.edit_customer_id = 0;
}

async function cancel(){
	reset();
	customers.edit_customer_id = 0;
}
watch(()=>customers.edit_customer_id, async ()=>{
	if(customers.edit_customer_id>0){
		const {data} = await api.get(`/admin/core/customers/${customers.edit_customer_id}`);
		name.value = data.name;
		address.value = data.address;
		phone.value = data.phone;
		date.value = new Date(data.date);
		status.value = data.status;
		note.value = data.note;
	}
})
</script>

<template>
<div>

	<div class="my-4">
		<div class="flex flex-col gap-6">
			<template v-if="intent==='edit'">
				<h1 class="text-2xl text-center">{{$t('Edit Customer')}}</h1>
				<p>Id: {{customers.edit_customer_id}}</p>
			</template>
			<label class="grid grid-cols-1 md:grid-cols-[9rem_1fr] gap-x-4">
				<span>{{ $t('Name') }}: </span>
				<input type="text" v-model="name" :placeholder="$t('Name')" class="input input-bordered" />
			</label>
			<label class="grid grid-cols-1 md:grid-cols-[9rem_1fr] gap-x-4">
				<span>{{ $t('Address') }}: </span>
				<input type="text" v-model="address" :placeholder="$t('Address')" class="input input-bordered" />
			</label>
			<label class="grid grid-cols-1 md:grid-cols-[9rem_1fr] gap-x-4">
				<span>{{$t('Phone')}}: </span>
				<input type="text" v-model="phone" :placeholder="$t('Phone')" class="input input-bordered" />
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
				<span>{{ $t('Status') }}: </span>
				<div class="tabs">
					<button @click="status='pending'"     :class="{'tab-active' : status==='pending'}"     class="tab tab-bordered">{{$t('Pending')}}</button> 
					<button @click="status='price given'" :class="{'tab-active' : status==='price given'}" class="tab tab-bordered">{{$t('Price given')}}</button> 
					<button @click="status='accepted'"    :class="{'tab-active' : status==='accepted'}"    class="tab tab-bordered">{{$t('Accepted')}}</button>
					<button @click="status='rejected'"    :class="{'tab-active' : status==='rejected'}"    class="tab tab-bordered">{{$t('Rejected')}}</button>
					<button @click="status='completed'"   :class="{'tab-active' : status==='completed'}"   class="tab tab-bordered">{{$t('Completed')}}</button>
				</div>
			</label>
			<label class="grid grid-cols-1 md:grid-cols-[9rem_1fr] gap-x-4">
				<span>{{ $t('Note') }}: </span>
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
