import express from 'express';
import cors from 'cors';
const app = express();
const port = 3000;

app.use(
	cors({
		origin: 'http://localhost:5173', // set main page for requests
		credentials: true,
	}),
);
app.use(express.json());

// initial array of users with their data
const users = [
	{
		email: 'alexander.kuznecov16@gmail.com',
		password: 'pass1',
	},
	{
		email: 'user2@gmail.com',
		password: 'pass2',
	},
	{
		email: 'qwerty@gmail.com',
		password: 'qwerty12345',
	},
];

// login request
app.post('/login', (req, res) => {
	const {email, password} = req.body; // get values from user inputs

	const user = users.find(us => us.email === email && us.password === password); // boolean - if user with entered email and password exist

	if (!user) {
		res.status(401).json({message: 'Invalid data', success: false});
	} else {
		res.status(200).json({message: 'Login successful', success: true});
	}
});

// register request
app.post('/register', (req, res) => {
	const {email, password} = req.body; // get values from user inputs

	const user = users.find(us => us.email === email); // boolean - if user with entered email exist

	if (!user) {
		// add new item to the users (register imitation)
		users.push({
			email: email,
			password: password,
		});
		res.status(200).json({message: 'Successful register', success: true, arr: users});
	} else {
		res.status(401).json({message: 'Failed register', success: false, alertMessage: 'Email exist'});
	}
});

app.listen(port, () => {
	console.log(`Login app listening on port ${port}`);
});
