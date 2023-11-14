
class Password
{

	static special_chars: string = " !\"#$%&'()*+,-./:;<=>?@[\]^_`{|}~";


	static generate( length: number = 16, lowercase: boolean = true, uppercase: boolean = true, numbers: boolean = true, special_chars: boolean = true ): string
	{
		const rand = (min: number, max: number)=>min + Math.floor(Math.random() * (max - min + 1));
		if(length<1) throw ('Password length must be greater than 0');

		const combination = (lowercase?'l':'')+(uppercase?'u':'')+(numbers?'n':'')+(special_chars?'s':'');
		if(combination==='') throw 'Requires at least one character set';
		if(special_chars && this.special_chars==='') throw 'Requires at least one character from $special_chars';

		let password: string = '';
		for (let i=0; i < length; i++) {
			switch(combination[rand(0, combination.length-1)]){
				case 'l':
					password += 'abcdefghijklmnopqrstuvwxyz'[rand(0, 25)];
					break;
				case 'u':
					password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[rand(0, 25)];
					break;
				case 'n':
					password += '0123456789'[rand(0, 9)];
					break;
				case 's':
					password += this.special_chars[rand(0, this.special_chars.length-1)];
					break;
			}
		}
		return password;
	}

	static entropy(password: string): number
	{
		const regx_quote = (text: string) => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
		let char_size =
		(/[a-z]/.test(password)?26:0)+
		(/[A-Z]/.test(password)?26:0)+
		(/[0-9]/.test(password)?10:0)+
		((new RegExp(`[${regx_quote(this.special_chars)}]`).test(password))?this.special_chars.length:0)+
		(password.replace((new RegExp(`[a-zA-Z0-9${regx_quote(this.special_chars)}]`, 'g')), '').length);

		if(char_size>128) char_size = 128;

		let password_length = password.length;
		if(password_length>128)  password_length = 128;

		let entropy = Math.round(Math.log2(char_size**password_length));
		if(entropy===Infinity) return 1000;
		else if(entropy>0) return entropy;
		else return 0;
	}

}

export default Password
