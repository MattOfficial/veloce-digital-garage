"use client";

import { login, signup } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MotionWrapper } from "@/components/motion-wrapper";
import { GoogleAuthButton } from "@/components/google-auth-button";

export function LoginClient({ message, defaultTab = "login" }: { message?: string; defaultTab?: string }) {
    return (
        <MotionWrapper className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 h-screen mx-auto">
            <Card className="w-full">
                <Tabs defaultValue={defaultTab} className="w-full">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">
                            Digital Garage
                        </CardTitle>
                        <CardDescription className="text-center">
                            Sign in to manage your vehicles and fuel logs
                        </CardDescription>
                        <TabsList className="grid w-full grid-cols-2 mt-4">
                            <TabsTrigger value="login">Sign In</TabsTrigger>
                            <TabsTrigger value="signup">Sign Up</TabsTrigger>
                        </TabsList>
                    </CardHeader>

                    <TabsContent value="login" className="m-0">
                        <form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email-login">Email</Label>
                                    <Input
                                        name="email"
                                        id="email-login"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password-login">Password</Label>
                                    <Input
                                        type="password"
                                        name="password"
                                        id="password-login"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-2">
                                <Button formAction={login} className="w-full">
                                    Sign In
                                </Button>
                                <div className="relative w-full py-4 text-center">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-border" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                                    </div>
                                </div>
                                <GoogleAuthButton text="Sign in with Google" />
                                {message && (
                                    <p className="mt-4 p-4 bg-destructive/10 text-destructive text-center text-sm rounded-md border border-destructive/20">
                                        {message}
                                    </p>
                                )}
                            </CardFooter>
                        </form>
                    </TabsContent>

                    <TabsContent value="signup" className="m-0">
                        <form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email-signup">Email</Label>
                                    <Input
                                        name="email"
                                        id="email-signup"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password-signup">Password</Label>
                                    <Input
                                        type="password"
                                        name="password"
                                        id="password-signup"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                                <div className="text-xs text-muted-foreground mt-4 text-center">
                                    By signing up, you agree to our Terms of Service.
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-2">
                                <Button formAction={signup} className="w-full">
                                    Sign Up
                                </Button>
                                <div className="relative w-full py-4 text-center">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-border" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-card px-2 text-muted-foreground">Or sign up with</span>
                                    </div>
                                </div>
                                <GoogleAuthButton text="Sign up with Google" />
                                {message && (
                                    <p className="mt-4 p-4 bg-destructive/10 text-destructive text-center text-sm rounded-md border border-destructive/20">
                                        {message}
                                    </p>
                                )}
                            </CardFooter>
                        </form>
                    </TabsContent>
                </Tabs>
            </Card>
        </MotionWrapper>
    );
}
