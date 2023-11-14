<script setup lang="ts">
import Index from '~/components/core/customers/index.vue';
import Add from '~/components/core/customers/upsert.vue';
import useCustomers from '~/store/customers';

definePageMeta({
	middleware: 'admin'
});

const customers = useCustomers();
</script>

<template>
<div class="mx-2">
	<Title>{{ $t('Customers') }}</Title>


	<div class="tabs tabs-boxed my-2">
		<button class="tab" :class="{'tab-active': customers.tab==='index'}"  @click="customers.tab='index'"    >{{$t('Customers')}}</button> 
		<button class="tab" :class="{'tab-active': customers.tab==='create'}" @click="customers.tab='create'; customers.edit_customer_id=0" >{{ $t('Add Customer') }}</button> 
	</div>

	<Index v-if="customers.tab==='index'" />
	<Add   v-if="customers.tab==='create'" intent="create" />



</div>
</template>
