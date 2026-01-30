import { CheckCircle2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "./alert";

interface MessageAlertProps {
  type: "success" | "error";
  title: string;
  description: string;
}

export const MessageAlert = ({
  type,
  title,
  description,
}: MessageAlertProps) => {
  return (
    <Alert
      variant={type === "error" ? "destructive" : "default"}
      className={type === "success" ? "bg-green-50 border-green-200" : ""}
    >
      {type === "success" ? (
        <CheckCircle2 className="h-4 w-4 text-green-600" />
      ) : (
        <AlertCircle className="h-4 w-4" />
      )}
      <AlertDescription className="cursor-default">
        <div className="font-medium mb-1">{title}</div>
        <div className="text-sm">{description}</div>
      </AlertDescription>
    </Alert>
  );
};
