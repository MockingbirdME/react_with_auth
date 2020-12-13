import React, {useState, useEffect} from "react";

const UserContext = React.createContext();

export default UserContext;

export const UserContextProvider = props => {
  const [user, setUser] = useState({});

  const loadUser = async () => {
    const response = await fetch('api/v1/user/me');
    const body = await response.json();
    if (response.status !== 200) {
      console.log(response.status);
      return setUser({loggedIn: false});
    }

    setUser(body);
  };

  useEffect(() => {
    loadUser();
  }, []);


  return <UserContext.Provider value={{
    user
  }}>{props.children}</UserContext.Provider>;
};
