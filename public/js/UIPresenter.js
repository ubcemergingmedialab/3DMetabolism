UIPresenter = function(pathway, sequence) {
    this.scene = document.getElementById('gyro');
    this.pathway = pathway;
    this.sequence = sequence;

    //private
    function initMenu() {
        this.entity = document.createElement('a-entity');
        this.entity.setAttribute('position', '-6 8 2');
        const flexContainer = createFlexContainer();
        this.entity.appendChild(flexContainer);
        this.scene.appendChild(this.entity)
    }

    //private
    function attachButtons(flexContainer) {
        for(var key in this.pathway) {
            const button = createHighlightButton(key)
            flexContainer.appendChild(button)
        }
    }

    //private
    function createFlexContainer() {
        const menuFlexContainter = document.createElement('a-gui-flex-container')
        const highlightFlexContainer = document.createElement('a-gui-flex-container')
        menuFlexContainter.setAttribute('flex-direction','row');
        highlightFlexContainer.setAttribute('flex-direction','column');
        highlightFlexContainer.setAttribute('visible','true');
        highlightFlexContainer.setAttribute('opacity','0.2');
        highlightFlexContainer.setAttribute('width','4.5');
        highlightFlexContainer.setAttribute('height', '6.5');
        highlightFlexContainer.setAttribute('justify-content','center')
        highlightFlexContainer.setAttribute('align-items','normal')
        attachButtons(highlightFlexContainer)
        menuFlexContainter.appendChild(highlightFlexContainer);
        return menuFlexContainter;
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