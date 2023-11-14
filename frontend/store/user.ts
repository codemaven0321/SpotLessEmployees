const useUser = defineStore('user', () => {
	const uid = ref('');
	const username = ref('');
	const token = ref<string>();
	const usertype = ref<'guest'|'admin'|'employee'>('guest');
	const profile_img = ref('');

	function $reset() {
		uid.value = '';
		token.value = undefined;
		username.value = '';
		usertype.value = 'guest';
		profile_img.value = '';
	}

	async function getProfile(){
		const api = useApi();
		const { data } = await api('/users/profile');
		username.value = data.username;
		profile_img.value = data.profile_img;
		return data;
	}

	return {
		uid, token, usertype, username, profile_img,
		$reset, getProfile
	};
})

export default useUser;

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useUser, import.meta.hot))
