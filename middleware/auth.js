const { getUser } = require("../service/auth");

function checkForAuthentication(req, res, next) {
	const tokenCookie = req.cookies?.token;
	req.user = null;
	if (!tokenCookie) return next();

	const token = tokenCookie;
	const user = getUser(token);

	req.user = user;
	return next();
}

//ROLES - ADMIN, USER
function restrictTo(roles) {
	return function (req, res, next) {
		if (!req.user) return res.redirect("/login");

		if (!roles.includes(req.user.role)) return res.end("UnAuthorized");
		return next();
	};
}

//NO NEED FOR BELOW CODE AFTER WRITING ABOVE CODE
// async function restrictToLoggedinUserOnly(req, res, next) {
// 	const userUid = req.headers["Authorization"];

// 	if (!userUid) return res.redirect("/login");
// 	const token = userUid.split("Bearer")[1]; //"Bearer [321dse35g1c2xv]"
// 	const user = getUser(token);

// 	if (!user) return res.redirect("/login");

// 	req.user = user;
// 	next();
// }

// async function checkAuth(req, res, next) {
// 	// const userUid = req.cookies?.uid; //for cookies
// 	const userUid = req.headers["authorization"];
// 	const token = userUid.split("Bearer")[1];

// 	const user = getUser(token);

// 	req.user = user;
// 	next();
// }

module.exports = {
	checkForAuthentication,
	restrictTo,
};
