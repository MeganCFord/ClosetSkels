app.controller("Create",[
  "$scope",
  "APIFactory",
  "$timeout",
  "$location",
  "$uibModal",
  "$rootScope", // need this because the  uib-Modal scope is not actually nested inside this scope- it's randomly off to one corner or whatever.
  function($scope, APIFactory, $timeout, $location, $uibModal, $rootScope) {
    const create = this;
    create.title="create page";

    // Toggle 'create tag' div.
    create.tagIsCollapsed=true;

    create.tags = [];
    create.costumeelements = [];

    create.tag = {
      "name": "", 
      "costumes": [], 
      "costumeelements": []
    };

    create.costume = {
      "name": "",
      "description": "", 
      "public": false, 
      "owner": "" ,
      "costumeelements": [], 
      "tags": [], 
      "boos": []
    };

    // On load, get the username and user info. 
    $scope.$on("username", function(event, data) {
      $timeout().then(() => {
        create.username = data; 
        return data;
      }).then(() => {
        return APIFactory.getUserInfo(create.username);
      }).then((res) => {
        create.userInfo = res; 
        create.costume.owner = create.userInfo.url;
        $timeout();
      }, e=> console.error);
    });

    // On load, also load all tags.
    APIFactory.getTags()
    .then((res)=> {
      create.tags = res; 
      $timeout();
    }, e => console.error);

    // In case of refresh. Gets all costume elements with no costume url assigned (meaning the costume has not been completed) and pushes their urls back into the costume object.
    APIFactory.getCostumeElements()
    .then((res) => {
      create.costumeelements = res;
      for(const index in create.costumeelements) {
        create.costume.costumeelements.push(create.costumeelements[index].url);
      }
      $timeout();
    }, e => console.error);

    //grabs new data from the create modal.
    $rootScope.$on("createdSupply", function(event, value) { 
      console.log("got the newly created supply", value);
      create.costumeelements.push(value);
      create.costume.costumeelements.push(value.url);
      $timeout(); //Just in case.
    });

    //grabs updated data from edit modal.
    $rootScope.$on("editedSupply", function(event, value) { 
      console.log("got the edited supply", value);
      //remove old value.
      for(const u in create.costumeelements) {
        if(create.costumeelements[u].url === value.url) {
          create.costumeelements.splice(u, 1);
        }
      } 
      //replace with new value.
      create.costumeelements.push(value);
      $timeout(); //Just in case.
    });

    create.addTag = (url) => {
      create.costume.tags.push(url);
    };

    create.removeTag = (url) => {
      for(const u in create.costume.tags) {
        if(create.costume.tags[u] === url) {
          create.costume.tags.splice(u, 1);
        }
      }
    };

    create.createTag = () => {
      APIFactory.createTag(create.tag).then((res) => {
        create.tags.push(res);
        create.costume.tags.push(res.url);
        create.tagIsCollapsed = true;
        create.tag.name="";
        $timeout();
      }, e => console.error);
    };


    create.openCreateModal = () => {
      const modalInstance = $uibModal.open({
        size: "lg",
        templateUrl: "/partials/createSupply.html", 
        controller: "CreateSupply",
        controllerAs: "createSupply"   
      });
    }; 


    create.openEditModal = (supply) => {
      //Sending the entire object into modal.
      const modalInstance = $uibModal.open({
        size: "lg",
        templateUrl: "/partials/editSupply.html", 
        controller: "EditSupply",
        controllerAs: "editSupply", 
        resolve: {
          "supply": supply
        }
      });
    };

    create.deleteSupply = (url) => {
      APIFactory.deleteSomething(url)
      .then(() => {
        // remove from costume
        for (const u in create.costume.costumeelements) {
          if (create.costume.costumeelements[u] === url) {
            create.costume.costumeelements.splice(u, 1);
          }
        }
        // remove from costume element list
        for (const u in create.costumeelements) {
          if (create.costumeelements[u].url === url) {
            create.costumeelements.splice(u, 1);
          }
        }
        $timeout();
      }, e => console.error);
    };

    create.createCostume = () => {
      APIFactory.createCostume(create.costume).then((res)=> {
        console.log(res);
        // TODO: pop up with a success modal or something for a second. 
        $location.path("/closet");
      });
    };
  }]);
