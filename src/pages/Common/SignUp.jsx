import React, { useState } from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../../../firebase'; // Make sure this path is correct

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const credential = isLogin
        ? await signInWithEmailAndPassword(auth, email, password)
        : await createUserWithEmailAndPassword(auth, email, password);

      const idToken = await credential.user.getIdToken();

      // Send token to Spring Boot backend
      const res = await fetch('http://localhost:8080/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      if (res.ok) {
        alert(isLogin ? 'Login successful!' : 'Signup successful!');
      } else {
        throw new Error('Failed to verify token on backend');
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button onClick={handleAuth} disabled={loading} style={styles.button}>
        {loading ? 'Loading...' : isLogin ? 'Login' : 'Sign Up'}
      </button>

      <p style={{ marginTop: '10px' }}>
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        &nbsp;
        <span
          onClick={() => setIsLogin(!isLogin)}
          style={{ color: 'blue', cursor: 'pointer' }}
        >
          {isLogin ? 'Sign Up' : 'Log In'}
        </span>
      </p>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '300px',
    margin: '50px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontFamily: 'Arial',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default SignUp;