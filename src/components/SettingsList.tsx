import { motion, } from "framer-motion";
import type { SettingItem } from "../types";
import {
  Moon,
  Bell,
  Shield,
  Palette,
  Keyboard,
  Languages,
  Volume2,
  Download,
} from "lucide-react";

const sampleSettings: SettingItem[] = [
  {
    id: "theme",
    title: "Theme",
    description: "Choose between light and dark mode",
    icon: <Moon className="w-5 h-5" />,
    category: "Appearance",
    color: "from-purple-500 to-pink-500",
    value: "dark",
    type: "select",
    options: ["light", "dark", "system"],
  },
  {
    id: "language",
    title: "Language",
    description: "Select your preferred language",
    icon: <Languages className="w-5 h-5" />,
    category: "General",
    color: "from-blue-500 to-cyan-500",
    value: "en",
    type: "select",
    options: ["en", "es", "fr", "de", "ja"],
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Enable or disable system notifications",
    icon: <Bell className="w-5 h-5" />,
    category: "General",
    color: "from-orange-500 to-red-500",
    value: true,
    type: "toggle",
  },
  {
    id: "privacy",
    title: "Privacy Mode",
    description: "Hide sensitive information",
    icon: <Shield className="w-5 h-5" />,
    category: "Security",
    color: "from-green-500 to-emerald-500",
    value: false,
    type: "toggle",
  },
  {
    id: "accent",
    title: "Accent Color",
    description: "Choose your preferred accent color",
    icon: <Palette className="w-5 h-5" />,
    category: "Appearance",
    color: "from-indigo-500 to-purple-500",
    value: "blue",
    type: "select",
    options: ["blue", "purple", "green", "orange", "red"],
  },
  {
    id: "shortcuts",
    title: "Keyboard Shortcuts",
    description: "Customize keyboard shortcuts",
    icon: <Keyboard className="w-5 h-5" />,
    category: "General",
    color: "from-zinc-600 to-gray-700",
    value: "default",
    type: "select",
    options: ["default", "vim", "custom"],
  },
  {
    id: "volume",
    title: "Volume",
    description: "Adjust system volume",
    icon: <Volume2 className="w-5 h-5" />,
    category: "Audio",
    color: "from-rose-500 to-pink-500",
    value: 80,
    type: "input",
  },
  {
    id: "updates",
    title: "Auto Updates",
    description: "Automatically download updates",
    icon: <Download className="w-5 h-5" />,
    category: "System",
    color: "from-cyan-500 to-blue-500",
    value: true,
    type: "toggle",
  },
];

const SettingItem = ({ setting }: { setting: SettingItem }) => {
  return (
    <motion.div
      className="group flex items-center px-6 py-3 cursor-pointer relative hover:bg-zinc-800/30"
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.998 }}
      transition={{ duration: 0.15 }}
    >
      <div className="relative">
        <motion.div
          className={`flex items-center justify-center w-10 h-10 rounded-xl mr-4 transition-all duration-200 bg-gradient-to-br ${setting.color} shadow-lg`}
          animate={{
            scale: 1,
            rotateY: [0, 5, 0],
          }}
        >
          <motion.div
            className="text-white"
            animate={{ rotateZ: [0, 5, -5, 0] }}
          >
            {setting.icon}
          </motion.div>
        </motion.div>
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${setting.color} rounded-xl blur-md -z-10 opacity-30`}
        />
      </div>

      <div className="flex-1 min-w-0 relative z-10">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold truncate text-zinc-200 group-hover:text-white duration-200">
            {setting.title}
          </h3>
          <div className="ml-4">
            {setting.type === "toggle" && (
              <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-zinc-700/50">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={setting.value as boolean}
                  onChange={() => {}}
                />
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 transition-opacity peer-checked:opacity-100" />
                <span className="absolute left-1 h-4 w-4 rounded-full bg-zinc-400 transition-all peer-checked:left-6 peer-checked:bg-white" />
              </div>
            )}
            {setting.type === "select" && (
              <select
                className="bg-zinc-700/50 text-zinc-300 text-sm rounded-md px-2 py-1 border border-zinc-600/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                value={setting.value as string}
                onChange={() => {}}
              >
                {setting.options?.map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            )}
            {setting.type === "input" && (
              <input
                type="range"
                min="0"
                max="100"
                value={setting.value as number}
                onChange={() => {}}
                className="w-24 h-2 bg-zinc-700/50 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            )}
          </div>
        </div>
        <p className="text-sm truncate mt-0.5 text-zinc-400 group-hover:text-zinc-300 duration-200">
          {setting.description}
        </p>
      </div>
    </motion.div>
  );
};

export const SettingsList = () => {
  const categories = Array.from(
    new Set(sampleSettings.map((setting) => setting.category))
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative"
    >
      <div className="py-2 max-h-96 overflow-y-auto overflow-x-hidden scrollbar">
        {categories.map((category) => (
          <div key={category} className="mb-4">
            <h2 className="px-6 py-2 text-sm font-medium text-zinc-400">
              {category}
            </h2>
            {sampleSettings
              .filter((setting) => setting.category === category)
              .map((setting) => (
                <SettingItem key={setting.id} setting={setting} />
              ))}
          </div>
        ))}
      </div>
    </motion.div>
  );
}; 