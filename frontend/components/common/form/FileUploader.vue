<script setup lang="ts">
import useSetting from '~/store/setting';
import useUser from '~/store/user';
import Uppy from '@uppy/core';
import {Dashboard} from '@uppy/vue';
import Webcam from '@uppy/webcam';
import ImageEditor from '@uppy/image-editor'
import XHRUpload from '@uppy/xhr-upload';

type Layout = 'profile_img';

const props = defineProps<{
	layout: Layout,
	height?: string,
	uid?: string
}>();

const setting = useSetting();
const user = useUser();
const runtimeConfig = useRuntimeConfig();

type Config = {
	profile_img: {
		maxNumberOfFiles: number;
		allowedFileTypes?: null | string[];
		aspectRatio?: number;
		dimension?: {
			minWidth?: number;
			maxWidth?: number;
			minHeight?: number;
			maxHeight?: number;
		};
	};
};
const config: Config = {
	profile_img: {
		maxNumberOfFiles: 1,
		allowedFileTypes: ['.jpg', '.png', '.webp'],
		aspectRatio: 1,
		dimension: {
			minWidth: 512,
			minHeight: 512,
		}
	}
}

const uppy = computed(() =>{
	let endpoint = `${runtimeConfig.public.base.ApiMain}/file/${props.layout}`;
	if(props.uid) endpoint+='?uid='+props.uid;
	const u = new Uppy({
		id: props.layout,
		restrictions: {
			maxNumberOfFiles: config.profile_img.maxNumberOfFiles,
			allowedFileTypes: config.profile_img.allowedFileTypes
		}
	})
		.use(Webcam)
		.use(ImageEditor, {
			cropperOptions: {
				minCropBoxWidth: 64,
				minCropBoxHeight: 64,
				aspectRatio: config.profile_img.aspectRatio,
				viewMode: 1,
				dragMode: 'move',
				responsive: true,
				modal: false,
				toggleDragModeOnDblclick: false,
				croppedCanvasOptions: {}
			},
			actions: {
				revert: true,
				rotate: true,
				granularRotate: true,
				flip: true,
				zoomIn: true,
				zoomOut: true,
				cropSquare: false,
				cropWidescreen: false,
				cropWidescreenVertical: false,
			},
		})
		.use(XHRUpload, {
			endpoint,
			method: 'post',
			headers: {
				'User-Authorization': user.token ?? ''
			},
			formData: true,
		});

	u.setMeta({'category': props.layout});
	u.on('upload-error', (_file, _error, res) => {
		if(res?.body.error) u.info(`Error type: ${res?.body.error}`, 'error', 5000);
	})

	return u;
});

onUnmounted(()=>{
	uppy.value.close({reason: 'unmount'});
});

defineExpose({ uppy });
</script>

<template>
<ClientOnly>
	<Dashboard
		:uppy="uppy"
		:plugins="['Webcam', 'ImageEditor']"
		:props="{
			theme: setting.ui.colorMode.value==='dark' ? 'dark' : 'light',
			proudlyDisplayPoweredByUppy: false,
			width: '100%',
			height: props.height ?? '512px',
			showProgressDetails: true,
			inline: true
		}"
	/>
</ClientOnly>
</template>
