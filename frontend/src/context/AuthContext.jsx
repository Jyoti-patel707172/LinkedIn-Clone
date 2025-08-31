import React from 'react'
export const authDataContext=React.createContext();


const AuthContext = ({children}) => {
  const serverUrl="http://localhost:8000"
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