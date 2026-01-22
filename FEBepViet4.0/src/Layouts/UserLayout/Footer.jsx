import React from "react";
import useAppSetting from "../../hooks/useAppSetting";

const API_HOST = "http://127.0.0.1:8000";
const Footer = () => {
  const setting = useAppSetting();

  return (
    <footer className="bg-white border-t border-gray-100 py-6 mt-12 shadow-inner">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-orange-600 font-bold text-lg">
          <span><img
            src={setting?.logo ? `${API_HOST}/storage/${setting.logo}` : "/img/logo.png"}
            alt="logo"
            className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
          />
        </span> {"Bếp Việt 4.0"}
        </div>

        <div className="text-gray-500 text-sm text-center md:text-right">
          {setting?.footer || `© ${new Date().getFullYear()} Bếp Việt 4.0. All rights reserved.`}
          <br />
          {setting?.gmail || "support@gmail.com"} • {setting?.phone || "0909xxxxxx"}
        </div>

        <div className="flex gap-3">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-orange-600"
          >
            {/* icon fb giữ nguyên */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M22.675 0h-21.35C.6 0 0 .6 0 1.326v21.348C0 23.4.6 24 1.326 24H12.82v-9.294H9.692V11.01h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.696h-3.12V24h6.116C23.4 24 24 23.4 24 22.674V1.326C24 .6 23.4 0 22.675 0" />
            </svg>
          </a>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-orange-600"
          >
            {/* icon ig giữ nguyên */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.974 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.974-1.246-2.242-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.516 2.497 5.784 2.226 7.15 2.163 8.416 2.105 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.771.131 4.659.396 3.678 1.378c-.982.982-1.247 2.093-1.306 3.374C2.013 5.741 2 6.151 2 12c0 5.849.013 6.259.072 7.548.059 1.281.324 2.392 1.306 3.374.981.982 2.093 1.247 3.374 1.306C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.281-.059 2.393-.324 3.374-1.306.982-.982 1.247-2.093 1.306-3.374.059-1.289.072-1.699.072-7.548 0-5.849-.013-6.259-.072-7.548-.059-1.281-.324-2.392-1.306-3.374-.981-.982-2.093-1.247-3.374-1.306C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
