export function Container({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`mx-auto w-full max-w-screen-xl px-2.5 md:px-20 ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Container;
