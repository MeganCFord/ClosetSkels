app.controller("Home",[
  "$scope",
  "APIFactory",
  "CostumeFactory",
  "$timeout",
  "$uibModal",
  function($scope, APIFactory, CostumeFactory, $timeout, $uibModal) {
    const home = this;

    // Set user info via nav data.
    $scope.$on("user", function(event, data) {
      home.user = data; 
      $timeout();
    });

    // Load all (public) costumes.
    CostumeFactory.getPublicCostumes()
    .then((res) => {
      home.costumes = res;
      $timeout();
    }, e=>console.error);

    // Load all elements.
    APIFactory.getElements()
    .then((res)=> {
      home.elements = res;
      $timeout();
    }, e => console.error);

    // Load all tags.
    APIFactory.getTags()
    .then((res)=> {
      home.tags = res; 
      $timeout();
    }, e => console.error);

    
    // Boo functionality
    home.boo = (costume) => {
      // create a boo
      APIFactory.createBoo(home.user.url, costume.url)
      .then((res)=> {
        // add the created boo to the list of costume boos.
        costume.boos.push(res);
        $timeout();
      }, e=>console.error);
    };

    home.unBoo = (costume, boo) => {
      // remove the boo object from the costume list of boos. 
      costume.boos.splice(costume.boos.indexOf(boo), 1);
      // Delete boo via its url property.
      APIFactory.deleteSomething(boo.url);
  
    };

    home.openModal = (costume) => {
    // Opens costume detail modal.
    // Sends the entire object of the costume clicked, 
    // And the user info.
      const modalInstance = $uibModal.open({
        size: "lg",
        templateUrl: "/partials/detail.html", 
        controller: "Detail",
        controllerAs: "detail", 
        resolve: {
          "costume": costume, 
          "user": home.user
        }
      });
    };



    // FILTER FUNCTIONALITY. TODO: completely redo this.
    // tags and supply tags are objects, supply is a url.
    home.filtering = false;
    home.filterer = {"tags": [], "supply": "", "supplytags": []};
    
    home.matches = {};
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

  }]);
