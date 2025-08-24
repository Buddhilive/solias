import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleX, Info } from "lucide-react";

export const SoliasAlert = ({
  title,
  children,
  variant,
}: {
  title?: string;
  children?: React.ReactNode;
  variant: "default" | "destructive";
}) => {
  return (
    <Alert variant={variant}>
        {variant === "destructive" ? (
            <CircleX />
        ) : (
            <Info />
        )}
      <AlertTitle>{title}</AlertTitle>
      {/* Render children directly as the AlertDescription slot */}
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
};
