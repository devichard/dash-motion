import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface StepLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function StepLayout({ title, description, children }: StepLayoutProps) {
  return (
    <Card className="animate-in fade-in-50 slide-in-from-bottom-4 duration-300 w-full">
      <CardHeader>
        <h2 className="text-xl font-semibold">{title}</h2>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
