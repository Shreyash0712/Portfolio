interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <div className="pt-8 md:pt-12 pb-8 md:pb-12 text-center">
      <h1 className="font-handwriting text-5xl sm:text-6xl md:text-7xl font-semibold text-foreground tracking-wide">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-3 text-text-muted text-sm sm:text-base max-w-lg mx-auto">
          {subtitle}
        </p>
      )}
      {children && (
        <div className="mt-6 flex justify-center">
          {children}
        </div>
      )}
    </div>
  );
}
