interface StatCardProps {
  title: string;
  value: React.ReactNode;
  subTitle?: string;
}

export function StatCard({ title, value, subTitle }: StatCardProps) {
  return (
    <section className="rounded-xl border bg-card text-card-foreground shadow-sm p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className="mt-2 text-2xl font-semibold">{value}</div>
          {subTitle && (
            <div className="text-xs text-muted-foreground mt-1">{subTitle}</div>
          )}
        </div>
      </div>
    </section>
  );
}
