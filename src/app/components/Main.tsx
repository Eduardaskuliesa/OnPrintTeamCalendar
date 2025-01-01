"use client";

export function Main({ children }: { children: React.ReactNode }) {
  return (
    <main
      className="transition-all duration-300 
        md:mt-0 
        md:ml-44 
        p-4 sm:p-8"
    >
      {children}
    </main>
  );
}
