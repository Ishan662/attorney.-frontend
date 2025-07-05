// import React, { useState } from 'react';
// // Import our new service functions!
// import { signupWithEmail, loginWithEmail, loginWithGoogle } from '../../services/authService'; // Adjust path

// const SignUp = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [isLogin, setIsLogin] = useState(true); // Default to login screen
//   const [loading, setLoading] = useState(false);

//   const handleAuth = async (e) => {
//     e.preventDefault(); // Use form submission for better accessibility
//     if (!email || !password) {
//       setError('Please enter both email and password');
//       return;
//     }
//     setLoading(true);
//     setError('');

//     try {
//       const authFunction = isLogin ? loginWithEmail : signupWithEmail;
//       const user = await authFunction(email, password);

//       alert(`Success! Welcome, ${user.fullName}`);
//       // Redirect to the main application dashboard after successful login
//       window.location.href = '/dashboard'; 
//     } catch (err) {
//       // Firebase provides user-friendly error messages
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleAuth = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const user = await loginWithGoogle();
//       alert(`Success! Welcome, ${user.fullName}`);
//       window.location.href = '/dashboard';
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
//       <form onSubmit={handleAuth}>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           style={styles.input}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           style={styles.input}
//           required
//         />
//         {error && <p style={{ color: 'red' }}>{error}</p>}
//         <button type="submit" disabled={loading} style={styles.button}>
//           {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
//         </button>
//       </form>

//       <div style={{ margin: '10px 0', color: '#888' }}>OR</div>

//       <button onClick={handleGoogleAuth} disabled={loading} style={styles.googleButton}>
//         {loading ? '...' : 'Sign In with Google'}
//       </button>

//       <p style={{ marginTop: '20px' }}>
//         {isLogin ? "Don't have an account?" : 'Already have an account?'}
//          
//         <span
//           onClick={() => setIsLogin(!isLogin)}
//           style={{ color: 'blue', cursor: 'pointer' }}
//         >
//           {isLogin ? 'Sign Up' : 'Log In'}
//         </span>
//       </p>
//     </div>
//   );
// };

// // ... (your existing styles object)
// const styles = {
//   // ... container, input, button ...
//   googleButton: { // Added style for Google button
//     width: '100%',
//     padding: '10px',
//     backgroundColor: '#4285F4',
//     color: 'white',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'pointer',
//     marginTop: '10px'
//   },
// };

// export default SignUp;