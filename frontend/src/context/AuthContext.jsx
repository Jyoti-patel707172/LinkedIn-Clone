import React from 'react'
export const authDataContext=React.createContext();


const AuthContext = ({children}) => {
  const serverUrl="https://linkedin-backend-vrmf.onrender.com"
  let value={
           serverUrl
  };
  return (
    
      <authDataContext.Provider value={value}>
      {children}
      </authDataContext.Provider>

  )
}

export default AuthContext
