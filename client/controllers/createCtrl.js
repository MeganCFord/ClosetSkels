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

    create.tags = [];
    create.hideNewTagForm=true;
    create.newTag = {
      "name": "", 
      "costumes": [], 
      "supplies": []
    };

    create.currentFileName = ""; 
    
    create.supplies = [];

    
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
        "image": "", 
        "supplies": []
      };
    } else {
      // Pre-user 'Edit' setup.
      create.title = "Edit Costume";
      create.deleteButton = "Delete";
    }


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
          create.costume.owner = data.url;
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
          CostumeFactory.getOneCostume($routeParams.id)
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
      //Find the file. Angular can't really find files automatically.
      const input = document.querySelector('[type="file"]');
      const file = input.files[0];

      // Upload to Firebase.
      FirebaseFactory.uploadImage(file)
      .then(res => {
        // Save firebase URL into costume object.
        create.costume.image = res.downloadURL;
      }, e=>console.error)
      .then(()=> {
        $timeout();
      });
    };

    $scope.photoChanged = function(files) {
      // Uploads file on file choice. 
      if (files !== null ) {
        create.uploadPhoto();
      }
    };


///////////////////////////////
// TAGS ///////////////////////
///////////////////////////////

    create.addTag = (tag) => {
      create.costume.tags.push(tag);
    };

    create.removeTag = (tag) => {
      // Since while editing the list of all tags has a hashkey and the list of tags on the costume does not, I can't simply splice this match.
      
      create.costume.tags.forEach((costumetag)=> {
        if(costumetag.id === tag.id) { 
          create.costume.tags.splice(create.costume.tags.indexOf(costumetag), 1);
        }
      });
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
// Supply /////////////////////
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

    create.deleteSupply = (supply) => {
      // Delete supply.
      create.supplies.splice(create.supplies.indexOf(supply));
      APIFactory.deleteSomething(supply.url);
    };


    create.createCostume = () => {
      if($location.path()==="/create") {
        CostumeFactory.createNewCostume(create.costume, create.supplies).then((res)=> {
          console.log(res);
          $location.path("/closet");
        });
      } else {
        CostumeFactory.updateCostume(create.costume).then((res)=> {
          console.log(res);
          $location.path("/closet");
        });
      }     
    };

    create.deleteCostume = () => {
      // Delete all the supplies. 
      create.supplies.forEach((supply) => {
        return APIFactory.deleteSomething(supply.url);
      });
      if($location.path()==="/create") {
        $location.path("/closet");
      } else {
        // If you were editing an existing costume, delete it.
        APIFactory.deleteSomething(create.costume.url)
        .then(()=> {
          $location.path("/closet");
        }, e => console.error);
      }
    };
  }]);
