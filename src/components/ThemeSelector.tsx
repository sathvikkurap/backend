"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sun, Moon, Palette, Wand2 } from "lucide-react";

export function ThemeSelector() {
  const { theme, setTheme, themes } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const themeIcons: Record<string, React.ReactNode> = {
    light: <Sun className="h-5 w-5" />,
    dark: <Moon className="h-5 w-5" />,
    system: <Palette className="h-5 w-5" />,
    neon: <Wand2 className="h-5 w-5 text-purple-500" />,
    retro: <Wand2 className="h-5 w-5 text-amber-500" />,
    cyberpunk: <Wand2 className="h-5 w-5 text-cyan-500" />,
    elegant: <Wand2 className="h-5 w-5 text-rose-500" />,
    minimal: <Wand2 className="h-5 w-5 text-gray-500" />,
  };

  const getThemeIcon = (themeName: string) => {
    return themeIcons[themeName] || <Palette className="h-5 w-5" />;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          {theme ? getThemeIcon(theme) : <Palette className="h-5 w-5" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((t) => (
          <DropdownMenuItem
            key={t}
            onClick={() => setTheme(t)}
            className={`flex items-center gap-2 ${theme === t ? 'bg-accent' : ''}`}
          >
            {getThemeIcon(t)}
            <span className="capitalize">{t}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
