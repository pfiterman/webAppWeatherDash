import { CloudOff } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted">
          <CloudOff className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Page not found</h1>
        <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium">
          Go back home
        </Link>
      </div>
    </div>
  );
}
