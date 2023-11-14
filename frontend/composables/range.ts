// eslint-disable-next-line func-names
export default function(start: number, end: number): number[] {
	const years = [];
	if([Infinity, -Infinity].includes(start)===false && [Infinity, -Infinity].includes(end)===false){
		if(start<end){
			while(start<=end){
				years.push(start);
				// eslint-disable-next-line no-param-reassign
				start++;
			}
		}
		else if(start>end){
			while(start>=end){
				years.push(start);
				// eslint-disable-next-line no-param-reassign
				start--;
			}
		}
		else if(start===end){
			years.push(start);
		}
	}
	return years;
}
