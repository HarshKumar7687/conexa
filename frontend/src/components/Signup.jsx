import React, { useEffect, useState } from "react";
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const Signup = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();

  const changeEventHandler = (event) => {
    setInput({ ...input, [event.target.name]: event.target.value });
  };

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  const signupHandler = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:8000/api/v1/user/register', input, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/login');
        setInput({ username: "", email: "", password: "" });
      }
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) navigate('/');
  }, [user]);

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gradient-to-br from-[#0a0a0a] via-[#141414] to-[#1a1a1a] text-white px-4">
      <motion.form
        onSubmit={signupHandler}
        className="w-full max-w-md bg-[#111111] shadow-xl rounded-xl p-8 backdrop-blur-md border border-[#2a2a2a]
                   hover:shadow-yellow-500/40 transition-shadow duration-300"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        aria-label="Signup form"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-wide text-yellow-400 select-none">Conexa</h1>
          <p className="text-sm text-gray-400 mt-1 select-none">Signup now and join the future of social media!</p>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <Label htmlFor="username" className="block mb-1 text-sm font-medium text-gray-300">Username</Label>
            <Input
              id="username"
              type="text"
              name="username"
              value={input.username}
              onChange={changeEventHandler}
              placeholder="Enter your username"
              className="bg-[#1e1e1e] border border-gray-700 text-white placeholder-yellow-600
                         focus-visible:ring-yellow-500 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-[#111111]
                         transition duration-300"
              aria-required="true"
              aria-describedby="username-desc"
            />
            <p id="username-desc" className="sr-only">Choose a unique username</p>
          </div>

          <div className="relative">
            <Label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-300">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              placeholder="Enter your email"
              className="bg-[#1e1e1e] border border-gray-700 text-white placeholder-yellow-600
                         focus-visible:ring-yellow-500 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-[#111111]
                         transition duration-300"
              aria-required="true"
              aria-describedby="email-desc"
            />
            <p id="email-desc" className="sr-only">Your email address</p>
          </div>

          <div className="relative">
            <Label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-300">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={input.password}
                onChange={changeEventHandler}
                placeholder="Choose a strong password"
                className="bg-[#1e1e1e] border border-gray-700 text-white placeholder-yellow-600
                           focus-visible:ring-yellow-500 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-[#111111]
                           transition duration-300 pr-10"
                aria-required="true"
                aria-describedby="password-desc"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-3 flex items-center text-yellow-400 hover:text-yellow-300 transition"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p id="password-desc" className="sr-only">Choose a secure password</p>
          </div>

          <motion.div
            whileTap={{ scale: 0.95 }}
            className="mt-4"
          >
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold
                         hover:from-yellow-500 hover:to-yellow-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
              aria-busy={loading}
              aria-live="polite"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin h-5 w-5 text-black" />
                  Creating Account...
                </div>
              ) : (
                "Sign Up"
              )}
            </Button>
          </motion.div>
        </div>

        <p className="text-center text-sm text-gray-400 mt-8 select-none">
          Already have an account?
          <Link to="/login" className="text-yellow-400 font-semibold ml-1 hover:underline">
            Login
          </Link>
        </p>
      </motion.form>
    </div>
  );
};

export default Signup;
