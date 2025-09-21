import React, { useState, FormEvent, useEffect } from 'react';
import { auth, db } from './firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useTheme } from '../hooks/useTheme';
import { useNavigate } from 'react-router-dom';

interface UserData {
  email: string;
  createdAt: string;
  lastLogin: string;
}

const SharedAuth: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [redirected, setRedirected] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { theme } = useTheme();
  const navigate = useNavigate();

  // Helper: fetch or create Firestore user
  const fetchOrCreateUser = async (user: User): Promise<UserData> => {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      const newUser: UserData = {
        email: user.email!,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
      await setDoc(userRef, newUser);
      return newUser;
    }

    const userData = userDoc.data() as UserData;
    await setDoc(userRef, { ...userData, lastLogin: new Date().toISOString() });
    return userData;
  };

  // Auth State & Redirect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user && !redirected) {
        try {
          await fetchOrCreateUser(user);
          setRedirected(true);
          navigate('/dashboard');
        } catch (err) {
          console.error('Error fetching user:', err);
          setError('Failed to fetch account info. Please try again.');
        }
      }
      setInitialLoading(false);
    });

    return () => unsubscribe();
  }, [navigate, redirected]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      let user: User;

      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
      }

      await fetchOrCreateUser(user);

      // Final redirect
      navigate('/dashboard');
    } catch (err: any) {
      setLoading(false);
      switch (err.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          setError('Invalid email or password.');
          break;
        case 'auth/email-already-in-use':
          setError('This email is already registered. Try logging in instead.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/weak-password':
          setError('Password is too weak. Please choose a stronger password.');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Try again later.');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Please check your internet connection.');
          break;
        default:
          console.error('Firebase Auth Error:', err);
          setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-colors ${
        theme === 'dark'
          ? 'bg-gray-900 text-white'
          : 'bg-gradient-to-br from-indigo-50 via-white to-cyan-50 text-gray-900'
      }`}
    >
      <div
        className={`p-8 rounded-3xl shadow-2xl w-full max-w-md transition-colors border ${
          theme === 'dark'
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white/80 backdrop-blur-sm border-white/20'
        }`}
      >
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
            {isLogin ? 'Sign in to your account' : 'Join today'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={`w-full px-4 py-4 border rounded-xl focus:outline-none ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-200 text-black'
            }`}
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`w-full px-4 py-4 border rounded-xl focus:outline-none ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-200 text-black'
              }`}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-400"
            >
              {showPassword ? '👁️' : '🙈'}
            </span>
          </div>

          {!isLogin && (
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`w-full px-4 py-4 border rounded-xl focus:outline-none ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-200 text-black'
                }`}
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-400"
              >
                {showConfirmPassword ? '👁️' : '🙈'}
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full font-bold py-4 rounded-xl text-white transition bg-blue-500 hover:bg-blue-600"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
            {isLogin ? 'New here?' : 'Already have an account?'}
            <span
              onClick={() => setIsLogin(!isLogin)}
              className="text-indigo-500 font-semibold ml-1 cursor-pointer hover:text-indigo-700"
            >
              {isLogin ? 'Create an account' : 'Sign in instead'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SharedAuth;
