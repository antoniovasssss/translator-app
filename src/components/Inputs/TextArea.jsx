import React from "react";

const TextArea = ({ id, value, onChange, placeholder }) => (
  <textarea
    rows={4}
    id={id}
    className="py-2 xs:py-2.5 sm:py-3 px-2 xs:px-3 sm:px-4 border-none focus:outline-none block w-full border-transparent rounded-lg bg-white text-xs xs:text-sm sm:text-base text-slate-800 placeholder-slate-400 font-roboto resize-none focus:ring-2 focus:ring-blue-300"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
  />
);

export default TextArea;
