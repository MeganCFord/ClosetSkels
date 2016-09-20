app.controller("EditSupply",[
  "$scope",
  "APIFactory",
  "$timeout",
  "$location",
  "$uibModalInstance",
  "supply",
  function($scope, APIFactory, $timeout, $location, $uibModalInstance, supply) {
    const editSupply = this;

    editSupply.elementIsCollapsed = true;
    editSupply.tagIsCollapsed = true;

    editSupply.elements= [];
    editSupply.tags = [];

    editSupply.element = {"name": ""};
    editSupply.tag = {"name": "", "costumes": [], "costumeelements": []};
    editSupply.costumeelement = supply;


    // Get all elements for select.
    APIFactory.getElements()
    .then((res)=> {
      editSupply.elements = res;
      $timeout();
    });

    // Get all tags for selection.
    APIFactory.getTags()
    .then((res)=> {
      editSupply.tags = res;
      $timeout();
    });

    editSupply.createElement = () => {
      APIFactory.createElement(editSupply.element).then((res) => {
        // Add new element to list of elements, and select it.
        editSupply.elements.push(res);
        editSupply.costumeelement.element = res.url;
        // Reset form.
        editSupply.element.name = "";
        editSupply.elementIsCollapsed = true;
        $timeout();
      }, e => console.error);
    };

    editSupply.addTag = (url) => {
      editSupply.costumeelement.tags.push(url);
    };

    editSupply.removeTag = (url) => {
      for(const u in editSupply.costumeelement.tags) {
        if(editSupply.costumeelement.tags[u] === url) {
          editSupply.costumeelement.tags.splice(u, 1);
        }
      }
    };

    editSupply.createTag = () => {
      APIFactory.createTag(editSupply.tag).then((res) => {
        editSupply.tags.push(res);
        editSupply.costumeelement.tags.push(res.url);
        // Reset form.
        editSupply.tag.name="";
        editSupply.tagIsCollapsed = true;
        $timeout();
      }, e => console.error);
    };

    editSupply.ok = function () {
      //Submit the form.
      APIFactory.editCostumeElement(editSupply.costumeelement)
      .then((res) => { 
        // Emit the newly created supply to the costume controller.
        console.log("edited supply", res);
        $scope.$emit("editedSupply", res);
      }, e => console.error);
        //Close modal.
      $uibModalInstance.close();
    };

    editSupply.cancel = function () {
      // Closes the modal, doing nothing.
      $uibModalInstance.dismiss("cancel");
    };
  }]);
