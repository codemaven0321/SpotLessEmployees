interface Record {
	id: string
	employee_id: string
	customer_id: number
	address: string
	date: string
	worked_hour: number
	hourly_wage: number
	is_paid: boolean
	note: string
	created_at: string
	updated_at: string
}

interface Customer {
	id: number
	name: string
	address: string
	date: string
	note: string
	phone: string
	status: string
	created_at: string
	updated_at: string
	records?: {
		name: string
		profile_img?: string
		worked_hour: number
		hourly_wage: number
		is_paid: boolean
	}[]
}

interface User {
	id: string
	username: string
	usertype: 'admin'|'employee'
	name: string
	profile_img: string
	created_at: string
	updated_at: string
}

export {User, Record, Customer};
