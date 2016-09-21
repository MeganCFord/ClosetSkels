
app.filter('unique', function() {
  return function(array, valueToCheck) {
    const output = [], 
        keys = [];

    angular.forEach(array, function(item) {
      const key = item[valueToCheck];
      if(keys.indexOf(key) === -1) {
        keys.push(key);
        output.push(item);
      }
    });
    return output;
  };
});

app.controller("Home",[
  "$scope",
  "APIFactory",
  "$timeout",
  function($scope, APIFactory, $timeout) {
    const home = this;
    home.title="home page";
    home.allCostumes = [];
    //Filtered costumes.
    home.costumes = [];
    home.username="";
    home.userUrl="";

    home.search = "";
    // tags and supply tags are objects, supply is a url.
    home.filterer = {"tags": [], "supply": "", "supplytags": []};
    home.tags = [];
    home.supplies = []; 
    

    // assign the username for DOM, get the user URL for passing to boos.
    $scope.$on("username", function(event, data) {
      $timeout().then(() => {
        home.username = data; 
        return data;
      }).then(() => {
        return APIFactory.getUserInfo(home.username);
      }).then((res) => {
        home.userUrl = res.url; 
        $timeout();
      }, e=> console.error);
    });

    // Load costumes.
    APIFactory.getCostumes()
    .then((res) => {
      home.allCostumes = res;
      home.costumes = res;
      $timeout();
    }, e=>console.error);

    // Load all supplies.
    APIFactory.getCostumeElements()
    .then((res)=> {
      home.supplies = res;
      $timeout();
    }, e => console.error);

    // Load all tags.
    APIFactory.getTags()
    .then((res)=> {
      home.tags = res; 
      $timeout();
    }, e => console.error);
    


    // Checks each costume list of boos to return true if the user has bood, which will show/hide the 'boo' button as needed.
    home.hasUserBood = (costumeBoos) => {
      let userBoo = false;
      for (const index in costumeBoos) {
        if (costumeBoos[index].owner==home.userUrl) {
          userBoo= true;
          break;
        }
      }
      return userBoo;
    };

    // Boo functionality
    home.boo = (costumeurl) => {
      APIFactory.addBoo(home.userUrl, costumeurl)
      .then(()=> {
        return APIFactory.getCostumes();
      }, e=>console.error)
      .then((res) => {
        home.costumes = res;
        $timeout();
      }, e=>console.error);
    };
    home.unBoo = (boourl) => {
      APIFactory.deleteBoo(boourl)
      .then(() => {
        return APIFactory.getCostumes();
      }, e=>console.error)
      .then((res)=> {
        home.costumes=res;
        $timeout();
      }, e=> console.error);
    };

    home.addTag = (tag) => {
      home.filterer.tags.push(tag);
    };

    home.removeTag = (tag) => {
      for(const u in home.filterer.tags) {
        if(home.filterer.tags[u] === tag) {
          home.filterer.tags.splice(u, 1);
        }
      }
    };

    home.addSupplyTag = (tag) => {
      home.filterer.supplytags.push(tag);
    };

    home.removeSupplyTag = (tag) => {
      for(const u in home.filterer.supplytags) {
        if(home.filterer.supplytags[u] === tag) {
          home.filterer.supplytags.splice(u, 1);
        }
      }
    };

    home.applyFilter = () => {
      home.costumes = [];
      home.allCostumes.forEach((costume)=> {
        // tag: full object.
        if(home.filterer.tags.length > 0) {
          for(const u in home.filterer.tags) {
            for (const p in costume.tags) {
              if (home.filterer.tags[u].name === costume.tags[p].name) {
              console.log("tag match", home.filterer.tags[u].name, costume.tags[p].name, home.costumes);
              home.costumes.push(costume); 
              } else {
                console.log("no match, costumes should remain the same", home.costumes.length);
              } 
            }
          }
        }
        console.log("here should be the list of matches", home.costumes);
        // supply: url
        if(home.filterer.supply !== "") {
            if(costume.supplies.includes(home.filterer.supply)) {
              // supply tag: full object.
              if(home.filterer.supplytags.length > 0) {
                let supplies = [];
                APIFactory.getCostumeElements(costume.id)
                .then((res)=> {
                  supplies = res;
                  supplies.forEach((supply) => {
                    for(const u in home.filterer.supplytags) {
                      if(supply.tags.includes(home.filterer.supplytags[u])) {
                        console.log("supply tag match");
                        home.tempCostumes.push(costume);
                      }
                    }
                  });
                });
              } else {
                console.log('supply match');
                home.tempCostumes.push(costume);
              }
            }
        }
      });
    };

    home.resetFilter = () => {
      home.filterer = {"tags": [], "supply": "", "supplytags": []};
      home.costumes = home.allCostumes;
      $timeout();
    };

  }]);
