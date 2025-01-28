export function getAuthError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong, please try again later';
}
