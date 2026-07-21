import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { saveUser, getCurrentUser } from '../utils/authStorage'
import { FiEye, FiEyeOff, FiBookOpen } from 'react-icons/fi'

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  course: 'B.Tech Computer Science',
  semester: '1st Semester',
}

const Register = () => {
  const navigate = useNavigate()

  useEffect(() => {
    if (getCurrentUser()) {
      navigate('/dashboard')
    }
  }, [navigate])

  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
    setSubmitError('')
  }

  const validate = () => {
    const nextErrors = {}

    if (!form.fullName.trim()) {
      nextErrors.fullName = 'Full name is required.'
    }

    if (!form.email.trim()) {
      nextErrors.email = 'Email address is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = 'Please enter a valid email address.'
    }

    if (!form.phone.trim()) {
      nextErrors.phone = 'Phone number is required.'
    } else if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) {
      nextErrors.phone = 'Enter a valid 10-digit mobile number.'
    }

    if (!form.password) {
      nextErrors.password = 'Password is required.'
    } else if (form.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.'
    }

    if (!form.confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your password.'
    } else if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    // Role is automatically set strictly to 'Student' for public self-registration
    const result = saveUser({
      id: crypto.randomUUID(),
      fullName: form.fullName.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.replace(/\D/g, ''),
      password: form.password,
      role: 'Student', // Strictly Student
      course: form.course,
      semester: form.semester,
      createdAt: new Date().toISOString(),
    })

    if (!result.success) {
      setSubmitError(result.error)
      return
    }

    navigate('/login', { state: { registered: true, email: form.email.trim() } })
  }

  return (
    <div className="auth-bg min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fade-in">
      <div className="w-full max-w-xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30 mb-4 animate-float">
            <FiBookOpen className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Student Self-Registration
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Greenfield College of Engineering & Technology Portal
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          
          <Field
            label="Full Name"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            error={errors.fullName}
            placeholder="e.g. Priya Sharma"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Student Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="priya.student@gcet.edu.in"
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
            <div>
              <label htmlFor="course" className="block text-sm font-semibold text-slate-700 mb-1">
                Course / Branch
              </label>
              <select
                id="course"
                name="course"
                value={form.course}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-indigo-600 transition-all"
              >
                <option value="B.Tech Computer Science">B.Tech Computer Science</option>
                <option value="B.Tech Information Technology">B.Tech Information Technology</option>
                <option value="B.Tech Mechanical Eng.">B.Tech Mechanical Eng.</option>
                <option value="B.Tech Civil Engineering">B.Tech Civil Engineering</option>
                <option value="B.Tech Electronics & Comm.">B.Tech Electronics & Comm.</option>
              </select>
            </div>

            <div>
              <label htmlFor="semester" className="block text-sm font-semibold text-slate-700 mb-1">
                Semester / Year
              </label>
              <select
                id="semester"
                name="semester"
                value={form.semester}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-indigo-600 transition-all"
              >
                <option value="1st Semester">1st Semester</option>
                <option value="2nd Semester">2nd Semester</option>
                <option value="3rd Semester">3rd Semester</option>
                <option value="4th Semester">4th Semester</option>
                <option value="5th Semester">5th Semester</option>
                <option value="6th Semester">6th Semester</option>
                <option value="7th Semester">7th Semester</option>
                <option value="8th Semester">8th Semester</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Minimum 6 characters"
            />

            <Field
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="Re-enter password"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 font-medium">
            ℹ️ <strong>Note:</strong> Public registration is strictly for Enrolled Students. Staff and Admin accounts are provisioned securely by Institute Administration.
          </div>

          {submitError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-600">
              {submitError}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 mt-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform active:scale-98"
          >
            Complete Student Registration
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500 font-medium">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-indigo-600 hover:underline">
            Sign In Here
          </Link>
        </p>

      </div>
    </div>
  )
}

const Field = ({ label, name, type = 'text', value, onChange, error, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

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
          className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none transition-all ${
            error
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
  )
}

export default Register
