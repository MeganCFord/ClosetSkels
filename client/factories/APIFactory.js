app.factory( "APIFactory", [ 
  "$http", 
  "apiUrl", 
  function($http, apiUrl) {

    const httpGet = $http.get(apiUrl);

    const getApiRoot = () => {
      return httpGet.then(res => res.data);
    };

    return {
      getCostumes: () => {
        return getApiRoot()
        .then((root) => {
          return $http.get(`${root.costumes}`);
        }, e => console.error)
        .then((res) => {
          return res.data;
        }, e => console.error);
      }, 
      getUserCostumes: (username) => {
        return getApiRoot()
          .then((root) => {
            return $http.get(`${root.users}?username=${username}`);
          }, (e) => console.log(e))
          .then((res) => {
            // returns in a list since queries return filtered lists. in this case, there will be just one match since Django requires unique usernames in its User model.
            return res.data[0].costumes;
          }, e => console.error);
      }, 
      getTags: () => {
        return getApiRoot()
        .then((root) => {
          return $http.get(`${root.tags}`);
        }, e => console.error)
        .then((res)=> {
          return res.data;
        }, e => console.error);
      },
      createTag: (data) => {
        return getApiRoot()
          .then((root) => {
            return $http.post(`${root.tags}`, data);
          }, e => console.error);
          // .then((res) => {
          //   console.log(res.data);
          // });
      }, 
      getElements: () => {
        return getApiRoot()
        .then((root) => {
          return $http.get(`${root.elements}`);
        }, e => console.error)
        .then((res)=> {
          return res.data;
        }, e => console.error);
      },
      createElement: (data) => {
        return getApiRoot()
          .then((root) => {
            return $http.post(`${root.elements}`, data);
          }, e => console.error);
          // .then((res) => {
          //   console.log(res.data);
          // });
      }
    };  
  }]);
