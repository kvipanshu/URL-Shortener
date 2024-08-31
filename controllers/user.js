const { v4: uuidv4 } = require("uuid");
const User = require("../models/user");
const { setUser } = require("../service/auth");

async function handleUserSignup(req, res) {
	const { name, email, password } = req.body;
	await User.create({
		name,
		email,
		password,
	});
	return res.redirect("/");
}

async function handleUserLogin(req, res) {
	const { email, password } = req.body;
	const user = await User.findOne({ email, password });

	if (!user)
		return res.render("login", {
			error: "Invalid Username or Password",
		});

	// FOR STATEFULL
	// const sessionId = uuidv4();
	// setUser(sessionId, user);
	// res.cookie("uid", sessionId);
	// return res.redirect("/");

	//FOR STATELESS
	const token = setUser(user);
	res.cookie("token", token);
	return res.redirect("/");
}

async function handleUserLogout(req, res) {
	req.session.destroy((err) => {
		if (err) {
			// Handle session destruction error
			return res.status(500).render("error", {
				error: "Could not log out. Please try again later.",
			});
		}
		res.redirect("/");
	});
}

module.exports = {
	handleUserSignup,
	handleUserLogin,
	handleUserLogout,
};
