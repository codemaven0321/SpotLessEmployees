<script setup lang="ts">
import useSetting from '~/store/setting';
import useUser from '~/store/user';

const s = useSetting();
const user = useUser();
</script>

<template>
<section class="top-0 bg-base-200 rounded-b-lg shadow-lg shadow-white dark:shadow-xl dark:shadow-black/30">
	<div class="transition-all duration-500 shadow-lg rounded-b-lg flex flex-col sm:flex-row justify-between">
		<div class="flex items-center gap-x-8 px-4 justify-between">
			<NuxtLink to="/">
				<img class="h-20 py-2 hidden dark:block" src="/logo.png"   />
				<img class="h-20 py-2 block dark:hidden rounded-xl" src="/logo-light.jpg"   />
			</NuxtLink>
			<button type="button" class="flex items-center justify-center gap-x-1 rounded-sm border-r-4 border-transparent hover:border-primary " @click="s.changeColor()">
				<div class="text-xl swap swap-rotate" :class="{'swap-active': s.ui.colorMode.value==='dark'}">
					<Icon name="ph-moon" class="swap-on" />
					<Icon name="ph-sun"  class="swap-off" />
				</div>
				<p class="capitalize -mt-0.5">{{$t(s.ui.colorMode.value)}}</p>
			</button>
		</div>
		<div class="flex items-center gap-2 flex-wrap justify-center sm:justify-end mb-2">
			<template v-if="user.usertype==='admin'">
				<NuxtLink to="/" class="flex btn btn-ghost btn-sm avatar" :class="{'btn-active': ['employees', 'employees-id'].includes($route.name as string)}">
					<Icon name="clarity:employee-group-solid" class="mt-0.5" /> {{$t('Employees')}}
				</NuxtLink>
				<NuxtLink to="/customers" class="flex btn btn-sm btn-ghost avatar" :class="{'btn-active': ['customers'].includes($route.name as string)}">
					<Icon name="material-symbols:clean-hands-outline" class="mt-0.5" /> {{$t('Customers')}}
				</NuxtLink>
			</template>
			<template v-if="user.usertype==='employee'">
				<NuxtLink to="/records" class="flex btn btn-sm btn-ghost avatar" :class="{'btn-active': ['records'].includes($route.name as string)}">
					<Icon name="medical-icon:i-medical-records" class="mt-0.5" /> {{ $t('Records') }}
				</NuxtLink>
			</template>
			<div class="dropdown dropdown-hover dropdown-end pe-3">
				<label tabindex="0" class="">
					<img :src="useFile('profile_img', user.profile_img, 128)" class="w-12 h-12 rounded-full" />
				</label>
				<ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
					<li>
						<NuxtLink to="/setting" class="" :class="{'btn-active': ['setting'].includes($route.name as string)}">
							<Icon name="material-symbols:settings-outline-rounded" class="mt-0.5" /> {{ $t('Setting') }}
						</NuxtLink>
					</li>
					<li>
						<NuxtLink to="/logout" class="">
							<Icon name="cil:account-logout" class="mt-0.5" /> {{$t('Logout')}}
						</NuxtLink>
					</li>
				</ul>
			</div>
		</div>
	</div>
</section>
</template>

<style>
@media (max-width: 639px) {
	.nv-main {
		grid-template-areas:
		"start end"
		"mid mid"
		;
	}
	.nv-start {
		grid-area: start;
	}
	.nv-mid {
		grid-area: mid;
		justify-self: center;
		width: 100%;
	}
	.nv-end {
		grid-area: end;
		justify-self: end;
	}
}
</style>

