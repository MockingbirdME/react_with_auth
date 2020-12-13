import React, {useState, useEffect} from "react";

const UserContext = React.createContext();

export default UserContext;

export const UserContextProvider = props => {
  const [user, setUser] = useState({});

  const loadUser = async () => {
    const response = await fetch('api/v1/user/me');
    console.log(response);
    const body = await response.json();
    console.log(body);
    if (response.status !== 200) {
      throw Error(body.message);
    }
    console.log(body);
    setUser(body.Users);
  };

  useEffect(() => {
    loadUser();
  }, []);


  return <UserContext.Provider value={{
    user
  }}>{props.children}</UserContext.Provider>;
};
