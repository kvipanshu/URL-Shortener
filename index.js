const express = require("express");
const app = express();
const PORT = 8001;

const { connectToMongoDB } = require("./connect");
const URL = require("./models/url");
const path = require("path");
const cookieParser = require("cookie-parser");
const { restrictToLoggedinUserOnly, checkAuth } = require("./middleware/auth");

//Routes
const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");

connectToMongoDB("mongodb://localhost:27017/short-url").then(() =>
	console.log("MongoDB Connected")
);

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/test", async (req, res) => {
	const allUrls = await URL.find({});
	return res.render("home", {
		urls: allUrls,
	});
});

app.use("/url", restrictToLoggedinUserOnly, urlRoute);
app.use("/user", userRoute);
app.use("/", checkAuth, staticRoute);

app.get("/url/:shortId", async (req, res) => {
	const shortId = req.params.shortId;
	const entry = await URL.findOneAndUpdate(
		{
			shortId,
		},
		{
			$push: {
				visitHistory: {
					timestamp: Date.now(),
				},
			},
		}
	);
	res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server Started at PORT: ${PORT}`));
