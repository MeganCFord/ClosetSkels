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

    create.tags = [];
    // the costume list just saves the URL so I'm saving the full objects here.
    create.costumeelements = [];

    create.tag = {"name": "", "costumes": [], "costumeelements": []};

    // On load, get the username and user info. 
    $scope.$on("username", function(event, data) {
      $timeout().then(() => {
        create.username = data; 
        return data;
      }).then(() => {
        return APIFactory.getUserInfo(create.username);
      }).then((res) => {
        create.userInfo = res; 
        create.costume.owner = create.userInfo.url;
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

    // Load all tags.
    APIFactory.getTags()
    .then((res)=> {
      create.tags = res; 
      $timeout();
      console.log("initial tags", create.tags);
    }, e => console.error);

    // In case of refresh. Gets all costume elements with no costume url assigned (meaning the costume has not been completed) and pushes their urls back into the costume object.
    APIFactory.getCostumeElements()
    .then((res) => {
      console.log("supply data", res);
      create.costumeelements = res;
      for(const index in create.costumeelements) {
        create.costume.costumeelements.push(create.costumeelements[index].url);
      }
      $timeout();
    }, e => console.error);



    create.addTag = (url) => {
      create.costume.tags.push(url);
    };

    create.removeTag = (url) => {
      for(const u in create.costume.tags) {
        if(create.costume.tags[u] === url) {
          create.costume.tags.splice(u, 1);
        }
      }
    };

    create.createTag = () => {
      APIFactory.createTag(create.tag).then((res) => {
        create.tags.push(res);
        create.costumetags.push(res.url);
        create.tagIsCollapsed = true;
        create.tag.name="";
        $timeout();
      }, e => console.error);
    };


    create.openCreateModal= () => {
      console.log("opening create modal.");
    };

    create.openEditModal = (url) => {
      console.log("opening edit modal for", url);
    };

    create.createCostume = () => {
      APIFactory.createCostume(create.costume).then((res)=> {
        console.log(res);
        // TODO: pop up with a success modal or something for a second. 
        $location.path("/closet");
      });
    };
  }]);
