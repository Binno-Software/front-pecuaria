import { useState, useEffect } from 'react';
import api from 'src/service/api';

function useEnums() {
  const [enums, setEnums] = useState([]);
  const [loadingEnum, setLoading] = useState(true);

  useEffect(() => {
    api.get('enums').then((response) => {
      setEnums(response.data);
      setLoading(false);
    });
  }, []);

  const getGroupEnum = (group) => {
    return enums[group];
  };

  return [{ loadingEnum }, getGroupEnum];
}

export default useEnums;
