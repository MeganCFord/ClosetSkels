app.controller("Create",[
  "$scope",
  "$rootScope", // need this because the uib-Modal scope is not actually nested inside this scope.
  "$timeout",
  "$location",
  "$routeParams",
  "$uibModal",
  "CostumeFactory",
  "FirebaseFactory",
  "APIFactory",
  function($scope, $rootScope, $timeout, $location, $routeParams, $uibModal, CostumeFactory, FirebaseFactory, APIFactory) {

    const create = this;

    if ($location.path() === "/create") { 
      // Pre-user 'Create' setup.
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
      // Pre-user 'Edit' setup.
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
// LOADER /////////////////////
///////////////////////////////

    $scope.$on("user", function(event, data) {
      $timeout().then(() => {
        // Set User.
        create.user = data;
        $timeout();
      }).then(()=> {
        if($location.path()==="/create") {
          create.costume.owner = data;
          // 'Create' setup. 
          // Get all supplies with no costume url assigned (meaning the costume has not been completed).
          return APIFactory.getSupplies()
          .then((res) => {
            create.supplies = res;
            $timeout();
          }, e => console.error);
        } else {
          // 'Edit' setup. 
          // Get costume via ID in route.
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

    $rootScope.$on("supply", function(event, data) {
      // Receives new/edited supply object from the supply modal. 
      // If the supply is a new version of an edited one, splice it out.
      create.supplies.forEach((supply)=> {
        if(supply.id === data.id) {
          create.supplies.splice(create.supplies.indexOf(supply));
        }
      });
      create.supplies.push(data);
    });

    $rootScope.$on("delete", function(event, data) {
      //receives an object to delete from the supply modal.
      //Splice out the supply to delete from the list.
      create.supplies.forEach((supply)=> {
        if(supply.id === data.id) {
          create.supplies.splice(create.supplies.indexOf(supply));
        }
      });
      return APIFactory.deleteSomething(data.url);
    });
    
    $rootScope.$on("newTag", function(event, value) {
      // If a new tag has been created by the supply modal, also add it to the available tags here.
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

    $scope.photoChanged = function(files) {
      //displays file name on DOM and uploads file on file choice. 
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

    create.openModal = (supply = null) => {
      //If editing, send the entire supply object into modal.
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
     
      APIFactory.createCostume(create.costume).then((res)=> {
        console.log(res);
        // TODO: pop up with a success modal or something for a second. 
        $location.path("/closet");
      });
    };

    create.deleteCostume = () => {
      // Delete all the supplies. 
      create.supplies.forEach((supply) => {
        return APIFactory.deleteSomething(supply.url);
      }).then(()=> {
        if($location.path()==="/create") {
          $location.path("/closet");
        } else {
          APIFactory.deleteSomething(create.costume.url)
          .then(()=> {
            $location.path("/closet");
          }, e => console.error);
        }
      });
    };
  }]);
