"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { LogOut, Loader } from "lucide-react";
import { useRouter } from "next/navigation";

const ADMIN_SESSION_STACK_KEY = "adminSessionStack";

function getSessionStack(): string[] {
  try {
    const stored = localStorage.getItem(ADMIN_SESSION_STACK_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function pushSessionToStack(token: string) {
  const stack = getSessionStack();
  stack.push(token);
  localStorage.setItem(ADMIN_SESSION_STACK_KEY, JSON.stringify(stack));
}

function getOriginalSession(): string | null {
  const stack = getSessionStack();
  if (stack.length === 0) return null;
  // Get the first (original) admin session and clear the stack
  const originalToken = stack[0];
  localStorage.removeItem(ADMIN_SESSION_STACK_KEY);
  return originalToken || null;
}

export function ImpersonationBanner() {
  const { data: session, update } = useSession();
  const [isRestoring, setIsRestoring] = useState(false);
  const router = useRouter();

  if (!session?.user?.impersonatedBy) {
    return null;
  }

  const handleRestore = async () => {
    const storedToken = getOriginalSession();

    if (!storedToken) {
      alert("Admin session not found. Please login again.");
      return;
    }

    setIsRestoring(true);

    try {
      const response = await fetch("/api/auth/restore-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: storedToken }),
      });

      if (response.ok) {
        await update();
        router.push("/admin");
        router.refresh();
      } else {
        alert("Failed to restore admin session. Please login again.");
      }
    } catch {
      alert("Failed to restore admin session. Please login again.");
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="bg-purple-600 text-white text-center py-2 px-4 flex items-center justify-center gap-3 text-sm">
      <span>
        Prisijungta kaip <strong>{session.user.email}</strong>
      </span>
      <button
        onClick={handleRestore}
        disabled={isRestoring}
        className="inline-flex items-center gap-1 bg-white text-purple-700 px-3 py-1 rounded-md hover:bg-purple-100 transition-colors disabled:opacity-50 font-medium"
      >
        {isRestoring ? (
          <Loader className="animate-spin" size={14} />
        ) : (
          <LogOut size={14} />
        )}
        Grįžti
      </button>
    </div>
  );
}

export { ADMIN_SESSION_STACK_KEY, pushSessionToStack };
