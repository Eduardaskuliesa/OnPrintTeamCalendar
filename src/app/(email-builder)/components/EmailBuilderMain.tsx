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