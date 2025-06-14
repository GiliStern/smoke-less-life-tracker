
import { NavLink } from "react-router-dom";
import { Home, BarChart3, Award } from "lucide-react";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/insights", icon: BarChart3, label: "Insights" },
  { to: "/motivation", icon: Award, label: "Motivation" },
];

const BottomNav = () => {
  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center gap-1 transition-colors ${
      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 mx-auto h-16 max-w-md border-t border-border bg-background/80 backdrop-blur-sm">
      <div className="flex h-full items-center justify-around">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={getNavClass} end>
            <item.icon className="h-6 w-6" />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
