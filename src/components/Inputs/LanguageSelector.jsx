import React from "react";
import { IconLanguage } from "@tabler/icons-react";

const LanguageSelector = ({
  selectedLanguage,
  setSelectedLanguage,
  languages,
}) => (
  <span
    className="cursor-pointer rounded-full gap-1 pl-1.5 xs:pl-2 bg-blue-50 flex items-center flex-row border border-blue-200"
  >
    <IconLanguage size={16} className="text-blue-600 flex-shrink-0 w-4 h-4 xs:w-5 xs:h-5" />
    <select
      value={selectedLanguage}
      onChange={(e) => setSelectedLanguage(e.target.value)}
      className="bg-blue-50 flex flex-row rounded-full py-1 px-1 xs:px-1.5 text-xs xs:text-sm sm:text-base text-slate-800 font-roboto font-medium border-none focus:outline-none focus:ring-2 focus:ring-blue-300"
    >
      {languages.map((language) => (
        <option key={language} value={language}>
          {language}
        </option>
      ))}
    </select>
  </span>
);

export default LanguageSelector;
