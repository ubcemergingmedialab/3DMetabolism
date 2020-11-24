UIPresenter = function(pathway, sequence) {
    this.scene = document.getElementById('gyro');
    this.pathway = pathway
    this.sequence = sequence;
    const STRING_LEN_MAX = 19

    //private
    function initMenu() {
        this.entity = document.createElement('a-entity');
        this.entity.setAttribute('opacity','1')
        this.entity.setAttribute('position', '-6 8 2');
        const parentFlexContainer = createFlexContainers();
        this.entity.appendChild(parentFlexContainer);
        this.scene.appendChild(this.entity)
    }

    //private
    //flex containers need to be readjusted
    function createFlexContainers() {
        const parentFlexContainter = document.createElement('a-gui-flex-container');
        const parentColumnContainer = document.createElement('a-gui-flex-container');
        const childHighlightFlexContainer = document.createElement('a-gui-flex-container');
        const childAnimationsFlexContainer = document.createElement('a-gui-flex-container');
        const childToggleLabelFlexContainer = document.createElement('a-gui-flex-container');
        parentFlexContainter.appendChild(parentColumnContainer);
        parentColumnContainer.appendChild(childHighlightFlexContainer);
        parentColumnContainer.appendChild(childAnimationsFlexContainer)
        parentColumnContainer.appendChild(createSecondaryMenu())
        childHighlightFlexContainer.appendChild(childToggleLabelFlexContainer)

        parentFlexContainter.setAttribute('flex-direction','row')
        parentFlexContainter.setAttribute('position','15 -5.5 0')

        parentColumnContainer.setAttribute('align-items','normal')
        parentColumnContainer.setAttribute('justify-content','center')
        parentColumnContainer.setAttribute('opacity','0.5')
        parentColumnContainer.setAttribute('flex-direction','row')

        childToggleLabelFlexContainer.setAttribute('flex-direction','column')
        childToggleLabelFlexContainer.setAttribute('justify-content','center')
        childToggleLabelFlexContainer.setAttribute('align-items','normal')
        childToggleLabelFlexContainer.setAttribute('opacity','0')
        childToggleLabelFlexContainer.setAttribute('width','3')
        childToggleLabelFlexContainer.setAttribute('height','1')
        childToggleLabelFlexContainer.appendChild(createLabelToggleButton())

        childAnimationsFlexContainer.setAttribute('flex-direction','column');
        childAnimationsFlexContainer.setAttribute('justify-content','center')
        childAnimationsFlexContainer.setAttribute('align-items','normal');
        childAnimationsFlexContainer.setAttribute('component-padding','0.1');
        childAnimationsFlexContainer.setAttribute('opacity','0');
        childAnimationsFlexContainer.setAttribute('width','0.75');
        childAnimationsFlexContainer.setAttribute('height','5');
        childAnimationsFlexContainer.setAttribute('position','0.5 0 0');
        childAnimationsFlexContainer.setAttribute('visible', 'true');
        attachButtons(childAnimationsFlexContainer, createAnimationButton)

        childHighlightFlexContainer.setAttribute('flex-direction','column');
        childHighlightFlexContainer.setAttribute('justify-content','center')
        childHighlightFlexContainer.setAttribute('align-items','normal')
        childHighlightFlexContainer.setAttribute('opacity','0.2');
        childHighlightFlexContainer.setAttribute('width','4.5');
        childHighlightFlexContainer.setAttribute('height', '6.5');
        childHighlightFlexContainer.setAttribute('visible','true');
        attachButtons(childHighlightFlexContainer, createHighlightButton)
        return parentFlexContainter;
    }

    //private
    function attachButtons(flexContainer, buttonType) {
        for(const key in this.pathway) {
            if(key === undefined) {continue}
            if(key === "oxidative_phosphorylation") {continue}
            const button = buttonType(key)
            flexContainer.appendChild(button)
        }
    }

    //private
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

    //private
    function createAnimationButton(pathway, sequence) {
        const button = document.createElement('a-gui-icon-label-button');
        button.setAttribute('class','interactible')
        button.setAttribute('width','0.5')
        button.setAttribute('height','0.5')
        button.setAttribute('active-color','#d1d1d1')
        button.setAttribute('background-color','#d1d1d1')
        button.setAttribute('hover-color','#d1d1d1')
        button.setAttribute('margin','0 0 0.05 0')
        button.setAttribute('icon','chevron-right')
        button.setAttribute('visible','true')
        button.setAttribute('toggle','true')
        button.setAttribute('id',pathway + "_animation_button")
        button.setAttribute('toggledropdown','target:#container-'+pathway+"-dynamic-menu")
        return button
    }

    //private
    function createHighlightButton(pathway) {
        const button = document.createElement('a-gui-button');
        button.setAttribute('class','interactible')
        button.setAttribute('width','3')
        button.setAttribute('height','0.5')
        button.setAttribute('margin','0 0 0.05 0')
        button.setAttribute('hover-color','#B1B1B1')
        button.setAttribute('background-color','#B1B1B1')
        button.setAttribute('font-color','#000000')
        button.setAttribute('font-family','Helvetica')
        button.setAttribute('highlight-button-behavior','sequence:' + pathway)
        button.setAttribute('value',pathway.replaceAll("_"," "))
        button.setAttribute('id',pathway + "highlight_button")
        if(pathway.length > STRING_LEN_MAX) { button.setAttribute('font-size','120px') }
        return button
    }

    //for now it is currently creating just one secondary menu for gluconeogenesis
    function createSecondaryMenu() {
        const parentFlexContainer = document.createElement('a-gui-flex-container')
        const containerGluco = document.createElement('a-gui-flex-container')
        parentFlexContainer.appendChild(containerGluco)

        parentFlexContainer.setAttribute('flex-direction','column')
        parentFlexContainer.setAttribute('width','4')
        parentFlexContainer.setAttribute('height','7.65')
        parentFlexContainer.setAttribute('visible','true')
        parentFlexContainer.setAttribute('opacity','0')
        parentFlexContainer.setAttribute('align-items','normal')
        parentFlexContainer.setAttribute('justify-content','center')

        containerGluco.setAttribute('id','container-gluconeogenesis-dynamic-menu')
        containerGluco.setAttribute('flex-direction','column')
        containerGluco.setAttribute('justify-content','flexStart')
        containerGluco.setAttribute('align-items','flexStart')
        containerGluco.setAttribute('component-padding','0.1')
        containerGluco.setAttribute('opacity','0')
        containerGluco.setAttribute('width','0.75')
        containerGluco.setAttribute('height','0.75')
        containerGluco.setAttribute('visible','false')
        containerGluco.setAttribute('animation__drop2',{
            property:'visible',
            startEvents:'opendropdown',
            dur:100,
            to: true
        });
        containerGluco.setAttribute('animation__back2',{
            property:'visible',
            startEvents:'closedropdown',
            dur:1000,
            to: false
        });

        const glucoAnimationButton1 = document.createElement('a-gui-button')
        const glucoAnimationButton2 = document.createElement('a-gui-button')
        containerGluco.appendChild(glucoAnimationButton1)
        containerGluco.appendChild(glucoAnimationButton2)

        glucoAnimationButton1.setAttribute('id','gluconeogenesis-animation-1')
        glucoAnimationButton1.setAttribute('class','interactible')
        glucoAnimationButton1.setAttribute('value','Glycerol to Glucose')
        glucoAnimationButton1.setAttribute('width','3')
        glucoAnimationButton1.setAttribute('height','0.5')
        glucoAnimationButton1.setAttribute('font-family','Helvetica')
        glucoAnimationButton1.setAttribute('margin','0 0 0.05 0')
        glucoAnimationButton1.setAttribute('animation-button-behavior','sequence:1')
        glucoAnimationButton2.setAttribute('id','gluconeogenesis-animation-2')
        glucoAnimationButton2.setAttribute('class','interactible')
        glucoAnimationButton2.setAttribute('value','Lactate to Glucose')
        glucoAnimationButton2.setAttribute('width','3')
        glucoAnimationButton2.setAttribute('height','0.5')
        glucoAnimationButton2.setAttribute('font-family','Helvectica')
        glucoAnimationButton2.setAttribute('margin','0 0 0.05 0')
        glucoAnimationButton2.setAttribute('animation-button-behavior','sequence:2')
        return parentFlexContainer
    }

    initMenu();
}