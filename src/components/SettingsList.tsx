import { motion } from 'framer-motion';
import { Moon, Bell, Shield, Palette, Keyboard, Languages, Volume2, Download } from 'lucide-react';

const sampleSettings = [
  {
    id: 'theme',
    title: 'Theme',
    description: 'Choose between light and dark mode',
    icon: <Moon className="h-5 w-5" />,
    category: 'Appearance',
    color: 'from-purple-500 to-pink-500',
    value: 'dark',
    type: 'select',
    options: ['light', 'dark', 'system'],
  },
  {
    id: 'language',
    title: 'Language',
    description: 'Select your preferred language',
    icon: <Languages className="h-5 w-5" />,
    category: 'General',
    color: 'from-blue-500 to-cyan-500',
    value: 'en',
    type: 'select',
    options: ['en', 'es', 'fr', 'de', 'ja'],
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Enable or disable system notifications',
    icon: <Bell className="h-5 w-5" />,
    category: 'General',
    color: 'from-orange-500 to-red-500',
    value: true,
    type: 'toggle',
  },
  {
    id: 'privacy',
    title: 'Privacy Mode',
    description: 'Hide sensitive information',
    icon: <Shield className="h-5 w-5" />,
    category: 'Security',
    color: 'from-green-500 to-emerald-500',
    value: false,
    type: 'toggle',
  },
  {
    id: 'accent',
    title: 'Accent Color',
    description: 'Choose your preferred accent color',
    icon: <Palette className="h-5 w-5" />,
    category: 'Appearance',
    color: 'from-indigo-500 to-purple-500',
    value: 'blue',
    type: 'select',
    options: ['blue', 'purple', 'green', 'orange', 'red'],
  },
  {
    id: 'shortcuts',
    title: 'Keyboard Shortcuts',
    description: 'Customize keyboard shortcuts',
    icon: <Keyboard className="h-5 w-5" />,
    category: 'General',
    color: 'from-zinc-600 to-gray-700',
    value: 'default',
    type: 'select',
    options: ['default', 'vim', 'custom'],
  },
  {
    id: 'volume',
    title: 'Volume',
    description: 'Adjust system volume',
    icon: <Volume2 className="h-5 w-5" />,
    category: 'Audio',
    color: 'from-rose-500 to-pink-500',
    value: 80,
    type: 'input',
  },
  {
    id: 'updates',
    title: 'Auto Updates',
    description: 'Automatically download updates',
    icon: <Download className="h-5 w-5" />,
    category: 'System',
    color: 'from-cyan-500 to-blue-500',
    value: true,
    type: 'toggle',
  },
];

const SettingItem = ({ setting }: { setting: (typeof sampleSettings)[number] }) => {
  return (
    <motion.div
      className="group relative flex cursor-pointer items-center px-6 py-3 hover:bg-zinc-800/30"
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.998 }}
      transition={{ duration: 0.15 }}
    >
      <div className="relative">
        <motion.div
          className={`mr-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br transition-all duration-200 ${setting.color} shadow-lg`}
          animate={{
            scale: 1,
            rotateY: [0, 5, 0],
          }}
        >
          <motion.div className="text-white" animate={{ rotateZ: [0, 5, -5, 0] }}>
            {setting.icon}
          </motion.div>
        </motion.div>
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${setting.color} -z-10 rounded-xl opacity-30 blur-md`}
        />
      </div>

      <div className="relative z-10 min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <h3 className="truncate font-semibold text-zinc-200 duration-200 group-hover:text-white">
            {setting.title}
          </h3>
          <div className="ml-4">
            {setting.type === 'toggle' && (
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
            {setting.type === 'select' && (
              <select
                className="rounded-md border border-zinc-600/50 bg-zinc-700/50 px-2 py-1 text-sm text-zinc-300 focus:ring-1 focus:ring-blue-500/50 focus:outline-none"
                value={setting.value as string}
                onChange={() => {}}
              >
                {setting.options?.map(option => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            )}
            {setting.type === 'input' && (
              <input
                type="range"
                min="0"
                max="100"
                value={setting.value as number}
                onChange={() => {}}
                className="h-2 w-24 cursor-pointer appearance-none rounded-lg bg-zinc-700/50 accent-blue-500"
              />
            )}
          </div>
        </div>
        <p className="mt-0.5 truncate text-sm text-zinc-400 duration-200 group-hover:text-zinc-300">
          {setting.description}
        </p>
      </div>
    </motion.div>
  );
};

export const SettingsList = () => {
  const categories = Array.from(new Set(sampleSettings.map(setting => setting.category)));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative"
    >
      <div className="scrollbar max-h-96 overflow-x-hidden overflow-y-auto py-2">
        {categories.map(category => (
          <div key={category} className="mb-4">
            <h2 className="px-6 py-2 text-sm font-medium text-zinc-400">{category}</h2>
            {sampleSettings
              .filter(setting => setting.category === category)
              .map(setting => (
                <SettingItem key={setting.id} setting={setting} />
              ))}
          </div>
        ))}
      </div>
    </motion.div>
  );
};
