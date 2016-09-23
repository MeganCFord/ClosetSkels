app.factory( "NopeFactory", [  
  "$http",
  "apiUrl",
  function($http, apiUrl) {

    const httpGet = $http.get(apiUrl);

    const getApiRoot = () => {
      return httpGet.then(res => res.data);
    };

    const errorHandle = (e) => {console.log(e);};

    let elementsWeNope=[];
    console.log("nope!", elementsWeNope);

    return {
      AddToNopes: (nopeid) => {
        elementsWeNope.push(nopeid);
        console.log("more nopes!", elementsWeNope);
      }, 

      checkForNopes: (listOfNopeableObjects) => {
        return getApiRoot()
        .then((root) => {
          return $http.get(`${root.nopes}`);
        }, e=> errorHandle)
        .then((res) => {
          elementsWeNope = res.data;
        })
        .then(()=> {
          for(const nopeindex in elementsWeNope) {
            for(const index in listOfNopeableObjects) {
              if (listOfNopeableObjects[index].id === elementsWeNope[nopeindex]) {
                console.log("found a nope");
                listOfNopeableObjects.splice(index, 1);
              } else{
                console.log("no match", listOfNopeableObjects[index].id, elementsWeNope[nopeindex]);
              }
            }
          }
          return listOfNopeableObjects;    
        });

      }
    };

  }]);
