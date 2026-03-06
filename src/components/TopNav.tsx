import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";

export function TopNav() {
  return (
    <>
      {/* Globe on the left */}
      <div className="fixed top-4 left-4 z-50">
        <LanguageToggle />
      </div>
      {/* Theme toggle on the right */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
    </>
  );
}
