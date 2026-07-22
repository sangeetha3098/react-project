import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveUser, getUsers } from '../utils/authStorage';
import { FiEye, FiEyeOff, FiShield } from 'react-icons/fi';

const AdminSetup = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // If Admin already exists, lock this page and redirect to login
    const adminExists = getUsers().some(u => u.role === 'Admin');
    if (adminExists) {
      navigate('/login');
    }
  }, [navigate]);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setSubmitError('');
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.fullName.trim()) nextErrors.fullName = 'Full Name is required';
    if (!form.email.trim()) {
      nextErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = 'Please enter a valid email address';
    }
    if (!form.phone.trim()) {
      nextErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) {
      nextErrors.phone = 'Enter a valid 10-digit mobile number';
    }
    if (!form.password) {
      nextErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters';
    }
    if (!form.confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your password';
    } else if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = saveUser({
      id: 'usr-admin-' + crypto.randomUUID().substring(0, 8),
      fullName: form.fullName.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.replace(/\D/g, ''),
      password: form.password,
      role: 'Admin',
      mustResetPassword: false,
      department: 'Institute Administration',
      createdAt: new Date().toISOString()
    });

    if (!result.success) {
      setSubmitError(result.error);
      return;
    }

    navigate('/login', { state: { registered: true, email: form.email.trim() } });
  };

  return (
    <div className="auth-bg min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fade-in bg-slate-900">
      <div className="w-full max-w-xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-10">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30 mb-4">
            <FiShield className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            One-Time Admin Setup
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Initialize the GCET Training Institute Portal
          </p>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Field
            label="Super Admin Full Name"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            error={errors.fullName}
            placeholder="e.g. Dr. Rajesh Sharma"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Admin Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="admin@gcet.edu.in"
            />

            <Field
              label="Contact Phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              error={errors.phone}
              placeholder="10-digit mobile number"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Admin Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Minimum 6 characters"
            />

            <Field
              label="Confirm Admin Password"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="Re-enter password"
            />
          </div>

          {submitError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-600">
              {submitError}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 mt-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg shadow-amber-500/25 transition-all transform active:scale-98"
          >
            Create Master Admin & Proceed
          </button>
        </form>

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

export default AdminSetup;
