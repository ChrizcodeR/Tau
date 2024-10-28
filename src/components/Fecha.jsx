import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const Clock = () => {
  const now = new Date();
  const formattedDate = format(now, 'dd/MM/yyyy');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Actualiza cada segundo

    return () => clearInterval(timer); // Limpia el intervalo al desmontar el componente
  }, []);

  return (
    <div style={{ fontSize: '30px', fontWeight: 'bold' }}>
      {formattedDate}&nbsp;&nbsp;{format(currentTime, 'HH:mm:ss')}
    </div>
  );
};

export default Clock;
