const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const { CONNECTION_REQUEST, USER } = require("../constants/user");

const create = async (userData) => {
	return await User.create(userData);
};

const read = async (userId) => {
	return await User.findById(userId);
};

const update = async ({ id, ...updatedData }) => {
	return await User.findByIdAndUpdate(id, updatedData, {
		runValidators: true,
		new: true,
	});
};

const deleteUser = async (userId) => {
	return await User.findByIdAndDelete(userId);
};

const getRequests = async (userId) => {
	return await ConnectionRequest.find({
		to: userId,
		status: CONNECTION_REQUEST.PENDING,
	}).populate("from", USER.DATA_TO_BE_POPULATED);
};

const getConnections = async (userId) => {
	const connections = await ConnectionRequest.find({
		$or: [{ from: userId }, { to: userId }],
		status: CONNECTION_REQUEST.ACCEPTED,
	})
		.populate("from", USER.DATA_TO_BE_POPULATED)
		.populate("to", USER.DATA_TO_BE_POPULATED);

	return (connections ?? []).map((connection) => {
		if (connection.from.equals(userId)) {
			return connection.to;
		}
		return connection.from;
	});
};

const getFeed = async (userId, query) => {
	const connectionRequests = await ConnectionRequest.find({
		$or: [{ from: userId }, { to: userId }],
	}).select("from to");
	const skipCount = query.page
		? query.page > 0
			? (query.page - 1) * query.limit || 10
			: 0
		: 0;
	const hiddenFromFeed = new Set(
		connectionRequests
			.flatMap((req) => [req.from, req.to])
			.map((id) => id.toString()),
	);
	return await User.find({
		_id: { $nin: Array.from(hiddenFromFeed) },
	})
		.select("_id firstName lastName email")
		.limit(query.limit || 10)
		.skip(skipCount);
};

export {
	create,
	read,
	update,
	deleteUser,
	getRequests,
	getConnections,
	getFeed,
};
