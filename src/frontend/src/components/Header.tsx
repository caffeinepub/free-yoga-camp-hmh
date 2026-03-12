import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@tanstack/react-router";
import { Shield } from "lucide-react";

export default function Header() {
  const router = useRouter();
  const currentPath = router.state.location.pathname;

  return (
    <header className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border shadow-xs">
      <div className="container mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <Link
          to="/"
          data-ocid="nav.home.link"
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl group-hover:bg-primary/20 transition-colors">
            🧘
          </div>
          <div className="hidden sm:block">
            <div className="font-display font-bold text-foreground text-sm leading-tight">
              निःशुल्क योग सेवा शिविर
            </div>
            <div className="text-xs text-muted-foreground">
              Free Yoga Camp · HMH
            </div>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          {currentPath !== "/" && (
            <Link to="/" data-ocid="nav.admission.link">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:text-primary hover:bg-primary/10"
              >
                एडमिशन फॉर्म
              </Button>
            </Link>
          )}
          {currentPath !== "/admin" && (
            <Link to="/admin" data-ocid="nav.admin.link">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary hover:bg-primary/10 gap-1.5"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
