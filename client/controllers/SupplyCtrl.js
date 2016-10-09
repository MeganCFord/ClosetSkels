app.controller("Supplier",[
  "$scope",
  "APIFactory",
  "$timeout",
  "$location",
  "$uibModalInstance",
  "supply",
  function($scope, APIFactory, $timeout, $location, $uibModalInstance, supply) {
    const supplier = this;
    
    supplier.hideNewElementForm = true;
    supplier.hideNewTagForm = true;

    supplier.elements= [];
    supplier.tags = [];

    supplier.element = {"name": ""};
    supplier.tag = {"name": "", "costumes": [], "costumeelements": []};
    
    if(supply === null) {
      // If the modal has been opened to create a new supply:
      supplier.supply = {"name": "", "costume": "", "element": "", "description": "", "tags": []};
      supplier.title = "Create Supply";
    } else {
      supplier.supply = supply;
      supplier.title = "Edit Supply";
      // TODO: check if I need to remove a hashkey from the selected element for editing select match. 
      supplier.selectedElement = supplier.supply.element;
      $timeout();
    }

    // Get all tags for selection.
    APIFactory.getTags()
    .then((res)=> {
      supplier.tags = res;
      $timeout();
      console.log("uh tags", supplier.tags);
      console.log("supply tags!!!!!", supplier.supply.tags);
      // TODO: I think the supply tags and the list of tags don't actually match due to added hashkey.
    });

    // supplier.isTagActive = (tag) => {
    //   for(const tagindex in supplier.costumeelement.tags) {
    //     if(tag.name===supplier.costumeelement.tags[tagindex].name) {
    //       return true;
    //     } else {
    //       return false;
    //     }
    //   }
    // };

    // Get all elements for select.
    APIFactory.getElements()
    .then((res)=> {
      supplier.elements = res;
      $timeout();
    }).then(()=> {
      // set selected element if form is being used for editing.
      if(supply !== null) {
        // TODO: this does not work.
        for(const index in supplier.elements) {
          if (supplier.elements[index].id === supplier.costumeelement.element.id) {
            supplier.selectedElement = supplier.costumeelement[index];
          } 
        }
      } else {
        supplier.selectedElement = null;
      }
    });

    supplier.createElement = () => {
      APIFactory.createElement(supplier.element).then((res) => {
        // Add new element to list of elements in 'select' formfield, and select it.
        supplier.elements.push(res);
        supplier.selectedElement = res;
        // Reset form.
        supplier.element.name = "";
        supplier.hideNewElementForm = true;
        $timeout();
      }, e => console.error);
    };

    supplier.addTag = (tag) => {
      supplier.costumeelement.tags.push(tag);
    };

    supplier.removeTag = (tag) => {
      supplier.supply.tags.splice(supplier.supply.tags.indexOf(tag));
    };

    supplier.createTag = () => {
      APIFactory.createTag(supplier.tag).then((res) => {
        // Add tag to supply and to list of tags- filter will auto-select it.
        supplier.tags.push(res);
        supplier.supply.tags.push(res);
        // Also send the new tag to the main create form.
        $scope.$emit("newTag", res);
        // Reset form.
        supplier.tag.name="";
        supplier.hideNewTagForm = true;
        $timeout();
      }, e => console.error);
    };

    supplier.ok = function () {
      console.log("supply to create", supplier.supply);
    };

    supplier.cancel = function () {
      // Closes the modal, doing nothing.
      $uibModalInstance.dismiss("cancel");
    };
  }]);
