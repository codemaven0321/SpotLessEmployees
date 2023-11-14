import { format} from 'date-fns';

// dtf means datetime format
function dtf(datetime: number|string|Date, {date=true, time=true}={}): string {
	const finalDatetime = typeof datetime==='string' ? new Date(datetime) : datetime;
	return format(finalDatetime, 'MMM-dd-yyyy');
}

dtf.searchDate = function(datetime: number|string|Date, {date=true, time=true}={}): string {
	const finalDatetime = typeof datetime==='string' ? new Date(datetime) : datetime;
	return format(finalDatetime, 'yyyy-MM-dd');
}

export default dtf;
