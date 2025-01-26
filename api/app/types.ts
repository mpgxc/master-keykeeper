export type CustomField = {
	id: string;
	label: string;
	value: string;
};

export type Secret = {
	id: string;
	title: string;
	username: string;
	password: string;
	customFields?: CustomField[];
};
