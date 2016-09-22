
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
            if(costume.tags[s].name === home.filterer.tags[t].name) {
              if (home.matches[costume.name] != undefined) {
                home.matches[costume.name].matches.push(home.filterer.tags[t].name);
                console.log("matches!!", home.matches);
              } else {
                home.matches[costume.name] = {};
                home.matches[costume.name].matches = [];
                home.matches[costume.name].object = costume;
                home.matches[costume.name].matches.push(home.filterer.tags[t].name);
                console.log("matches!!", home.matches);
              }
            } else {
              console.log("no match, matches", home.matches);
            }
          } //for
        } //for
      } else {
        console.log("no tags selected.");
      }
    };
    
    home.checkForSupply = (costume) => {
      if (home.filterer.supply.length > 0) {
        for (const s in costume.costumeelements) {
          if (costume.costumeelements[s] === home.filterer.supply) {
            console.log("supply tag match", costume.costumeelements[s], home.filterer.supply);
            for(s in home.supplies) {
              if(home.supplies[s].url === home.filterer.supply) {
                console.log("supply name", home.supplies[s].name);
                if (home.matches[costume.name] != undefined) {
                  home.matches[costume.name].matches.push(home.supplies[s].name);
                  console.log("matches!", home.matches);
                } else {
                  home.matches[costume.name] = {};
                  home.matches[costume.name].matches = [];
                  home.matches[costume.name].object = costume;
                  home.matches[costume.name].matches.push(home.supplies[s].name);
                  console.log("matches!", home.matches);
                }
              }
            }
          } else {
        console.log("no supply tag match, matches:", home.matches);
          }
        } 
      } else {
        console.log("no supply selected.");
      }  
    };
    

    home.checkForSupplyTags = (costume) => {
      if(home.filterer.supplytags.length > 0) {
        let supplies = [];
        APIFactory.getCostumeElements(costume.id)
        .then((res)=> {
          supplies = res;
          console.log("supplies for costume", supplies);
          for(const u in supplies) {
            for (const p in home.filterer.supplytags) {
              if (supplies[u].name === home.filterer.supplytags[p].name) {
                console.log("supply tag match", supplies[u].name, home.filterer.supplytags[p].name);
                if (home.matches[costume.name] != undefined) {
                  home.matches[costume.name].matches.push(home.filterer.supplytags[u]);
                  console.log(home.matches, "matches");
                } else {
                  home.matches[costume.name] = {};
                  home.matches[costume.name].matches = [];
                  home.matches[costume.name].object = costume;
                  home.matches[costume.name].matches.push(`Supply: ${home.filterer.supplytags[u].name}`);
                  console.log(home.matches, "matches");
                }
              } else {
                console.log("no supply tag match, matches:", home.matches);
              }
            }
          }
        }, e => console.error);
      } else {
        // console.log("no supply tags selected.");
      }  
    };


    home.applyFilter = () => {
      home.matches = {};
      home.filtering = true;
      home.costumes.forEach((costume) => {
        home.checkForTags(costume);
        home.checkForSupply(costume);
        home.checkForSupplyTags(costume);
      });
      console.log("final matches", home.matches);
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
