import { AlertCircle } from "lucide-react";

export default function ErrorState({
  title = "Something went wrong",
  message,
}: {
  title?: string;
  message: string;
}) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
      <AlertCircle className="h-8 w-8 text-rose-500" />
      <div>
        <p className="font-medium text-rose-900">{title}</p>
        <p className="mt-1 text-sm text-rose-700">{message}</p>
      </div>
    </div>
  );
}
