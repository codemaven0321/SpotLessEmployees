import type {Record, Customer} from '~/types/core';

const useCustomers = defineStore('customer', () => {

	// const {t} = useI18n();
	const tab = ref<'index'|'create'>('index');
	const edit_customer_id = ref(0);

	const index_date = ref<null|Date>(null);
	const index_status = ref('');
	const index_sort = ref('');
	const index_loading = ref(false);
	const customers = ref<Customer[]>([]);
	const today_customers_count = ref(0);

	function reset(){
		index_date.value = null;
		index_status.value = '';
		index_sort.value = '';
		index_loading.value = false;
		customers.value = [];
		today_customers_count.value = 0;
	}

	async function index(){
		index_loading.value = true;
		const api = useApi();

		const usp = new URLSearchParams();
		if(index_date.value) usp.append('date', dtf.searchDate(index_date.value.valueOf()));
		if(index_status.value) usp.append('status', index_status.value);
		if(index_sort.value) usp.append('sort', index_sort.value);
		const {data}: {data: Customer[]} =await api.get(`/admin/core/customers?${usp.toString()}`)

		// today customer count
		const today = dtf.searchDate(Date.now());
		const {data: data_today} =await api.get(`/admin/core/customers?date=${today}`);
		today_customers_count.value = data_today.length;

		customers.value = data;
		index_loading.value = false;
		return data;
	}


	return {
		tab, edit_customer_id, customers, index_date, index_status, index_sort, index_loading, today_customers_count, reset,
		index
	}
})

export default useCustomers;

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useCustomers, import.meta.hot))
