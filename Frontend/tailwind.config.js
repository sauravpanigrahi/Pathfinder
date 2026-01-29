/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  safelist: [
    // background colors
    'bg-blue-50','bg-red-50','bg-green-50','bg-purple-50','bg-indigo-50',
    'bg-orange-50','bg-yellow-50','bg-pink-50','bg-cyan-50','bg-sky-50',
    'bg-emerald-50','bg-violet-50','bg-amber-50','bg-teal-50',

    // text colors
    'text-blue-700','text-red-700','text-green-700','text-purple-700',
    'text-indigo-700','text-orange-700','text-yellow-700','text-pink-700',
    'text-cyan-700','text-sky-700','text-emerald-700','text-violet-700',
    'text-amber-700','text-teal-700',

    // border colors
    'border-blue-200','border-red-200','border-green-200','border-purple-200',
    'border-indigo-200','border-orange-200','border-yellow-200','border-pink-200',
    'border-cyan-200','border-sky-200','border-emerald-200','border-violet-200',
    'border-amber-200','border-teal-200',
  ],

  theme: {
    extend: {},
  },
};
