import { Construction } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description?: string;
}

export function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
        {description && <p className="text-slate-600 mt-1">{description}</p>}
      </div>

      <div className="bg-white rounded-lg border p-12 flex flex-col items-center justify-center text-center">
        <Construction className="h-16 w-16 text-slate-300 mb-4" />
        <h2 className="text-xl font-semibold text-slate-700">Coming Soon</h2>
        <p className="text-slate-500 mt-2 max-w-md">
          This feature is under development. Check back later for updates.
        </p>
      </div>
    </div>
  );
}
