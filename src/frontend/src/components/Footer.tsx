export default function Footer() {
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="border-t border-border bg-muted/50 mt-16">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="font-display font-semibold text-foreground">
              निःशुल्क योग सेवा शिविर
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              स्थान: अम्बेडकर भवन, करणी चौक सुरेशिया · 📞 +91 9024783339
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              © {year}. Built with ❤️ using{" "}
              <a
                href={utmLink}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
