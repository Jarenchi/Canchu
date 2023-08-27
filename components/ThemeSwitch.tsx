import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }
  return (
    <select value={theme} onChange={(e) => setTheme(e.target.value)} className="px-2 py-1 rounded-lg">
      <option value="light" className="rounded-lg">
        Light
      </option>
      <option value="dark" className="rounded-lg">
        Dark
      </option>
    </select>
  );
};

export default ThemeSwitch;
