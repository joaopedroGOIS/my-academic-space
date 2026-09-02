import { ArrowLeft } from "lucide-react";
import { useNavigate, useRouter } from "@tanstack/react-router";

export function BackButton({ label }: { label?: string }) {
  const navigate = useNavigate();
  const router = useRouter();

  const handleBack = () => {
    // Use history when there is previous navigation, otherwise go Home
    // window.history.length > 1 indicates prior entries; router.history handles TanStack history
    const canGoBack = typeof window !== "undefined" && window.history.length > 1;
    if (canGoBack) {
      router.history.back();
    } else {
      navigate({ to: "/" });
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      aria-label={label ? `Voltar de ${label}` : "Voltar"}
      className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-200 hover:bg-[#EDE9FE] hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0"
    >
      <ArrowLeft className="size-4" />
    </button>
  );
}
