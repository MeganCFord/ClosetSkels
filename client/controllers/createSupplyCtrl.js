
app.controller("CreateSupply",[
  "$scope",
  "APIFactory",
  "$timeout",
  "$location",
  "$uibModalInstance",
  "supply",
  function($scope, APIFactory, $timeout, $location, $uibModalInstance, supply) {
    const createSupply = this;
    
    createSupply.elementIsCollapsed = true;
    createSupply.tagIsCollapsed = true;

    createSupply.elements= [];
    createSupply.tags = [];

    createSupply.element = {"name": ""};
    createSupply.tag = {"name": "", "costumes": [], "costumeelements": []};
    
    if(supply === null) {
      createSupply.costumeelement = {"name": "", "costume": "", "element": "", "description": "", "tags": []};
      createSupply.title = "Create Supply";
    } else {
      createSupply.costumeelement = supply;
      $timeout()
      createSupply.title = "Edit Supply";
      createSupply.selectedElement = createSupply.costumeelement.element;
      $timeout();
    }

    // Get all tags for selection.
    APIFactory.getTags()
    .then((res)=> {
      createSupply.tags = res;
      console.log("uh tags", createSupply.tags);
      console.log("supply tags!!!!!", createSupply.costumeelement.tags);
      $timeout();
    }).then(()=> {
      //Not really sure why this sometimes doesn't work.
      console.log("uh tags?", createSupply.costumeelement);
      const actualtags = [];
      for(const index in createSupply.tags) {
        for (const u in createSupply.costumeelement.tags) {
          if(createSupply.costumeelement.tags[u].$$hashKey == createSupply.tags[index].$$hashKey) {
            actualtags.push(createSupply.tags[index]);
          } 
        }
      }
      createSupply.costumeelement.tags = actualtags;
      console.log("tags should match now", createSupply.costumeelement.tags, createSupply.tags);
      $timeout();
    });

    createSupply.isTagActive = (tag) => {
      for(const tagindex in createSupply.costumeelement.tags) {
        if(tag.name===createSupply.costumeelement.tags[tagindex].name) {
          return true;
        } else {
          return false;
        }
      }
    };

    // Get all elements for select.
    APIFactory.getElements()
    .then((res)=> {
      createSupply.elements = res;
      $timeout();
    }).then(()=> {
      // set selected element.
      if(supply != null) {
        for(const index in createSupply.elements) {
          if (createSupply.elements[index].id === createSupply.costumeelement.element.id) {
            createSupply.selectedElement = createSupply.costumeelement[index];
          } 
        }
      } else {
        createSupply.selectedElement = null;
      }
    });

    // Get all tags for selection.
    APIFactory.getTags()
    .then((res)=> {
      createSupply.tags = res;
      $timeout();
    }).then(()=> {
      const actualtags = [];
      for(const index in createSupply.tags) {
        for (const u in createSupply.costumeelement.tags) {
          if(createSupply.costumeelement.tags[u] == createSupply.tags[index].id) {
            actualtags.push(createSupply.tags[index]);
          }
        }
      }
      createSupply.costumeelement.tags = actualtags;
    });

    createSupply.createElement = () => {
      APIFactory.createElement(createSupply.element).then((res) => {
        // Add new element to list of elements, and select it.
        createSupply.elements.push(res);
        createSupply.selectedElement = res;
        // Reset form.
        createSupply.element.name = "";
        createSupply.elementIsCollapsed = true;
        $timeout();
      }, e => console.error);
    };

    createSupply.addTag = (tag) => {
      createSupply.costumeelement.tags.push(tag);
    };

    createSupply.removeTag = (tag) => {
      for(const u in createSupply.costumeelement.tags) {
        if(createSupply.costumeelement.tags[u] === tag) {
          createSupply.costumeelement.tags.splice(u, 1);
        }
      }
    };

    createSupply.createTag = () => {
      APIFactory.createTag(createSupply.tag).then((res) => {
        createSupply.tags.push(res);
        createSupply.costumeelement.tags.push(res);
        $scope.$emit("newTag", res);
        // Reset form.
        createSupply.tag.name="";
        createSupply.tagIsCollapsed = true;
        $timeout();
      }, e => console.error);
    };

    createSupply.ok = function () {
      let oldObject = {};
      // TEMP SOLUTION: completely recreating the supply with the selected costume set. Some weird error is happening where the costume elements are unreachable after a refresh.
      createSupply.costumeelement.element = createSupply.selectedElement.id;

      if(createSupply.costumeelement.element.$$hashKey) {
        delete createSupply.costumeelement.element.$$hashKey;
      }
      if (createSupply.costumeelement.url) {
        oldObject = createSupply.costumeelement;
        delete createSupply.costumeelement.url; 
      }
      if (createSupply.costumeelement.id) {
        delete createSupply.costumeelement.id;
      }
      
      const tagids = [];
      for (const index in createSupply.costumeelement.tags) {
        tagids.push(createSupply.costumeelement.tags[index].id);
      }
      createSupply.costumeelement.tags = tagids;
      
      let newce = {};
      APIFactory.createCostumeElement(createSupply.costumeelement)
      .then((res) => { 
        newce = res;
        // new element does not have the costume on it because evil, so find it in the null costumes.
        return APIFactory.getCostumeElements();
      }, e => console.error)
      .then((res) => {
        let element_to_send = {};
        for(const index in res) {
          if(res[index].id === newce.pk) {
            element_to_send = res[index];
          } 
        }
        return element_to_send;
      }).then((res)=> {
        // Emit the edited supply to the costume controller.
        $scope.$emit("editedSupply", res);
        $scope.$emit("deleteSupplyPlease", oldObject);

        $uibModalInstance.close();
        
      }, e=> console.error);
    };

    createSupply.cancel = function () {
      // Closes the modal, doing nothing.
      $uibModalInstance.dismiss("cancel");
    };
  }]);
