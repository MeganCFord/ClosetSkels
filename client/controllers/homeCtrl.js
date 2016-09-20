
app.controller("Home",[
  "$scope",
  "APIFactory",
  "$timeout",
  function($scope, APIFactory, $timeout) {
    const home = this;
    home.title="home page";
    home.costumes = [];
    home.username="";
    home.userUrl="";

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
      home.costumes = res;
      $timeout();
    }, e=>console.error);

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

  }]);
