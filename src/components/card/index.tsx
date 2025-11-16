import { Button } from "../ui/button";
import type { Action } from "@/interfaces/actions";

interface CardProps {
  title: string;
  actions: Action[];
  children: React.ReactNode;
}

export function Card({ title, actions, children }: CardProps) {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
      <section className="flex  justify-between space-y-1.5 p-6">
        <h2 className="text-2xl font-semibold leading-none tracking-tight">
          {title}
        </h2>

        {actions && (
          <div>
            {actions.map(({ label, icon: Icon, onClick }) => (
              <Button
                key={label}
                className="w-32 cursor-pointer"
                onClick={onClick}
              >
                {Icon && <Icon className="w-5 h-5" />} {label}
              </Button>
            ))}
          </div>
        )}
      </section>

      <section className="p-6 pt-0">{children}</section>
    </div>
  );
}
