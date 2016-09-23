
app.controller("Home",[
  "$scope",
  "APIFactory",
  "$timeout",
  "$uibModal",
  function($scope, APIFactory, $timeout, $uibModal) {
    const home = this;
    home.title="home page";
    //Filtered costumes.
    home.costumes = [];
    home.username="";
    home.userInfo={};

    home.search = "";
    // tags and supply tags are objects, supply is a url.
    home.filtering = false;
    home.filterer = {"tags": [], "supply": "", "supplytags": []};
    home.tags = [];
    home.supplies = []; 
    
    home.matches = {};

    // assign the username for DOM, get the user URL for passing to boos.
    $scope.$on("username", function(event, data) {
      $timeout().then(() => {
        home.username = data; 
        return data;
      }).then(() => {
        return APIFactory.getUserInfo(home.username);
      }).then((res) => {
        home.userInfo = res; 
        $timeout();
      }, e=> console.error);
    });

    // Load costumes.
    APIFactory.getCostumes()
    .then((res) => {
      home.costumes = res;
      $timeout();
    }, e=>console.error);

    // Load all supplies.
    APIFactory.getElements()
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
        if (costumeBoos[index].owner==home.userInfo.url) {
          userBoo= true;
          break;
        }
      }
      return userBoo;
    };

    // Boo functionality
    home.boo = (costumeurl) => {
      APIFactory.addBoo(home.userInfo.url, costumeurl)
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
    
    home.checkForTags = (costume) => {
      if(home.filterer.tags.length > 0) {
        for(const s in costume.tags) {
          for(const t in home.filterer.tags) {
            if(costume.tags[s].url === home.filterer.tags[t].url) {
              console.log("match", costume.tags[s].url, home.filterer.tags[t].url)
              if (home.matches[costume.name] != undefined) {
                home.matches[costume.name].matches.push(home.filterer.tags[t].name);
              } else {
                home.matches[costume.name] = {};
                home.matches[costume.name].matches = [];
                home.matches[costume.name].object = costume;
                home.matches[costume.name].matches.push(home.filterer.tags[t].name);
              }
            } else {
              console.log("no match, ", costume.tags[s].name, home.filterer.tags[t].name);
            }
          } //for
        } //for
      } console.log("tag matches", home.matches)
      return home.matches;
    };
    
    home.checkForSupply = (costume) => {
      if (home.filterer.supply.length > 0) {
        // Supply to check for is a url.
        APIFactory.getCostumeElements(costume.id).then((res) => {
          const supplies = res;
          return supplies;
        }, e=> console.error)
        .then((supplies) => {
          for (const s in supplies) {
            if (supplies[s].element.url === home.filterer.supply) {
              if (home.matches[costume.name] != undefined) {
                home.matches[costume.name].matches.push(supplies[s].element.name);
              } else {
                home.matches[costume.name] = {};
                home.matches[costume.name].matches = [];
                home.matches[costume.name].object = costume;
                home.matches[costume.name].matches.push(supplies[s].element.name);
              }
            }
          } 
        }).then(()=> {
          $timeout();
        });
      } console.log("matches", home.matches);
        return home.matches;
    };


    home.checkForSupplyTags = (costume) => {
      if(home.filterer.supplytags.length > 0) {
        console.log("supply tags", home.filterer.supplytags);
        APIFactory.getCostumeElements(costume.id).then((res) => {
          const supplies = res;
          return supplies;
        }, e=> console.error)
        .then((supplies) => {
          for (const s in supplies) {
            for(const u in home.filterer.supplytags){
              for(const v in home.filterer.supplytags[u].costumeelements){
                if (home.filterer.supplytags[u].costumeelements[v] === supplies[s].url) {
                  if (home.matches[costume.name] != undefined) {
                    home.matches[costume.name].matches.push(`${home.filterer.supplytags[u].name} ${supplies[s].element.name}`);
                  } else {
                    home.matches[costume.name] = {};
                    home.matches[costume.name].matches = [];
                    home.matches[costume.name].object = costume;
                    home.matches[costume.name].matches.push(`${home.filterer.supplytags[u].name} ${supplies[s].element.name}`);
                  }
                }
              }
            }
          } 
        }).then(()=> {
          $timeout();
        });
      }  
    };


    home.applyFilter = () => {
      home.matches = {};
      home.filtering = true;
      home.costumes.forEach((costume) => {
        $timeout().then(() => {
          return home.checkForTags(costume);
        }).then(()=> {
          return home.checkForSupply(costume);
        }).then(()=> {
          return home.checkForSupplyTags(costume);
        }).then(()=> {
          $timeout();
        });
      });
    };

    home.resetFilter = () => {
      home.filterer = {"tags": [], "supply": "", "supplytags": []};
      home.matches = [];
      home.filtering = false;
      $timeout();
    };

    home.openModal = (costume) => {
      console.log("costume I'm sending", costume);
    //Sending the entire object into modal.
      const modalInstance = $uibModal.open({
        size: "lg",
        templateUrl: "/partials/detail.html", 
        controller: "Detail",
        controllerAs: "detail", 
        resolve: {
          "costume": costume, 
          "userInfo": home.userInfo
        }
      });
    };

  }]);
