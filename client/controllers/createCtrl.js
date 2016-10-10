app.controller("Create",[
  "$scope",
  "APIFactory",
  "$timeout",
  "$location",
  "$uibModal",
  "$rootScope", // need this because the uib-Modal scope is not actually nested inside this scope.
  "CostumeFactory",
  "FirebaseFactory",
  "$routeParams",
  function($scope, APIFactory, $timeout, $location, $uibModal, $rootScope, CostumeFactory, FirebaseFactory, $routeParams) {

    const create = this;

    if ($location.path() === "/create") { 
      // 'Create' setup.
      create.title="Create Costume";
      create.deleteButton = "Discard";
      create.costume = {
        "name": "",
        "description": "", 
        "public": false, 
        "owner": "" ,
        "tags": [], 
        "image": ""
      };
    } else {
      // 'Edit' setup.
      create.title = "Edit Costume";
      create.deleteButton = "Delete";
    }

    create.hideNewTagForm=true;
    create.currentFileName = "No File Selected"; 
    create.tags = [];
    create.supplies = [];

    create.newTag = {
      "name": "", 
      "costumes": [], 
      "costumeelements": []
    };


///////////////////////////////
// LOADERS /////////////////////
///////////////////////////////

    $scope.$on("user", function(event, data) {
      $timeout().then(() => {
        // Set User.
        create.user = data;
        $timeout();
      }).then(()=> {
        if($location.path()==="/create") {
          create.costume.owner = data;
          // 'Create' setup. Gets all supplies with no costume url assigned (meaning the costume has not been completed).
          return APIFactory.getSupplies()
          .then((res) => {
            create.supplies = res;
            $timeout();
          }, e => console.error);
        } else {
          // 'Edit' setup. Get costume via ID in route.
          APIFactory.getOneCostume($routeParams.id)
          .then((res)=> {
            create.costume = res;
            // Get all supplies assigned to that costume.
            return APIFactory.getSupplies(costumeid = res.id);
          }).then((res)=> {
            create.supplies = res;
            $timeout();
          }, e => console.error);
        }
      }, e => console.error);
    });

    
    // Get all tag options.
    APIFactory.getTags()
    .then((res)=> {
      create.tags = res; 
      $timeout();
    }, e => console.error);



///////////////////////////////
// LISTENERS /////////////////////
///////////////////////////////

    //receives new/edited supply object from the create modal. 
    $rootScope.$on("supply", function(event, data) { 
      // TODO: if the supply is a new version of an edited one, splice it out.
      create.supplies.push(data);
      $timeout(); //Just in case.
    });

    //receives an object to delete from the create modal.
    $rootScope.$on("deleteSupplyPlease", function(event, data) {
      return create.deleteSomething(data.url);
    });
    
    $rootScope.$on("newTag", function(event, value) {
      create.tags.push(value);
    });
    
///////////////////////////////
// PHOTOS /////////////////////
///////////////////////////////

    create.uploadPhoto = function() {
   
      //find the file. Angular can't really find files automatically.
      const input = document.querySelector('[type="file"]');
      const file = input.files[0];

      FirebaseFactory.uploadImage(file)
      .then(res => {
        create.costume.image = res.downloadURL;
      }, e=>console.error)
      .then(()=> {
        $timeout();
      });
    };
      //displays file name on DOM and uploads file on file choice. 
    $scope.photoChanged = function(files) {
      if (files !== null ) {
        create.currentFileName = files[0].name;
        create.uploadPhoto();
        $scope.$apply();
      }
    };


///////////////////////////////
// TAGS ///////////////////////
///////////////////////////////

    create.addTag = (tag) => {
      create.costume.tags.push(tag);
    };

    create.removeTag = (tag) => {
      create.costume.tags.splice(create.costume.tags.indexOf(tag));
    };


    create.createTag = () => {
      APIFactory.createTag(create.newTag).then((res) => {
        create.tags.push(res);
        create.costume.tags.push(res);
        create.hideNewTagForm = true;
        create.newTag.name="";
        $timeout();
      }, e => console.error);
    };



///////////////////////////////
// MODALS /////////////////////
///////////////////////////////

    create.openCreateModal = () => {
      const modalInstance = $uibModal.open({
        size: "lg",
        templateUrl: "/partials/supply.html", 
        controller: "Supplier",
        controllerAs: "supplier",
        resolve: {
          "supply": null
        }   
      });
    }; 


    create.openEditModal = (supply) => {
      //Sending the entire supply object into modal.
      const modalInstance = $uibModal.open({
        size: "lg",
        templateUrl: "/partials/supply.html", 
        controller: "Supplier",
        controllerAs: "supplier", 
        resolve: {
          "supply": supply
        }
      });
    };


    create.createCostume = () => {
      // TODO: fix this and also handle what happens if you're editing the costume instead.
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
      if($location.path()==="/create") {
        // TODO: delete all the supplies you may have created. 
        $location.path("/closet");
      } else {
        APIFactory.deleteSomething(create.costume.url)
        // TODO: also delete all the supplies associated with that costume.
        .then(()=> {
          $location.path("/closet");
        }, e => console.error);
      }
    };
  }]);
