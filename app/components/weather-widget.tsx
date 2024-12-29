import React from "react";
import styles from "./weather-widget.module.css";

const WeatherWidget = ({
  location = "V1.1.0 نسخه",
  temperature ="دستیار سلامت پزشک و شهروند",
  conditions = "سامانه ارزیابی هوشمند علایم و تشخیص بیمار",
  conditionss = "تفسیر هوشمند نتایج ازمایش و تحلیل تصاویر رادیولوژی",
  isEmpty = false,
}) => {
  const conditionClassMap = {
    Cloudy: styles.weatherBGCloudy,
    Sunny: styles.weatherBGSunny,
    Rainy: styles.weatherBGRainy,
    Snowy: styles.weatherBGSnowy,
    Windy: styles.weatherBGWindy,
  };

  if (isEmpty) {
    return (
      <div className={`${styles.weatherWidget} ${styles.weatherEmptyState}`}>
        <div className={styles.weatherWidgetData}>
          {/* <p>Enter a diagnosis to see local images</p> */}
          {/* <p>try: what's the weather like in Berkeley?</p> */}
        </div>
      </div>
    );
  }

  const weatherClass = `${styles.weatherWidget} ${conditionClassMap[conditions] || styles.weatherBGSunny
    }`;

  return (
    <div className={weatherClass}>
      <div className={styles.weatherWidgetData}>
        
        {/* <h2>{temperature !== "---" ? `${temperature}` : temperature}</h2> */}
        <p>{temperature}</p>
        <p>{conditions}</p>
        <p>{conditionss}</p>
        <p>{location}</p>
      </div>
    </div>
  );
};

export default WeatherWidget;
