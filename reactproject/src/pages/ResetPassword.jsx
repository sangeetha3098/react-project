import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { updateUser, loginUser } from "../utils/authStorage";
import { FiEye, FiEyeOff, FiLock } from 'react-icons/fi';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = location.state?.user;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  if (!user) {
    return (
      <div className="auth-bg min-h-screen flex items-center justify-center p-4 bg-slate-900">
        <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 text-center animate-fade-in">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Invalid Access</h2>
          <p className="text-slate-500 text-sm mb-6">Please log in to initiate password reset.</p>
          <button
            onClick={() => navigate("/login")}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all text-sm"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    updateUser(user.id, {
      password,
      mustResetPassword: false,
    });

    const result = loginUser(user.email, password);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-bg min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fade-in bg-slate-900">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30 mb-4">
            <FiLock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Reset Password
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Welcome, <span className="font-bold text-slate-800">{user.fullName}</span>
          </p>
        </div>

        <div className="mb-6 p-4 rounded-xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-800 font-medium">
          🔑 <strong>First Login Detected:</strong> Since your profile was provisioned by an administrator, please create a new secure password to activate your account.
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Field
            label="New Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            placeholder="Minimum 6 characters"
          />

          <Field
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError("");
            }}
            placeholder="Re-enter password"
          />

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 mt-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform active:scale-98"
          >
            Save Password & Log In
          </button>
        </form>

      </div>
    </div>
  );
};

const Field = ({ label, name, type = 'text', value, onChange, placeholder }) => {
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
          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-indigo-600 ring-2 ring-transparent focus:ring-indigo-100 transition-all pr-10"
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
    </div>
  );
};

export default ResetPassword;