function username( username: string): boolean
{
	if(username.length>1) return !(/([ \'"<>&@|=()]+)/).test(username);
	return false;
}

function email( email: string ): boolean
{
	if((/((.+)(@)(.+)(\.)(.+))/).test(email)){  // true -  it is an email
		return !(/([ \'"<>&]+)/).test(email);
	}
	return false;
}

export default {username, email};
