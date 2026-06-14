export default function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-slate-500">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
