import { useState } from "react";
import { Coffee, LogIn, UserPlus, Loader2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { useAuth } from "@/app/hooks/useAuth";
import { toast } from "sonner";

interface AuthProps {
  onNavigate: (view: string) => void;
}

export function Auth({ onNavigate }: AuthProps) {
  const { signIn, signUp, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await signIn(loginData.email, loginData.password);

    if (result.success) {
      toast.success("Login successful!");
      onNavigate("home");
    } else {
      toast.error(result.error || "Invalid email or password");
    }
    setIsSubmitting(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (registerData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsSubmitting(true);
    const result = await signUp(
      registerData.email,
      registerData.password,
      registerData.name,
    );

    if (result.success) {
      toast.success(
        "Registration successful! Please check your email to verify your account.",
      );
      onNavigate("home");
    } else {
      toast.error(result.error || "Registration failed");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Coffee className="h-12 w-12 text-[#5F1B2C]" />
            </div>
            <h1 className="text-3xl mb-2">Welcome to Rattanak Coffee</h1>
            <p className="text-gray-600">
              Sign in or create an account to continue
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue="login">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </TabsTrigger>
                  <TabsTrigger value="register">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Register
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="your@email.com"
                        value={loginData.email}
                        onChange={(e) =>
                          setLoginData({ ...loginData, email: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={(e) =>
                          setLoginData({
                            ...loginData,
                            password: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#5F1B2C] hover:bg-[#4a1523]"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <Label htmlFor="register-name">Full Name</Label>
                      <Input
                        id="register-name"
                        placeholder="John Doe"
                        value={registerData.name}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            name: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="your@email.com"
                        value={registerData.email}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            email: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="register-password">Password</Label>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="••••••••"
                        value={registerData.password}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            password: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="register-confirm">Confirm Password</Label>
                      <Input
                        id="register-confirm"
                        type="password"
                        placeholder="••••••••"
                        value={registerData.confirmPassword}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            confirmPassword: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#5F1B2C] hover:bg-[#4a1523]"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <Button variant="ghost" onClick={() => onNavigate("home")}>
              Continue as Guest
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
