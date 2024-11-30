import { useState } from 'react';
import './App.css'
import axios from 'axios';

function App() {
  // login data
  const [emailLogin, setEmailLogin] = useState('');
	const [passwordLogin, setPasswordLogin] = useState('');

  // register data
  const [emailRegister, setEmailRegister] = useState('');
	const [passwordRegister, setPasswordRegister] = useState('');

  axios.defaults.withCredentials = true; // On cookie and information about authentication sending

  // login request
  const handleLogin = (event) => {
    event.preventDefault();

    // do request and send data
    axios.post('http://localhost:3000/login', {
      email: emailLogin,
      password: passwordLogin,
    }).then((response) => {
      if (!response.data.success) {
        alert('Failed login...')
      } else {
        alert('Successful login!')
      }
    })
  }

  // register request
  const handleRegister = (event) => {
    event.preventDefault();

    // do request and send data
    axios.post('http://localhost:3000/register', {
      email: emailRegister,
      password: passwordRegister,
    }).then((response) => {
      if (!response.data.success) {
        alert(response.data.alertArr);
      } else {
        alert('Successful register!');
        console.log(response.data.arr);
      }
    }).catch((error) => {
      console.error("Error during register:", error);
      alert('Email exist! Register failed...');
    });
  }

  return (
    <>
      <form onSubmit={handleRegister}>
				<div>
					<label htmlFor='email'>Email:</label>
					<input autoComplete='true' onChange={(e) => setEmailRegister(e.target.value)} value={emailRegister} type='email' id='email' name='email' required />
				</div>
				<div>
					<label htmlFor='password'>Password:</label>
					<input autoComplete='true' onChange={(e) => setPasswordRegister(e.target.value)} value={passwordRegister} type='password' id='password' name='password' required />
				</div>
				<button type='submit'>Register</button>
			</form>
      <form onSubmit={handleLogin}>
				<div>
					<label htmlFor='emailLog'>Email:</label>
					<input autoComplete='true' onChange={(e) => setEmailLogin(e.target.value)} value={emailLogin} type='email' id='emailLog' name='emailLog' required />
				</div>
				<div>
					<label htmlFor='passwordLog'>Password:</label>
					<input autoComplete='true' onChange={(e) => setPasswordLogin(e.target.value)} value={passwordLogin} type='password' id='passwordLog' name='passwordLog' required />
				</div>
				<button type='submit'>Login</button>
			</form>
    </>
  )
}

export default App
