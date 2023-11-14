<script lang="ts" setup>
import Index from '~/components/core/employees/index.vue';
import Create from '~/components/core/employees/create.vue';

definePageMeta({
	middleware: 'admin'
});

const tab = ref<'index'|'create'>('index');
</script>

<template>
<div class="mx-2 my-8">
	<Title>{{ $t('Employees') }}</Title>

	<div class="tabs tabs-boxed my-2">
		<button class="tab" :class="{'tab-active': tab==='index'}"  @click="tab='index'"  >{{ $t('Employees') }}</button> 
		<button class="tab" :class="{'tab-active': tab==='create'}" @click="tab='create'" >{{$t('Add Employee')}}</button> 
	</div>

	<Index v-if="tab==='index'" />
	<Create v-if="tab==='create'" @tab="v=>{tab=v}" />



</div>
</template>
