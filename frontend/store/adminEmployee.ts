import type {Record, User} from '~/types/core';

const adminEmployee = defineStore('adminEmployee', () => {

	const employee_id = ref('');
	const tab = ref<'records'|'add_record'|'stats'|'profile'>('records');
	const edit_record_id = ref('');
	const records = ref<Record[]>([]);
	const employee = ref<Partial<User>>({
		id: '',
		name: '',
		username: '',
		profile_img: ''
	});

	const records_date = ref<null|Date>(null);
	const records_sort = ref('');
	const records_loading = ref(false);

	function reset(){
		employee_id.value = '';
		edit_record_id.value = '';
		records.value = [];
		employee.value = {
			id: '',
			name: '',
			username: '',
			profile_img: ''
		}
	}

	async function getRecords(){
		records_loading.value = true;
		const api = useApi();

		const usp = new URLSearchParams();
		if(records_date.value) usp.append('date', dtf.searchDate(records_date.value.valueOf()));
		if(records_sort.value) usp.append('sort', records_sort.value);
		const {data} = await api.get(`/admin/core/records/${employee_id.value}?${usp.toString()}`);

		records.value = data;
		records_loading.value = false;
	}

	async function getEmployeeProfile(){
		const api = useApi();
		const {data} = await api.get(`/admin/core/employees/${employee_id.value}`);
		employee.value = {
			id: data.id,
			name: data.name,
			username: data.username,
			profile_img: data.profile_img
		}
		return data;
	}

	return {
		tab, employee_id, records, edit_record_id, employee, records_date, records_sort, records_loading, reset,
		getRecords, getEmployeeProfile
	}
})

export default adminEmployee;

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(adminEmployee, import.meta.hot))
