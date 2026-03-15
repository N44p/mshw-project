"use client"
import { PrayerTimeBox } from "../prayer/ui/PrayerTimeBox";

const PrayerGrid = ({ times, nextPrayerName, labels }: any) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
    {times && Object.entries(times).map(([key, val]: any) => (
      <PrayerTimeBox 
        key={key}
        label={labels[key]}
        time={val}
        isActive={nextPrayerName === key}
      />
    ))}
  </div>
);

export default PrayerGrid; 