UIPresenter = function(pathway, sequence) {
    this.scene = document.getElementById('gyro');
    this.pathway = pathway;
    this.sequence = sequence;

    //private
    function initMenu() {
        this.entity = document.createElement('a-entity');
        this.entity.setAttribute('opacity','1')
        this.entity.setAttribute('position', '-6 8 2');
        const flexContainer = createFlexContainers();
        this.entity.appendChild(flexContainer);
        this.scene.appendChild(this.entity)
    }


    //private
    function createFlexContainers() {
        const parentFlexContainter = document.createElement('a-gui-flex-container');
        const childHighlightFlexContainer = document.createElement('a-gui-flex-container');
        const childAnimationsFlexContainer = document.createElement('a-gui-flex-container');
        const childToggleLabelFlexContainer = document.createElement('a-gui-flex-container');

        const parentColumnContainer = document.createElement('a-gui-flex-container');
        parentColumnContainer.setAttribute('opacity','0.5')
        parentColumnContainer.setAttribute('flex-direction','row')

        parentFlexContainter.appendChild(parentColumnContainer);
        parentColumnContainer.appendChild(childHighlightFlexContainer);
        parentColumnContainer.appendChild(childAnimationsFlexContainer)
        childHighlightFlexContainer.appendChild(childToggleLabelFlexContainer)
        // parentFlexContainter.appendChild(childToggleLabelFlexContainer);
        // parentFlexContainter.appendChild(childAnimationsFlexContainer);
        childAnimationsFlexContainer.append(createAnimationButton())
        // parentFlexContainter.setAttribute('flex-direction','row');
        childToggleLabelFlexContainer.appendChild(createLabelToggleButton())

        parentFlexContainter.setAttribute('flex-direction','row')
        parentFlexContainter.setAttribute('position','15 -5.5 0')

        parentColumnContainer.setAttribute('align-items','normal')
        parentColumnContainer.setAttribute('justify-content','center')

        childToggleLabelFlexContainer.setAttribute('flex-direction','column')
        childToggleLabelFlexContainer.setAttribute('align-items','normal')
        childToggleLabelFlexContainer.setAttribute('justify-content','center')
        childToggleLabelFlexContainer.setAttribute('opacity','0')
        childToggleLabelFlexContainer.setAttribute('width','3')
        childToggleLabelFlexContainer.setAttribute('height','1')

        childAnimationsFlexContainer.setAttribute('flex-direction','column');
        childAnimationsFlexContainer.setAttribute('justify-content','center')
        childAnimationsFlexContainer.setAttribute('align-items','normal');
        childAnimationsFlexContainer.setAttribute('component-padding','0.1');
        childAnimationsFlexContainer.setAttribute('opacity','0');
        childAnimationsFlexContainer.setAttribute('width','0.75');
        childAnimationsFlexContainer.setAttribute('height','5');
        childAnimationsFlexContainer.setAttribute('position','0.5 0 0');
        childAnimationsFlexContainer.setAttribute('visible', 'true');

        childHighlightFlexContainer.setAttribute('flex-direction','column');
        childHighlightFlexContainer.setAttribute('visible','true');
        childHighlightFlexContainer.setAttribute('opacity','0.2');
        childHighlightFlexContainer.setAttribute('width','4.5');
        childHighlightFlexContainer.setAttribute('height', '6.5');
        childHighlightFlexContainer.setAttribute('justify-content','center')
        childHighlightFlexContainer.setAttribute('align-items','normal')

        attachButtons(childHighlightFlexContainer, createHighlightButton)
        attachButtons(childAnimationsFlexContainer, createAnimationButton)
        return parentFlexContainter;
    }


    //private
    function attachButtons(flexContainer, buttonType) {
        for(var key in this.pathway) {
            const button = buttonType(key)
            flexContainer.appendChild(button)
        }
    }

    function createLabelToggleButton() {
        const button = document.createElement('a-gui-toggle');
        button.setAttribute('position','0 0 0')
        button.setAttribute('class','interactible');
        button.setAttribute('width','2.5')
        button.setAttribute('height','0.75');
        button.setAttribute('onclick', 'toggleLabel')
        button.setAttribute('value','hide labels')
        button.setAttribute('font-family','Arial')
        button.setAttribute('margin','0 0 0.05 0')
        button.setAttribute('id','label-toggle')
        return button
    }

    function createAnimationButton(pathway, sequence) {
        const button = document.createElement('a-gui-button');
        button.setAttribute('height','0.5')
        button.setAttribute('width','0.5')
        button.setAttribute('class','interactible')
        button.setAttribute('active-color','#d1d1d1')
        button.setAttribute('background-color','#d1d1d1')
        button.setAttribute('hover-color','#d1d1d1')
        button.setAttribute('margin','0 0 0.05 0')
        button.setAttribute('icon','chevron-right')
        button.setAttribute('visible','true')
        button.setAttribute('toggle','true')
        return button

    }
    //private
    function createHighlightButton(pathway) {
        const button = document.createElement('a-gui-button');
        button.setAttribute('class','interactible')
        button.setAttribute('font-family','Helvetica')
        button.setAttribute('width','3')
        button.setAttribute('height','0.5')
        button.setAttribute('margin','0 0 0.05 0')
        button.setAttribute('hover-color','#B1B1B1')
        button.setAttribute('background-color','#B1B1B1')
        button.setAttribute('font-color','#000000')
        button.setAttribute('highlight-button-behavior','sequence:' + pathway)
        button.setAttribute('value',pathway.replaceAll("_"," "))
        button.setAttribute('id',pathway + "_button")
        return button
    }

    initMenu();
}