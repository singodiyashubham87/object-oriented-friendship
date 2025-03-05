import bcrypt from "bcrypt";
import validator from "validator";

const validateForCreate = async (user) => {
	const allowedEditFields = [
		"firstName",
		"lastName",
		"email",
		"password",
		"age",
		"gender",
		"phoneNumber",
		"avatar",
		"skills",
	];
	const validatedData = {};

	for (const field of Object.keys(user)) {
		if (!allowedEditFields.includes(field)) {
			throw new Error(`Invalid field: ${field}`);
		}
	}

	if (!user.firstName) {
		throw new Error("Please provide your first name");
	}
	validatedData.firstName = user.firstName;

	if (!user.lastName) {
		throw new Error("Please provide your last name");
	}
	validatedData.lastName = user.lastName;

	if (!user.email) {
		throw new Error("Please provide your email");
	}
	if (!validator.isEmail(user.email)) {
		throw new Error("Invalid email format");
	}
	validatedData.email = user.email;

	if (!user.password) {
		throw new Error("Please provide a password");
	}
	if (!validator.isStrongPassword(user.password)) {
		throw new Error("Password must be strong");
	}
	validatedData.password = bcrypt.hashSync(user.password, 10);

	if (user.age !== undefined) {
		const age = Number.parseInt(user.age, 10);
		if (Number.isNaN(age) || age < 18 || age > 99) {
			throw new Error("Age must be between 18 and 99");
		}
		validatedData.age = age;
	}

	if (user.gender) {
		if (!["male", "female", "other"].includes(user.gender)) {
			throw new Error(`${user.gender} is not a valid gender`);
		}
		validatedData.gender = user.gender;
	}

	if (user.phoneNumber) {
		if (!validator.isMobilePhone(user.phoneNumber, "en-IN")) {
			throw new Error("Invalid phone number format");
		}
		validatedData.phoneNumber = user.phoneNumber;
	}

	if (user.avatar) {
		if (typeof user.avatar !== "string") {
			throw new Error("Avatar URL must be a string");
		}
		validatedData.avatar = user.avatar;
	}

	if (user.skills) {
		if (
			!Array.isArray(user.skills) ||
			!user.skills.every((skill) => typeof skill === "string")
		) {
			throw new Error("Skills must be an array of strings");
		}
		validatedData.skills = user.skills;
	}

	return validatedData;
};

const validateForUpdate = (newData) => {
	const allowedEditFields = [
		"id",
		"firstName",
		"lastName",
		"age",
		"gender",
		"phoneNumber",
		"avatar",
		"skills",
	];
	const validatedData = {};

	for (const field of Object.keys(newData)) {
		if (!allowedEditFields.includes(field)) {
			throw new Error(`Invalid field: ${field}`);
		}
	}

	if (!validator.isMongoId(newData.id)) {
		throw new Error("Invalid user ID");
	}

	if (newData.firstName) {
		if (typeof newData.firstName !== "string") {
			throw new Error("First name must be a string");
		}
		validatedData.firstName = newData.firstName;
	}

	if (newData.lastName) {
		if (typeof newData.lastName !== "string") {
			throw new Error("Last name must be a string");
		}
		validatedData.lastName = newData.lastName;
	}

	if (newData.age) {
		const age = Number.parseInt(newData.age, 10);
		if (Number.isNaN(age) || age < 18 || age > 99) {
			throw new Error("Age must be between 18 and 99");
		}
		validatedData.age = age;
	}

	if (newData.gender) {
		if (!["male", "female", "other"].includes(newData.gender)) {
			throw new Error(`${newData.gender} is not a valid gender`);
		}
		validatedData.gender = newData.gender;
	}

	if (newData.phoneNumber) {
		if (!validator.isMobilePhone(newData.phoneNumber, "en-IN")) {
			throw new Error("Invalid new phone number format");
		}
		validatedData.phoneNumber = newData.phoneNumber;
	}

	if (newData.avatar) {
		if (typeof newData.avatar !== "string") {
			throw new Error("Avatar URL must be a string");
		}
		validatedData.avatar = newData.avatar;
	}

	if (newData.skills) {
		if (
			!Array.isArray(newData.skills) ||
			!newData.skills.every((skill) => typeof skill === "string")
		) {
			throw new Error("Skills must be an array of strings");
		}
		validatedData.skills = newData.skills;
	}

	if (!Object.values(validatedData).length) {
		throw new Error("No data to update");
	}

	return validatedData;
};

const validateForLogin = (user) => {
	if (!user.email) {
		throw new Error("Please provide your email");
	}
	if (!validator.isEmail(user.email)) {
		throw new Error("Invalid email format");
	}

	if (!user.password) {
		throw new Error("Please provide a password");
	}

	return {
		email: user.email,
		password: user.password,
	};
};

const validateForFeedQuery = (query) => {
	const validatedQuery = {};

	if (query.page) {
		const page = Number.parseInt(query.page, 10);
		if (Number.isNaN(page) || page < 0) {
			throw new Error("Page number must be a positive integer");
		}
		validatedQuery.page = page;
	}

	if (query.limit) {
		const limit = Number.parseInt(query.limit, 10);
		if (Number.isNaN(limit) || limit <= 0 || limit > 20) {
			throw new Error("Limit must be a positive integer between 1 and 100");
		}
		validatedQuery.limit = limit;
	}

	return validatedQuery;
};

export {
	validateForCreate,
	validateForUpdate,
	validateForLogin,
	validateForFeedQuery,
};
