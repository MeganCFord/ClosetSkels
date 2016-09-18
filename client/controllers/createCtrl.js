app.controller("Create",[
  "$scope",
  "APIFactory",
  "$timeout",
  function($scope, APIFactory, $timeout) {
    const create = this;
    create.title="create page";
    
    $scope.$on("username", function(event, data) {
      create.username = data;
    });
    create.tags = [];
    create.elements = [];

    create.tag = {"name": "", "costumes": [], "costumeelements": []};
    create.element = {"name": ""};

    APIFactory.getTags().then((res)=> {create.tags = res; console.log("initial tags", create.tags); $timeout();}, e => console.error);
    APIFactory.getElements().then((res)=> {create.elements = res; console.log("initial elements", create.elements); $timeout();}, e => console.error);

    create.costume = {
      "name": "",
      "description": "", 
      "datecreated": Date.now(), 
      "public": false, 
      "owner": create.username, 
      "tags": [],
      "costumeelements": []
    };

    create.createTag = () => {
      APIFactory.createTag(create.tag).then(() => {
        APIFactory.getTags().then((res)=> {
          create.tags = res;
          console.log(create.tags, "updated tags");
          $timeout();
        });
      });
    };

    create.createElement = () => {
      APIFactory.createElement(create.element).then(() => {
        APIFactory.getElements().then((res)=> {
          create.elements = res;
          console.log(create.elements, "updated elements");
          $timeout();
        });
      });
    };

  }]);
