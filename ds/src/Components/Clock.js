import React, { useState, useEffect } from "react";

function Clock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const timeString = `${currentTime.getFullYear()}년 ${currentTime.getMonth() + 1}월 ${currentTime.getDate()}일
    ${currentTime.getHours()}시 ${currentTime.getMinutes()}분 ${currentTime.getSeconds()}초`;

  return (
    <div className="clock-wrapper">
      <div className="clock" style={{ textAlign: 'center', marginTop: '10px', fontSize: '24px' }}>
        {timeString}
      </div>
    </div>
  );
}

export default Clock;
