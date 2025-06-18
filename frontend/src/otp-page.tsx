import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ArrowLeft, Shield } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Backend_URL } from "./config";

export default function OTPPage() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (otp.length !== 6) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${Backend_URL}/user/otp`,
        { otp },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (response.status === 200) {
        toast.success("Welcome to Galaria");
        navigate("/files");
      } else {
        toast.error("Error at Signin");
        navigate("/");
      }
    } catch (error) {
      toast.error("Error verifying OTP");
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    toast("Resending OTP..."); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-md border border-gray-200">
          <CardHeader className="text-center space-y-4">
            <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Verify Your Account</CardTitle>
              <CardDescription className="text-gray-600">
                We’ve sent a 6-digit verification code to your email.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="text-center">
                <label className="text-sm font-medium text-gray-700 block mb-3">
                  Enter verification code
                </label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    pattern="^[0-9]+$"
                    value={otp}
                    onChange={setOtp}
                  >
                    <InputOTPGroup>
                      {[...Array(6)].map((_, index) => (
                        <InputOTPSlot key={index} index={index} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={otp.length !== 6 || isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">Didn't receive the code?</p>
              <Button
                variant="ghost"
                onClick={handleResend}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                Resend Code
              </Button>
            </div>

            <div className="flex items-center justify-center">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-gray-700"
                onClick={() => navigate("/signin")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
