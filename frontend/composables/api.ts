import axios from 'axios';
import useUser from '~/store/user';

// eslint-disable-next-line import/prefer-default-export
export const useApi = () => {
	const config = useRuntimeConfig();
	const user = useUser();

	axios.defaults.baseURL = config.public.base.ApiMain;
	if(user.token) axios.defaults.headers.common['User-Authorization'] = user.token;

	return axios;
}

type Size = 128 | 256 | 768 | 1280 | 2048;
export function useFile(category: 'profile_img', filename?: null|string, size?: Size): string
{
	const user = useUser();
	let url='';
	

	if(filename){
		const config = useRuntimeConfig();
		url = config.public.base.ApiMain;
		const usp = new URLSearchParams();
		if(size) usp.append('size', `${size}`);
		usp.append('User-Authorization', user.token ?? '');
		usp.append('sellerMode', '1');

		url += `/file/${category}/${filename}?${usp}`;
	}
	else if(category==='profile_img'){
		url = '/file/default';
		if(size) url += `/${size}`;
		url += '/profile_img.png';
	}
	return url;
}
