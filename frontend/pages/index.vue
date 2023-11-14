<script setup lang="ts">
import useUser from '~/store/user';
const user = useUser();

if(user.usertype==='guest') await navigateTo('/login');
else if(user.usertype==='admin') await navigateTo('/employees');
else if(user.usertype==='employee') await navigateTo('/records');
</script>

<template>
<div>
	
</div>
</template>
