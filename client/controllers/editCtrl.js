app.controller("Edit",[
  "$scope",
  "APIFactory",
  "$timeout",
  "$location",
  "$uibModal",
  "$rootScope", // need this because the  uib-Modals' scope is not actually nested inside this scope- it's randomly off to one side or something.
  "$routeParams", 
  function($scope, APIFactory, $timeout, $location, $uibModal, $rootScope, $routeParams) {
    const create = this;

    create.title="Edit Costume";

    // Toggle 'create tag' div.
    create.tagIsCollapsed=true;
    create.deleteButton="Delete";

    create.tags = [];
    create.costumeelements = [];

    create.tag = {
      "name": "", 
      "costumes": [], 
      "costumeelements": []
    };

    create.costume = {};

    //On load, set costume from route params.
    APIFactory.getOneCostume($routeParams.id)
    .then((res) => {
      // console.log("costume gotten", res);
      create.costume = res;
      $timeout();
    }, e => console.error)
    .then(()=> {
      // Also get all costume elements since only the URLs are saved on the costume.
      return APIFactory.getCostumeElements(create.costume.id);
    }).then((res)=> {
      create.costumeelements = res;
      $timeout();
    }, e => console.error);

    // On load, also load all tags.
    APIFactory.getTags()
    .then((res)=> {
      create.tags = res;
      $timeout();
    }, e => console.error)
    .then(()=> {
      const actualtags = [];
      for (const p in create.tags) {
        for (const u in create.costume.tags) {
          if (create.tags[p].name == create.costume.tags[u].name) {
            actualtags.push(create.tags[p]);
          }
        }
      }
      create.costume.tags = actualtags;
    });
    


    //grabs new data from the create modal.
    $rootScope.$on("createdSupply", function(event, value) { 
      create.costume.costumeelements.push(value.id);
      create.costumeelements.push(value);
      $timeout(); //Just in case.
    });

    //grabs updated data from edit modal.
    $rootScope.$on("editedSupply", function(event, value) { 
      console.log("got the edited supply", value);
      //remove old value.
      for(const u in create.costumeelements) {
        if(create.costumeelements[u].id === value.id) {
          create.costumeelements.splice(u, 1);
        }
      } 
      //replace with new value.
      create.costumeelements.push(value);
      $timeout(); //Just in case.
    });

    create.addTag = (tag) => {
      create.costume.tags.push(tag);
    };

    create.removeTag = (tag) => {
      for(const u in create.costume.tags) {
        if(create.costume.tags[u] === tag) {
          create.costume.tags.splice(u, 1);
        }
      }
    };

    create.createTag = () => {
      APIFactory.createTag(create.tag).then((res) => {
        create.tags.push(res);
        create.costume.tags.push(res);
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
        controllerAs: "createSupply",
        resolve: {
          "supply": null
        }   
      });
    }; 


    create.openEditModal = (supply) => {
      //Sending the entire object into modal.
      const modalInstance = $uibModal.open({
        size: "lg",
        templateUrl: "/partials/createSupply.html", 
        controller: "CreateSupply",
        controllerAs: "createSupply", 
        resolve: {
          "supply": supply
        }
      });
    };

    create.deleteSupply = (object) => {
      APIFactory.deleteSomething(object.url)
      .then(() => {
        // remove from costume
        for (const u in create.costume.costumeelements) {
          if (create.costume.costumeelements[u] === object.id) {
            create.costume.costumeelements.splice(u, 1);
          }
        }
        // remove from costume element list
        for (const u in create.costumeelements) {
          if (create.costumeelements[u] === object) {
            create.costumeelements.splice(u, 1);
          }
        }
        $timeout();
      }, e => console.error);
    };

    create.createCostume = () => {
      const tagIds = [];
      for(const index in create.costume.tags) {
        tagIds.push(create.costume.tags[index].id);
      }
      create.costume.tags = tagIds;
      console.log("costume I am sending", create.costume);

      APIFactory.updateCostume(create.costume)
      .then(()=> {
        // TODO: pop up with a success modal or something for a second. 
        $location.path("/closet");
      }, e => console.error);
    };

    create.deleteCostume = () => {
      APIFactory.deleteCostume(create.costume.url)
      .then(() => {
        $location.path("/closet");
      }, e=> console.error);
    };

  }]);
