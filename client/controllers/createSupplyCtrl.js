app.controller("CreateSupply",[
  "$scope",
  "APIFactory",
  "$timeout",
  "$location",
  "$uibModalInstance",
  function($scope, APIFactory, $timeout, $location, $uibModalInstance) {
    const createSupply = this;

    createSupply.elementIsCollapsed = true;
    createSupply.tagIsCollapsed = true;

    createSupply.elements= [];

    createSupply.element = {"name": ""};
    createSupply.tag = {"name": "", "costumes": [], "costumeelements": []};
    createSupply.costumeelement = {"name": "", "costume": "", "element": "", "description": "", "tags": []};


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
        createSupply.costumeelement.element = res.url;
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
      //Submit the form.
      APIFactory.createCostumeElement(createSupply.costumeelement)
      .then((res) => { 
        // Emit the newly created supply to the costume controller.
        console.log("created supply", res);
        $scope.$emit("createdSupply", res);
      }, e => console.error);
        //Close modal.
      $uibModalInstance.close();
    };

    createSupply.cancel = function () {
      // Closes the modal, doing nothing.
      $uibModalInstance.dismiss("cancel");
    };
  }]);
