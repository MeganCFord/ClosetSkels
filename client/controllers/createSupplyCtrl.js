app.controller("CreateSupply",[
  "$scope",
  "APIFactory",
  "$timeout",
  "$location",
  "$uibModalInstance",
  "supply",
  function($scope, APIFactory, $timeout, $location, $uibModalInstance, supply) {
    const createSupply = this;
    createSupply.title = "Create Supply";
    
    createSupply.elementIsCollapsed = true;
    createSupply.tagIsCollapsed = true;

    createSupply.elements= [];
    createSupply.tags = [];

    createSupply.element = {"name": ""};
    createSupply.tag = {"name": "", "costumes": [], "costumeelements": []};
    
    if(supply === null) {
      createSupply.costumeelement = {"name": "", "costume": "", "element": {}, "description": "", "tags": []};
    } else {
      createSupply.costumeelement = supply;
    }


    // Get all elements for select.
    APIFactory.getElements()
    .then((res)=> {
      createSupply.elements = res;
      $timeout();
    });

    // Get all tags for selection.
    APIFactory.getTags()
    .then((res)=> {
      createSupply.tags = res;
      $timeout();
    });

    createSupply.createElement = () => {
      APIFactory.createElement(createSupply.element).then((res) => {
        // Add new element to list of elements, and select it.
        createSupply.elements.push(res);
        createSupply.costumeelement.element = res;
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
        // Reset form.
        createSupply.tag.name="";
        createSupply.tagIsCollapsed = true;
        $timeout();
      }, e => console.error);
    };

    createSupply.ok = function () {
      createSupply.costumeelement.element = createSupply.elements[createSupply.selectedElement];
      console.log("supply!", createSupply.costumeelement);
      if(supply != null) {
        APIFactory.editCostumeElement(createSupply.costumeelement)
        .then((res) => { 
          // Emit the edited supply to the costume controller.
          console.log("edit: ", res);
          $scope.$emit("editedSupply", res);
          $uibModalInstance.close();
        }, e => console.error);
      } else {
        APIFactory.createCostumeElement(createSupply.costumeelement)
        .then((res) => { 
          // Emit the newly created supply to the costume controller.
          $scope.$emit("createdSupply", res);
          $uibModalInstance.close();
        }, e => console.error);
          //Close modal.
      }
    };

    createSupply.cancel = function () {
      // Closes the modal, doing nothing.
      $uibModalInstance.dismiss("cancel");
    };
  }]);
