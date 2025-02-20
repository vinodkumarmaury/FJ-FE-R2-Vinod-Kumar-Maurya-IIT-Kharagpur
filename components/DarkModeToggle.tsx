interface DarkModeToggleProps {
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
}

export default function DarkModeToggle({ darkMode, setDarkMode }: DarkModeToggleProps) {
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode.toString());
    if (newMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  };

  return (
    <button onClick={toggleDarkMode} className="bg-gray-800 text-white px-3 py-1 rounded">
      {darkMode ? "Light Mode" : "Dark Mode"}
    </button>
  );
}
