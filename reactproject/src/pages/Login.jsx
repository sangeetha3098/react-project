import { useLocation, useNavigate } from 'react-router-dom';
import { loginUser, getCurrentUser, updateUser, getUsers } from '../utils/authStorage';
import { useState, useEffect } from 'react';
import { FiEye, FiEyeOff, FiBookOpen, FiCheckCircle } from 'react-icons/fi';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const adminExists = getUsers().some(u => u.role === 'Admin');
    if (!adminExists) {
      navigate('/admin-setup');
      return;
    }
    if (getCurrentUser()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const registered = location.state?.registered;
  const email = location.state?.email;

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  // Password Setup States
  const [needsSetup, setNeedsSetup] = useState(false);
  const [setupUser, setSetupUser] = useState(null);
  const [setupPassword, setSetupPassword] = useState('');
  const [setupConfirm, setSetupConfirm] = useState('');
  const [setupError, setSetupError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setSubmitError('');
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.email.trim()) {
      nextErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (!form.password && !needsSetup) {
      nextErrors.password = 'Password is required.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = loginUser(form.email.trim(), form.password);
    console.log("Login Result:", result);
    if (result.mustReset) {
      navigate("/reset-password", {
        state: {
          user: result.user,
        },
      });
      return;
    }

    if (!result.success) {
      setSubmitError(result.error);
      return;
    }
    navigate('/dashboard');
  };

  const handleSetupSubmit = (e) => {
    e.preventDefault();
    if (!setupPassword) {
      setSetupError('Password is required.');
      return;
    }
    if (setupPassword.length < 6) {
      setSetupError('Password must be at least 6 characters.');
      return;
    }
    if (setupPassword !== setupConfirm) {
      setSetupError('Passwords do not match.');
      return;
    }

    // Update password in local storage
    const updateResult = updateUser(setupUser.id, {
      password: setupPassword,
      mustResetPassword: false,
    });

    if (updateResult.success) {
      // Re-trigger login
      const loginResult = loginUser(setupUser.email, setupPassword);
      if (loginResult.success) {
        navigate('/dashboard');
      } else {
        setSetupError('Login failed after password setup. Please try again.');
      }
    } else {
      setSetupError(updateResult.error || 'Failed to set password.');
    }
  };

  return (
    <div className="auth-bg min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fade-in bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 sm:p-10">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30 mb-4">
            <FiBookOpen className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {needsSetup ? 'First-Time Password Setup' : 'Portal Sign In'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            GCET Training Institute Portal
          </p>
        </div>

        {registered && (
          <div className="mb-6 flex items-center gap-2 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
            <FiCheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Registration complete{email ? ` for ${email}` : ''}. You can now sign in.</span>
          </div>
        )}

        {!needsSetup ? (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Field
              label="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="e.g. admin@gcet.edu.in"
            />

            <Field
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="••••••••"
            />

            {submitError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-600">
                {submitError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform active:scale-98"
            >
              Sign In
            </button>
          </form>
        ) : (
          <form onSubmit={handleSetupSubmit} className="space-y-4" noValidate>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 font-medium">
              🔑 <strong>First Login Detected:</strong> Welcome, <strong>{setupUser?.fullName}</strong>! Your admin gave you a temporary password. Please set a new password before continuing.
            </div>

            <Field
              label="Create New Password"
              name="setupPassword"
              type="password"
              value={setupPassword}
              onChange={(e) => {
                setSetupPassword(e.target.value);
                setSetupError('');
              }}
              placeholder="Minimum 6 characters"
            />

            <Field
              label="Confirm New Password"
              name="setupConfirm"
              type="password"
              value={setupConfirm}
              onChange={(e) => {
                setSetupConfirm(e.target.value);
                setSetupError('');
              }}
              placeholder="Confirm password"
            />

            {setupError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-600">
                {setupError}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setNeedsSetup(false);
                  setSetupUser(null);
                  setSetupPassword('');
                  setSetupConfirm('');
                }}
                className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-md"
              >
                Save & Log In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const Field = ({ label, name, type = 'text', value, onChange, error, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-slate-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none transition-all ${error
            ? 'border-rose-400 focus:border-rose-500 ring-2 ring-rose-100'
            : 'border-slate-200 focus:border-indigo-600 ring-2 ring-transparent focus:ring-indigo-100'
            } ${isPassword ? 'pr-10' : ''}`}
        />
        {isPassword && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );
};

export default Login;
