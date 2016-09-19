app.controller("Create",[
  "$scope",
  "APIFactory",
  "$timeout",
  function($scope, APIFactory, $timeout) {
    const create = this;
    create.title="create page";

    create.tags = [];
    create.elements = [];

    create.tag = {"name": "", "costumes": [], "costumeelements": []};
    create.element = {"name": ""};
    create.costumeelement = {"costume": "", "element": "", "description": ""};

    $scope.$on("username", function(event, data) {
      $timeout().then(() => {
        create.username = data; 
        return data;
      }).then(() => {
        return APIFactory.getUserUrl(create.username);
      }).then((res) => {
        create.userUrl = res; 
        $timeout();
      }, e=> console.error);
    });

    create.costume = {
      "name": "",
      "description": "", 
      "datecreated": Date.now(), 
      "public": false, 
      "owner": create.username, 
      "tags": [],
      "costumeelements": []
    };

    APIFactory.getTags()
    .then((res)=> {
      create.tags = res; 
      console.log("initial tags", create.tags); 
      $timeout();
    }, e => console.error);

    APIFactory.getElements()
    .then((res)=> {
      create.elements = res; 
      console.log("initial elements", create.elements); 
      $timeout();
    }, e => console.error);


    create.addTag = (url) => {
      create.costume.tags.push(url);
      console.log("adding tag", create.costume.tags);
    };
    create.removeTag = (url) => {
      create.costume.tags.remove(url);
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
