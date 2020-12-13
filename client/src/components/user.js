import React, { useContext, useEffect, useState } from "react";
import UserContext from "../contexts/user";


const User = props => {
  const userContext = useContext(UserContext);
  const {user} = userContext;
  if (!user || !user.name) return <div></div>;

  return (
    <div className="user_container">
      <h1>Welcome {user.name}</h1>
    </div>
  );
};

export default User;
