app.controller("Create",[
  "$scope",
  "APIFactory",
  "$timeout",
  "$location",
  "$uibModal",
  "$rootScope", // need this because the  uib-Modal scope is not actually nested inside this scope- it's randomly off to one corner or whatever.
  "FirebaseFactory",
  function($scope, APIFactory, $timeout, $location, $uibModal, $rootScope, FirebaseFactory) {
    const create = this;
    create.title="Create a Costume";

    // Toggle 'create tag' div.
    create.tagIsCollapsed=true;
    create.deleteButton = "Discard";
    create.currentFileName = "No File Selected"; 


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
      "image": ""
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
        create.costume.owner = create.userInfo.id;
        $timeout();
      }, e=> console.error);
    });

    // In case of refresh. Gets all costume elements with no costume url assigned (meaning the costume has not been completed) and pushes their ids back into the costume object.
    // 
    // TODO: this does not work because the costume elements once created are ungettable. fix in V2.
    // APIFactory.getCostumeElements()
    // .then((res) => {
    //   create.costumeelements = res;
    //   for(const index in create.costumeelements) {
    //     create.costume.costumeelements.push(create.costumeelements[index].id);
    //   }
    //   $timeout();
    // }, e => console.error);
    
    // On load, also load all tags.
    APIFactory.getTags()
    .then((res)=> {
      create.tags = res; 
      $timeout();
    }, e => console.error);


    //grabs new data from the create modal. Since I had to write a custom nested serializer, this returns only the primary key of the object created. Dealing with this here right now, but eventually can move this into the factory.
    $rootScope.$on("createdSupply", function(event, value) { 
      create.costume.costumeelements.push(value.id);
      create.costumeelements.push(value);
      $timeout(); //Just in case.
    });

    //grabs updated data from edit modal.
    $rootScope.$on("editedSupply", function(event, value) { 
      // console.log("got the edited supply", value);
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




    create.uploadPhoto = function() {
      console.log("hey!");
      //find the file. Angular doesn't really do this automatically.
      const input = document.querySelector('[type="file"]');
      const file = input.files[0];

      FirebaseFactory.uploadImage(file)
      .then(res => {
        create.costume.image = res.downloadURL;
      }, e=>console.error)
      .then(()=> {
        console.log("costume image", create.costume.image);
        $timeout();

      });
    };
      //displays file name on DOM and uploads file on file choice. 
    $scope.photoChanged = function(files) {
      if (files !== null ) {
        create.currentFileName = files[0].name;
        console.log("file name:", create.currentFileName);
        create.uploadPhoto();
        $scope.$apply();
      }
    };

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
      //Sending the entire supply object into modal.
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
      // TODO: DO NOT USE THIS AFTER REFRESH, it doesn't work. Costume element objects are currently undeletable.
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

      APIFactory.createCostume(create.costume).then((res)=> {
        console.log(res);
        // TODO: pop up with a success modal or something for a second. 
        $location.path("/closet");
      });
    };

    create.deleteCostume = () => {
      $location.path("/closet");
    };
  }]);
