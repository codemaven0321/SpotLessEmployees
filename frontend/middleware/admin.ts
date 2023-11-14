import useUser from '~/store/user';

export default defineNuxtRouteMiddleware(async () => {
	const user = useUser();

	if(user.usertype!=='admin'){
		const {push} = useRouter();
		await push('/login');
	}
})
