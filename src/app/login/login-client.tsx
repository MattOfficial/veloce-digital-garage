"use client";

import { login, signup } from "./actions";
import {
  Button,
  Input,
  Label,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@mattofficial/veloce-ui";
import { MotionWrapper } from "@/components/motion-wrapper";
import { GoogleAuthButton } from "@/components/google-auth-button";
import { brand } from "@/content/en/brand";
import { ui } from "@/content/en/ui";

export function LoginClient({
  message,
  defaultTab = "login",
}: {
  message?: string;
  defaultTab?: string;
}) {
  return (
    <MotionWrapper className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 h-screen mx-auto">
      <Card className="w-full">
        <Tabs defaultValue={defaultTab} className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              {brand.app.fullName}
            </CardTitle>
            <CardDescription className="text-center">
              {ui.auth.signInDescription}
            </CardDescription>
            <TabsList className="grid w-full grid-cols-2 mt-4">
              <TabsTrigger value="login">{ui.auth.tabs.signIn}</TabsTrigger>
              <TabsTrigger value="signup">{ui.auth.tabs.signUp}</TabsTrigger>
            </TabsList>
          </CardHeader>

          <TabsContent value="login" className="m-0">
            <form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-login">{ui.auth.fields.email}</Label>
                  <Input
                    name="email"
                    id="email-login"
                    placeholder={ui.auth.fields.emailPlaceholder}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-login">
                    {ui.auth.fields.password}
                  </Label>
                  <Input
                    type="password"
                    name="password"
                    id="password-login"
                    placeholder={ui.auth.fields.passwordPlaceholder}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button formAction={login} className="w-full">
                  {ui.auth.buttons.signIn}
                </Button>
                <div className="relative w-full py-4 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      {ui.auth.dividers.signIn}
                    </span>
                  </div>
                </div>
                <GoogleAuthButton text={ui.auth.buttons.signInWithGoogle} />
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
                  <Label htmlFor="email-signup">{ui.auth.fields.email}</Label>
                  <Input
                    name="email"
                    id="email-signup"
                    placeholder={ui.auth.fields.emailPlaceholder}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-signup">
                    {ui.auth.fields.password}
                  </Label>
                  <Input
                    type="password"
                    name="password"
                    id="password-signup"
                    placeholder={ui.auth.fields.passwordPlaceholder}
                    required
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-4 text-center">
                  {ui.auth.signUpTerms}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button formAction={signup} className="w-full">
                  {ui.auth.buttons.signUp}
                </Button>
                <div className="relative w-full py-4 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      {ui.auth.dividers.signUp}
                    </span>
                  </div>
                </div>
                <GoogleAuthButton text={ui.auth.buttons.signUpWithGoogle} />
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
