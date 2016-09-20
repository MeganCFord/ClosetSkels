
    create.createElement = (ceindex=null) => {
      console.log("supply index in create element", ceindex);
      APIFactory.createElement(create.element).then((res) => {
        create.elements.push(res);
        if(ceindex===null) {
          create.costumeelement.element = res.url;
          create.elementIsCollapsed = true;
        } else {
          create.costumeelements[ceindex].element = res.url;
          create.editelementIsCollapsed = true;
        }
        create.element.name = "";
        $timeout();
      });
    };

    create.createCostumeElement = () => {
      APIFactory.createCostumeElement(create.costumeelement).then((res) => {
        create.costumeelements.push(res);
        create.costume.costumeelements.push(res.url);
        create.costumeelement = {"costume": "", "element": "", "description": "", "tags": []};
        $timeout();

      });
    };
