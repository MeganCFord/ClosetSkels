app.controller("Create",[
  "$scope",
  "APIFactory",
  "$timeout",
  "$location",
  function($scope, APIFactory, $timeout, $location) {
    const create = this;
    create.title="create page";

    // Toggle 'create tag' divs in various places.
    create.tagIsCollapsed=true;
    create.elementTagIsCollapsed=true;
    create.elementIsCollapsed=true;
    create.editelementTagIsCollapsed=true;
    create.editelementIsCollapsed=true;

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
        create.costume.owner = create.userUrl;
        $timeout();
      }, e=> console.error);
    });

    create.costume = {
      "name": "",
      "description": "", 
      "public": false, 
      "owner": "" ,
      "costumeelements": [], 
      "tags": [], 
      "boos": []
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
      console.log("supply data", res);
      create.costumeelements = res;
      for(const index in create.costumeelements) {
        create.costume.costumeelements.push(create.costumeelements[index].url);
      }
      $timeout();
    }, e => console.error);

    create.addTag = (url, element=false, supply=null) => {
      if(element===false) {
        create.costume.tags.push(url);
      } else {
        if(supply===null) {
          create.costumeelement.tags.push(url);
        } else {
          // TODO: fix this. it seems to be working, but the buttons don't update.
          for (const index in create.costumeelements) {
            if (create.costumeelements[index].url === supply) {
              create.costumeelements[index].tags.push(url);
              console.log("added tag to this costume", create.costumeelements[index].url, supply);
              console.log("here are the tags", create.costumeelements[index].tags, url);
              $timeout();
            }
          }
        }
      }
    };
    create.removeTag = (url, element=false, supply=null) => {
      if(element === false) {
        for(const u in create.costume.tags) {
          if(create.costume.tags[u] === url) {
            create.costume.tags.splice(u, 1);
          }
        }
      } else {
        if(supply===null) {
          for (const u in create.costumeelement.tags) {
            if(create.costumeelement.tags[u] === url) {
              create.costumeelement.tags.splice(u, 1);
            }
          }
        } else {
          for (const index in create.costumeelements) {
            for (u in create.costumeelements[index].tags) {
              if(create.costumeelements[index].tags[u] === url) {
                create.costumeelements[index].tags.splice(u, 1);
              }
            }
          }
        }
      }
    };

    create.createTag = (element=false, index=null) => {
      console.log("index", index);
      APIFactory.createTag(create.tag).then((res) => {
        create.tags.push(res);
        if(element===false) {
          create.costumetags.push(res.url);
          create.tagIsCollapsed = true;
        } else {
          if(index===null) {
            create.costumeelement.tags.push(res.url);
            create.elementTagIsCollapsed = true;
          } else {
            create.costumeelements[index].tags.push(res.url);
            create.editelementTagIsCollapsed = true;
          }
        }
        create.tag.name="";
        $timeout();
      });
    };

    create.createElement = (ceindex=null) => {
      console.log("supply index in create element", ceindex);
      APIFactory.createElement(create.element).then((res) => {
        create.elements.push(res);
        if(ceindex===null) {
          create.costumeelement.element = res.url;
          create.elementIsCollapsed = true;
        } else {
          create.costumeelements[ceindex].element = res.url;
          create.editelementIsCollapsed = true;
        }
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

    create.createCostume = () => {
      APIFactory.createCostume(create.costume).then((res)=> {
        console.log(res);
        // $location.path("/closet");
      });
    };

  }]);
