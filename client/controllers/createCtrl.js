app.controller("Create",[
  "$scope",
  "APIFactory",
  "$timeout",
  function($scope, APIFactory, $timeout) {
    const create = this;
    create.title="create page";

    // Toggle 'create tag' div.
    create.tagIsCollapsed=true;
    create.elementTagIsCollapsed=true;
    create.elementIsCollapsed=true;

    // all the stuff.
    create.tags = [];
    create.elements = [];
    create.costumeelements = [];

    create.tag = {"name": "", "costumes": [], "costumeelements": []};
    create.element = {"name": ""};
    create.costumeelement = {"name": "", "costume": "", "element": "", "description": "", "tags": []};

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
      "costumeelements": [], 
      "tags": []
    };

    APIFactory.getTags()
    .then((res)=> {
      create.tags = res; 
      $timeout();
      console.log("initial tags", create.tags);
    }, e => console.error);

    APIFactory.getElements()
    .then((res)=> {
      create.elements = res; 
      console.log("initial elements", create.elements); 
      $timeout();
    }, e => console.error);

    APIFactory.getCostumeElements()
    .then((res) => {
      create.costumeelements = res;
      console.log("initial costume elements", create.costumeelements);
      $timeout();
    }, e => console.error);

    create.addTag = (url, element=false) => {
      if(element===false) {
        create.costume.tags.push(url);
      } else {
        create.costumeelement.tags.push(url);
      }
    };
    create.removeTag = (url, element=false) => {
      if(element === false) {
        for(const u in create.costume.tags) {
          if(create.costume.tags[u] === url) {
            create.costume.tags.splice(u, 1);
          }
        }
      } else {
        for (const u in create.costumeelement.tags) {
          if(create.costumeelement.tags[u] === url) {
            create.costumeelement.tags.splice(u, 1);
          }
        }
      }
    };

    create.createTag = (element=false) => {
      APIFactory.createTag(create.tag).then((res) => {
        create.tags.push(res);
        if(element===false) {
          create.costumetags.push(res.url);
          create.tagIsCollapsed = true;
        } else {
          create.costumeelement.tags.push(res.url);
          create.elementTagIsCollapsed = true;
        }
        $timeout();
      });
    };

    create.createElement = () => {
      APIFactory.createElement(create.element).then((res) => {
        create.elements.push(res);
        create.costumeelement.element = res.url;
        create.element.name = "";
        $timeout();
      });
    };

    create.createCostumeElement = () => {
      APIFactory.createCostumeElement(create.costumeelement).then((res) => {
        create.costumeelements.push(res);
        create.costume.costumeelements.push(res.url);
        create.costumeelement = {"costume": "", "element": "", "description": "", "tags": []};
        $timeout();

      });
    };

    create.editCostumeElement = (url) => {
      console.log(url);
    };

  }]);
