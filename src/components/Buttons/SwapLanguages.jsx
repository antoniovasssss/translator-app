import React from "react";
import { IconArrowLeftRight } from "@tabler/icons-react";

const SwapLanguages = ({ onSwap }) => (
  <button
    onClick={onSwap}
    className="p-2 rounded-full hover:bg-blue-100 transition-colors duration-200 hover:scale-110 transform"
    title="Swap source and target languages"
    aria-label="Swap languages"
  >
    <IconArrowLeftRight size={22} className="text-blue-600 hover:text-orange-600" />
  </button>
);

export default SwapLanguages;
