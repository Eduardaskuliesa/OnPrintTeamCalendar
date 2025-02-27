/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { getSession, signIn } from "next-auth/react";
import { useState } from "react";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const response = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
      });

      if (response?.error) {
        toast.error("Neteisingi prisijungimo duomenys");
        setLoading(false);
        return;
      }

      const session = await getSession();

      if (session?.user?.role === "ADMIN") {
        router.replace("/admin");
      } else if (session?.user?.role === "USER") {
        router.replace("/account");
      }

      toast.success("Sėkmingai prisijungėte!");
    } catch (error) {
      toast.error("Prisijungimas nepavyko. Bandykite dar kartą.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-[#fefaf6] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-50 border-2 border-blue-50 shadow-xl rounded-xl p-8 space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-[#102C57]">Sveiki</h2>
          <p className="mt-2 text-sm text-[#6F4E37]">Prašome prisijungti</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#102C57]"
            >
              El. paštas
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full py-3 px-4 border focus:outline-none border-lcoffe rounded-lg shadow-sm focus:ring-2 focus:ring-dcoffe focus:border-transparent transition-colors"
              placeholder="pavyzdys@pastas.lt"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#102C57]"
            >
              Slaptažodis
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="mt-1 block w-full py-3 px-4 border focus:outline-none border-lcoffe rounded-lg shadow-sm focus:ring-2 focus:ring-dcoffe focus:border-transparent transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#102C57]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-dcoffe flex items-center justify-center text-gray-950 rounded-lg shadow-md hover:bg-vdcoffe hover:text-white focus:outline-none focus:ring-2 focus:ring-[#DAC0A3] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Prisijungti"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
