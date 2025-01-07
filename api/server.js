import express from 'express';
import mysql from 'mysql2';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const port = 3000;

const secretKey = process.env.JWT_SECRET_KEY;

app.use(
	cors({
		origin: 'http://localhost:5173', // set main page for requests
		credentials: true,
	}),
);
app.use(express.json());

const db = mysql.createConnection({
	host: 'localhost',
	user: 'admin',
	password: 'sho0O-a+z1#Lpd(./y%f',
	database: 'Todo',
});

// login request
app.post('/login', (req, res) => {
	const {email, password} = req.body; // get values from user inputs

	const query = 'SELECT * FROM users WHERE email = ? AND password = ?';

	db.query(query, [email, password], (err, results) => {
		if (err) {
			console.error('Error checking login data: ', err);
			return res.status(500).json({message: 'Server error', success: false});
		}

		if (results.length === 0) {
			res.status(401).json({message: 'Invalid data', success: false});
		} else {
			// jwt token sign
			const token = jwt.sign({email: results[0].email, id: results[0].id}, secretKey, {expiresIn: '1h'} /* After 1 hour token will be disabled */);
			res.status(200).json({message: 'Login successful', success: true, token});
		}
	});
});

// JWT checking
const authenticateJWT = (req, res, next) => {
	const authHeader = req.headers.authorization;

	// Выводим заголовок Authorization в консоль для отладки
	console.log('Authorization Header:', authHeader);
	const token = req.headers.authorization?.split(' ')[1];

	if (!token) {
		return res.status(401).json({message: 'Authorization is required!', success: false});
	}

	jwt.verify(token, secretKey, (err, user) => {
		if (err) {
			return res.status(403).json({message: 'Invalid token', success: false});
		}

		req.user = user;
		next();
	});
};

// protected way
app.get('/protected', authenticateJWT, (req, res) => {
	res.status(200).json({message: 'Access granted', user: req.user});
});

// register request
app.post('/register', (req, res) => {
	const {email, password} = req.body; // get values from user inputs

	// Check if the user with the same email already exists
	const checkQuery = 'SELECT * FROM users WHERE email = ?';
	db.query(checkQuery, [email], (err, results) => {
		if (err) {
			console.error('Error checking if user exists: ', err);
			return res.status(500).json({message: 'Server error', success: false});
		}

		if (results.length > 0) {
			return res.status(401).json({message: 'Email already exists', success: false});
		}

		// Insert new user into the database
		const insertQuery = 'INSERT INTO users (email, password) VALUES (?, ?)';
		db.query(insertQuery, [email, password], (err, result) => {
			if (err) {
				console.error('Error inserting new user: ', err);
				return res.status(500).json({message: 'Server error', success: false});
			}

			const token = jwt.sign({email, id: result.insertId}, secretKey, {expiresIn: '1h'});

			res.status(200).json({message: 'Registration successful', success: true, token});
		});
	});
});

// get all tasks
app.get('/tasks', authenticateJWT, (req, res) => {
	const {email} = req.user; // Get email from JWT

	// 1. Get user_id by email from users table
	const userQuery = 'SELECT id FROM users WHERE email = ?';

	db.query(userQuery, [email], (err, results) => {
		if (err) {
			console.error('user_id error: ', err);
			return res.status(500).json({message: 'Server error', success: false});
		}

		if (results.length === 0) {
			return res.status(404).json({message: 'User not found', success: false});
		}

		const userId = results[0].id; // Get user_id from results
		console.log(`User ID: ${userId}`); // Debugging output

		// 2. Get user tasks by user_id from tasks table
		const tasksQuery = 'SELECT title, description FROM tasks WHERE user_id = ?';

		db.query(tasksQuery, [userId], (err, tasks) => {
			if (err) {
				console.error('Get tasks error: ', err);
				return res.status(500).json({message: 'Server error', success: false});
			}

			console.log('Tasks:', tasks); // Debugging output

			if (tasks.length === 0) {
				return res.status(404).json({message: 'No tasks found', success: false});
			}

			// Return tasks if found
			res.status(200).json({message: 'Tasks fetched successfully', success: true, tasks});
		});
	});
});

// Add new task
app.post('/add-tasks', authenticateJWT, (req, res) => {
	const {email} = req.user; // Get email from JWT
	const {title, description} = req.body; // Get task data from request body

	// 1. Get user_id by email from users table
	const userQuery = 'SELECT id FROM users WHERE email = ?';

	db.query(userQuery, [email], (err, results) => {
		if (err) {
			console.error('user_id error: ', err);
			return res.status(500).json({message: 'Server error', success: false});
		}

		if (results.length === 0) {
			return res.status(404).json({message: 'User not found', success: false});
		}

		const userId = results[0].id; // Get user_id from results

		// 2. Insert new task into tasks table
		const tasksQuery = 'INSERT INTO tasks (user_id, title, description) VALUES (?, ?, ?);';

		db.query(tasksQuery, [userId, title, description], (err, result) => {
			if (err) {
				console.error('Insert task error: ', err);
				return res.status(500).json({message: 'Server error', success: false});
			}

			// Return success response after inserting task
			res.status(200).json({
				message: 'Task added successfully',
				success: true,
				taskId: result.insertId, // Return the ID of the inserted task
			});
		});
	});
});

app.listen(port, () => {
	console.log(`Login app listening on port ${port}`);
});

// vercel
export default (req, res) => {
	app(req, res);
};
