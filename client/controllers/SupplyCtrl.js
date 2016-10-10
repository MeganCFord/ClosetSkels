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
    
    // Get all tag options.
    APIFactory.getTags()
    .then((res)=> {
      supplier.tags = res;
      $timeout();
    });

    // Get all element options.
    APIFactory.getElements()
    .then((res)=> {
      supplier.elements = res;
      $timeout();
    });

    if(supply === null) {
      // 'Create' setup.
      supplier.supply = {"name": "", "costume": "", "element": {}, "description": "", "tags": []};
      supplier.title = "Create Supply";
    } else {
      // 'Edit' setup.
      supplier.supply = supply;
      supplier.title = "Edit Supply";
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
      if (supply===null) {
        APIFactory.createSupply(supplier.supply)
        .then((res)=> {
          // Send the new supply to the main create page for display.
          $scope.$emit("supply", res);
          $uibModalInstance.close();
        });
      } else {
        APIFactory.editSupply(supplier.supply)
        .then((res)=> {
          // Send the edited supply to the main create page for display.
          $scope.$emit("supply", res);
          $uibModalInstance.close();
        });
      }
    };

    supplier.cancel = function () {
      // Closes the modal, doing nothing.
      $uibModalInstance.dismiss("cancel");
    };
  }]);
