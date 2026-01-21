import { createContext, useContext, useState } from "react";

const AppContext = createContext({ resume: null, setResume: () => {} }); // safe default

export const AppProvider = ({ children }) => {
  const [resume, setResume] = useState(null); // or false if you want boolean
  return (
    <AppContext.Provider value={{ resume, setResume }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
