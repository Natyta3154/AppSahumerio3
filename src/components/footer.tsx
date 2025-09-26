export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-secondary">
      <div className="container mx-auto py-6 px-4 text-center text-secondary-foreground">
        <p className="text-sm">&copy; {currentYear} AromaCommerce. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
