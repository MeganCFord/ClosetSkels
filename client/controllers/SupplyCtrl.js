app.controller("Supplier",[
  "$scope",
  "APIFactory",
  "$timeout",
  "$location",
  "$uibModalInstance",
  "supply",
  function($scope, APIFactory, $timeout, $location, $uibModalInstance, supply) {
    const supplier = this;
    
    supplier.newElement = {"name": ""};
    supplier.hideNewElementForm = true;

    supplier.newTag = {"name": "", "costumes": [], "costumeelements": []};
    supplier.hideNewTagForm = true;
    
    // Get all tags.
    APIFactory.getTags()
    .then((res)=> {
      supplier.tags = res;
      $timeout();
      // TODO: I think the supply tags and the list of tags don't actually match due to added hashkey.
    });

    // Get all elements.
    APIFactory.getElements()
    .then((res)=> {
      supplier.elements = res;
      $timeout();
    }).then(()=> {
      // TODO: set selected element if form is being used for editing.
    });

    if(supply === null) {
      // If the modal has been opened to create a new supply:
      supplier.supply = {"name": "", "costume": "", "element": {}, "description": "", "tags": []};
      supplier.title = "Create Supply";
    } else {
      supplier.supply = supply;
      supplier.title = "Edit Supply";
      // TODO: check if I need to remove a hashkey from the selected element for editing select match. 
      // TODO: get the selected element to show up as a preselect in ng-options.
      supplier.selectedElement = supplier.supply.element;
      $timeout();
    }

    supplier.createElement = () => {
      APIFactory.createElement(supplier.newElement).then((res) => {
        // Add new element to list of elements in 'select' formfield, and select it.
        supplier.elements.push(res);
        supplier.supply.element = res;
        // Reset form.
        supplier.newElement.name = "";
        supplier.hideNewElementForm = true;
        $timeout();
      }, e => console.error);
    };


    supplier.createTag = () => {
      APIFactory.createTag(supplier.newTag).then((res) => {
        // Add tag to supply and to list of tags- filter will auto-select it.
        supplier.tags.push(res);
        supplier.supply.tags.push(res);
        // Also send the new tag to the main create form.
        $scope.$emit("newTag", res);
        // Reset form.
        supplier.newTag.name="";
        supplier.hideNewTagForm = true;
        $timeout();
      }, e => console.error);
    };

    supplier.addTag = (tag) => {
      supplier.supply.tags.push(tag);
    };

    supplier.removeTag = (tag) => {
      supplier.supply.tags.splice(supplier.supply.tags.indexOf(tag));
    };
    supplier.ok = function () {
      APIFactory.createSupply(supplier.supply)
      .then((res)=> {
        console.log('res in controller', res)
      })
    };

    supplier.cancel = function () {
      // Closes the modal, doing nothing.
      $uibModalInstance.dismiss("cancel");
    };
  }]);
