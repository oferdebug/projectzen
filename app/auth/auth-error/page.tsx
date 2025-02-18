"use client";

import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="flex items-center justify-center h-minus-135">
      <Card className="w-96">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Authentication Error</CardTitle>
          <CardDescription>
            There was an error during authentication. Please try again.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="text-sm text-muted-foreground">
            {error}
            <ul className="list-disc list-inside text-muted-foreground">
              <li>Please Check your internet connection</li>
              <li>Please Try Again Later</li>
              <li>Contact support if the problem persists</li>
            </ul>
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button asChild className="w-full">
            <Link href="/login">Go To Login</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/">Go To Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthErrorContent />
    </Suspense>
  );
}
