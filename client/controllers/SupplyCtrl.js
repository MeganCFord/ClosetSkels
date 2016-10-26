app.controller("Supplier",[
  "$scope",
  "$timeout",
  "$location",
  "$uibModalInstance",
  "APIFactory",
  "supply",
  "costume",
  function($scope, $timeout, $location, $uibModalInstance, APIFactory, supply, costume) {
    const supplier = this;
    
    supplier.newElement = {"name": ""};
    supplier.hideNewElementForm = true;

    supplier.newTag = {"name": "", "costumes": [], "costumeelements": []};
    supplier.hideNewTagForm = true;
    
    if(supply === null) {
      // 'Create' setup. If creating a supply on an existing costume, assign costume URL. 
      
      supplier.supply = {"name": "", "costume": "", "element": {}, "description": "", "tags": []};
      supplier.supply.owner=costume.owner;

      if(costume.url) {
        supplier.supply.costume = String(costume.url);
      }
      supplier.title = "Create Supply";
      supplier.deleteButtonText = "Discard";
    } else {
      // 'Edit' setup.
      supplier.supply = supply;

      supplier.title = "Edit Supply";
      supplier.deleteButtonText = "Delete Supply";
      $timeout();
    }

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
      if (supply===null) {
        // On create:
        // Add disabled 'please choose' option to ng-options repeater and preselect it.
        supplier.elements.unshift({"name": "Please choose an element"});
        supplier.supply.element=supplier.elements[0];
      } 
      $timeout();
    });

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
      // Since the list of all tags has a hashkey and the list of tags on the costume does not, I can't simply splice this match.
      
      supplier.supply.tags.forEach((supplytag)=> {
        if(supplytag.id === tag.id) { 
          supplier.supply.tags.splice(supplier.supply.tags.indexOf(supplytag), 1);
        }
      });
    };

    supplier.delete = () => {
      if(supply===null) {
        // If template is 'create', simply close the modal.
        $uibModalInstance.dismiss("cancel");
      } else {
        // If template is 'edit', emit a deleter before closing.
        $scope.$emit("delete", supplier.supply);
        $uibModalInstance.close();
      }
    };

    supplier.ok = () =>  {
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

    supplier.cancel = () => {
      // Closes the modal, doing nothing.
      $uibModalInstance.dismiss("cancel");
    };
  }]);
