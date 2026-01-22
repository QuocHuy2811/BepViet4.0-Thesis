import { useEffect, useState } from "react";
import { getSetting } from "../services/settingService";

export default function useAppSetting() {
  const [setting, setSetting] = useState(null);

  useEffect(() => {
    
    const cached = localStorage.getItem("app_settings");
    if (cached) {
      setSetting(JSON.parse(cached));
    }

    getSetting()
      .then((data) => {
        setSetting(data);
        localStorage.setItem("app_settings", JSON.stringify(data));
        
      })
      .catch(() => {});
  }, []);

  return setting;
}
