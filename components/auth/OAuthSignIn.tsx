"use client";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/Icons";
import { useToast } from "@/components/ui/use-toast";
import { clientSignIn } from "@/lib/auth";
import { getAuthError } from "@/utils/auth-errors";
import { createToast } from "@/types/toast";

interface OAuthSignInProps {
  isLoading: boolean;
  onLoadingChange: (loading: boolean) => void;
}

export function OauthSignIn({ isLoading, onLoadingChange }: OAuthSignInProps) {
  const { toast } = useToast();

  const handleOAuthSignIn = async (provider: "github" | "google") => {
    try {
      onLoadingChange(true);
      await clientSignIn(provider);
    } catch (error) {
      const { message } = getAuthError(error);
      toast(
        createToast({
          variant: "destructive",
          title: "Authentication Error",
          description: message,
        })
      );
    } finally {
      onLoadingChange(false);
    }
  };

  return (
    <div className="w-full">
      <div className="relative mt-2 mb-6">
        <div className="absolute inset-0 flex items-center translate-y-[1rem]">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or Continue With
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          onClick={() => handleOAuthSignIn("github")}
        >
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.gitHub className="mr-2 h-4 w-4" />
          )}
          <span>Sign in with Github</span>
        </Button>
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          onClick={() => handleOAuthSignIn("google")}
        >
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.google className="mr-2 h-4 w-4" />
          )}
          <span>Sign in with Google</span>
        </Button>
      </div>
    </div>
  );
}
