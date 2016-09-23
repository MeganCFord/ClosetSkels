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
      createSupply.title = "Edit Supply";
      createSupply.selectedElement = createSupply.costumeelement.element;
      $timeout();
    }


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
          if(createSupply.costumeelement.tags[u].name == createSupply.tags[index].name) {
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
      // TEMP SOLUTION: completely recreating the supply with the selected costume set. Some weird error is happening where the costume elements are unreachable after a refresh.
      createSupply.costumeelement.element = createSupply.selectedElement.id;

      if(createSupply.costumeelement.element.$$hashKey) {
        delete createSupply.costumeelement.element.$$hashKey;
      }
      if (createSupply.costumeelement.url) {
        $scope.$emit("deleteSupplyPlease", createSupply.costumeelement);
        delete createSupply.costumeelement.url; 
      }
      if (createSupply.costumeelement.id) {
        delete createSupply.costumeelement.id;
      }
      $scope.$emit("editedSupply", createSupply.costumeelement);
      
      const tagids = [];
      for (const index in createSupply.costumeelement.tags) {
        tagids.push(createSupply.costumeelement.tags[index].id);
      }
      createSupply.costumeelement.tags = tagids;
        
      console.log("supply to edit/create", createSupply.costumeelement);
      APIFactory.createCostumeElement(createSupply.costumeelement)
      .then(() => { 
        // Emit the edited supply to the costume controller.
        $uibModalInstance.close();
      }, e => console.error);
    };

    createSupply.cancel = function () {
      // Closes the modal, doing nothing.
      $uibModalInstance.dismiss("cancel");
    };
  }]);
