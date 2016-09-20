app.controller("Edit",[
  "$scope",
  "APIFactory",
  "$timeout",
  "$location",
  "$uibModal",
  "$rootScope", // need this because the  uib-Modals' scope is not actually nested inside this scope- it's randomly off to one side or something.
  "$routeParams", 
  function($scope, APIFactory, $timeout, $location, $uibModal, $rootScope, $routeParams) {
    const edit = this;

    // Toggle 'edit tag' div.
    edit.tagIsCollapsed=true;

    edit.tags = [];
    edit.costumeelements = [];
    //TODO: also get the costume's elements since they don't load as part of the costume. 

    edit.tag = {
      "name": "", 
      "costumes": [], 
      "costumeelements": []
    };

    edit.costume = {};

    //On load, set costume from route params.
    APIFactory.getOneCostume($routeParams.id)
    .then((res) => {
      console.log("costume gotten", res);
      edit.costume = res;
      $timeout();
    }, e => console.error)
    .then(()=> {
      return APIFactory.getCostumeElements(edit.costume.id);
    }).then((res)=> {
      edit.costumeelements = res;
      $timeout();
    }, e => console.error);

    // On load, also load all tags.
    APIFactory.getTags()
    .then((res)=> {
      edit.tags = res; 
      $timeout();
    }, e => console.error);
    


    //grabs new data from the create modal.
    $rootScope.$on("createdSupply", function(event, value) { 
      console.log("got the newly created supply", value);
      edit.costumeelements.push(value);
      edit.costume.costumeelements.push(value.url);
      $timeout(); //Just in case.
    });

    //grabs updated data from edit modal.
    $rootScope.$on("editedSupply", function(event, value) { 
      console.log("got the edited supply", value);
      //remove old value.
      for(const u in edit.costumeelements) {
        if(edit.costumeelements[u].url === value.url) {
          edit.costumeelements.splice(u, 1);
        }
      } 
      //replace with new value.
      edit.costumeelements.push(value);
      $timeout(); //Just in case.
    });

    edit.addTag = (url) => {
      edit.costume.tags.push(url);
    };

    edit.removeTag = (url) => {
      for(const u in edit.costume.tags) {
        if(edit.costume.tags[u] === url) {
          edit.costume.tags.splice(u, 1);
        }
      }
    };

    edit.createTag = () => {
      APIFactory.createTag(edit.tag).then((res) => {
        edit.tags.push(res);
        edit.costume.tags.push(res.url);
        edit.tagIsCollapsed = true;
        edit.tag.name="";
        $timeout();
      }, e => console.error);
    };
  
    edit.openCreateModal = () => {
      const modalInstance = $uibModal.open({
        size: "lg",
        templateUrl: "/partials/editSupply.html", 
        controller: "CreateSupply",
        controllerAs: "editSupply"   
      });
    }; 


    edit.openEditModal = (supply) => {
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

    edit.deleteSupply = (url) => {
      APIFactory.deleteSomething(url)
      .then(() => {
        // remove from costume
        for (const u in edit.costume.costumeelements) {
          if (edit.costume.costumeelements[u] === url) {
            edit.costume.costumeelements.splice(u, 1);
          }
        }
        // remove from costume element list
        for (const u in edit.costumeelements) {
          if (edit.costumeelements[u].url === url) {
            edit.costumeelements.splice(u, 1);
          }
        }
        $timeout();
      }, e => console.error);
    };

    edit.editCostume = () => {
      APIFactory.editCostume(edit.costume.url, edit.costume)
      .then(()=> {
        console.log("yay, costume edited");
        $location.path("/closet");
      }, e => console.error);
    };

  }]);
