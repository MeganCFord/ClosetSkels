app.factory( "AuthFactory", function() {
  
  let encodedUserCredentials = "";
  let decodedUserCredentials = {"username": "", "password": ""};

  return {
    encodeCredentials: (creds) => {
      decodedUserCredentials = creds;
      encodedUserCredentials = window.btoa(`${creds.username}:${creds.password}`);
    },
    getEncodedCredentials: () => {
      return encodedUserCredentials;
    },
    decodeCredentials: (encoded) => {
      encodedUserCredentials = encoded;
      const decoded = window.atob(encoded).split(":");
      decodedUserCredentials.username = decoded[0];
      decodedUserCredentials.password = decoded[1];
    }, 
    getDecodedCredentials: () => {
      return decodedUserCredentials.username;
    }
  };
});
