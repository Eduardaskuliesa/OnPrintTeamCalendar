import { Button } from "@/components/ui/button";
import { ChevronLeft, CheckCircle, AlertCircle, SendHorizonal, PlusCircle } from "lucide-react";

interface EmailBuilderMainProps {
    children: React.ReactNode;
    isSaved?: boolean;
}

export function EmailBuilderMain({ children }: EmailBuilderMainProps) {
    return (
        <div className="w-full max-h-[100vh] h-full">
            {children}
        </div>
    );
}