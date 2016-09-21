app.factory( "APIFactory", [ 
  "$http", 
  "apiUrl", 
  function($http, apiUrl) {

    const httpGet = $http.get(apiUrl);

    const getApiRoot = () => {
      return httpGet.then(res => res.data);
    };

    const errorHandle = (e) => {console.log(e);};

    const getUser = (username) => {
      return getApiRoot().then((root) => {
        return $http.get(`${root.users}?username=${username}`);
      }, errorHandle)
      .then((res) => {
        return res.data;
      }, errorHandle);
    };

    return {
  
      //// USERS ////

      getUserInfo: (username) => {
        return getUser(username)
        .then((res) => {
          return res[0];
        }, errorHandle);
      },
      getUserCostumes: (username) => {
        return getUser(username)
        .then((res) => {
          // returns in a list since queries return filtered lists. in this case, there will be just one match since Django requires unique usernames in its User model.
          return res[0].costumes;
        }, errorHandle);
      },

      //// BOOS ////
      
      getUserBoos: (id) => {
        console.log("user id I'm going to send for boos", id);
        return getApiRoot()
        .then((root)=> {
          return $http.get(`${root.boos}?userid=${id}`);
        }, errorHandle)
        .then((res) => {
          return res.data;
        });
      },
      addBoo: (userUrl, costumeUrl) => {
        return getApiRoot()
        .then((root)=> {
          return $http.post(`${root.boos}`, {"owner": userUrl, "costume": costumeUrl});
        }, errorHandle)
        .then((res) => res.data, errorHandle);
      }, 
      deleteBoo: (booUrl) => {
        return $http.delete(`${booUrl}`)
        .then(()=> true, errorHandle);
      },

      //// TAGS ////
  
      getTags: () => {
        return getApiRoot()
        .then((root) => {
          return $http.get(`${root.tags}`);
        }, errorHandle)
        .then((res)=> {
          return res.data;
        }, errorHandle);
      },
      createTag: (data) => {
        return getApiRoot()
        .then((root) => {
          return $http.post(`${root.tags}`, data);
        }, errorHandle)
        .then((res) => res.data);
      }, 


      //// ELEMENTS ////
    
      getElements: () => {
        return getApiRoot()
        .then((root) => {
          return $http.get(`${root.elements}`);
        }, errorHandle)
        .then((res)=> {
          return res.data;
        }, errorHandle);
      },
      createElement: (data) => {
        return getApiRoot()
        .then((root) => {
          return $http.post(`${root.elements}`, data);
        }, errorHandle)
        .then((res)=> res.data);
      }, 

      //// COSTUMES ////

      getCostumes: () => {
        return getApiRoot()
        .then((root) => {
          return $http.get(`${root.costumes}?public=true`);
        }, errorHandle)
        .then((res) => {
          return res.data;
        }, errorHandle);
      }, 
      getOneCostume: (id) => {
        return getApiRoot()
        .then((root) => {
          return $http.get(`${root.costumes}?costumeid=${id}`);
        }, errorHandle)
        .then((res)=> {
          return res.data[0];
        }, errorHandle);
      },
      createCostume: (data) => {
        return getApiRoot()
        .then((root) => {
          return $http.post(`${root.costumes}`, data);
        }, errorHandle)
        .then(()=> true, errorHandle);
      },
      updateCostume: (data) => {
        console.log(data);
      }, 
      deleteCostume: (costumeurl) => {
        return $http.delete(`${costumeurl}`)
        .then(() => true, errorHandle);
      }, 

      //// COSTUME ELEMENTS ////

      createCostumeElement: (data) => {
        return getApiRoot()
        .then((root) => {
          return $http.post(`${root.costumeelements}`, data);
        }, errorHandle)
        .then((res) => res.data);
      }, 
      getCostumeElements: (costume = null) => {
        return getApiRoot()
        .then((root) => {
          if (costume===null) {
            return $http.get(`${root.costumeelements}`);
          } else {
            return $http.get(`${root.costumeelements}?costume=${costume}`);
          }
        }, errorHandle)
        .then((res)=> res.data);
      }, 
      editCostumeElement: (data) => {
        return $http.put(`${data.url}`, data)
        .then((res) => {
          return res.data;
        }, errorHandle);
      }, 

      // DELETING THE THINGS!
  
      deleteSomething: (url) => {
        return $http.delete(`${url}`);
      }
    }; 


  }]);
