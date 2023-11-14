import useUser from '~/store/user';

export default defineNuxtRouteMiddleware(async () => {
	const user = useUser();
	const ult = useCookie('ult', { maxAge: 34560000 }); // 400 days
	const token = ult.value ?? user.token;

	if(token){
		user.$patch({token});
		const api = useApi();
		const { data } = await api({url: '/users/authentication', headers: {'User-Authorization': token}});

		if(data){
			ult.value = token;
			user.$patch({
				uid : data.uid,
				usertype: data.usertype
			});
			if(!user.username){
				await user.getProfile();
			}
		}
		else{
			ult.value = undefined;
			user.$reset()
		}
	} else {
		user.$reset();
	}
})
