// src/components/SignIn.tsx

import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  [key: string]: string;
}

const SignIn = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Sign-in simulated successfully!");
      // navigate("/dashboard");
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center min-h-screen px-4 bg-[#F3E8FF]"
    >
      <div className="max-w-4xl w-full grid lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-[#4C1D95] text-white rounded-2xl p-10 flex flex-col justify-center shadow-lg"
        >
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
            📂 Welcome Back to Your Vault
          </h1>
          <p className="text-lg italic text-violet-100 mt-4">
            "Pick up where you left off — your memories are safe with us."
          </p>
        </motion.div>

        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-10 rounded-2xl shadow-xl"
        >
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">Sign in to your account</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="border border-gray-300 focus:ring-2 focus:ring-violet-500"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <Input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="border border-gray-300 focus:ring-2 focus:ring-violet-500"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold text-base"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-100"
              onClick={() => toast.success("Google auth simulated")}
            >
              <FcGoogle size={20} />
              Continue with Google
            </Button>

            <p className="text-sm text-center mt-4 text-gray-600">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-violet-600 font-medium cursor-pointer hover:underline"
              >
                Sign up
              </span>
            </p>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SignIn;
