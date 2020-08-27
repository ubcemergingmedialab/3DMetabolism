function menuPresenter(view) {
    var view = View;  
    sequences = view.sequences  
    

    function init() {
        window.onload = function() {
            initialize.PathwaysSubMenu();

        }
    }

    /* The functions within initialize are used to initialize html elements*/
    var initialize = {
        PathwaysSubMenu: function() {
            let pathwayClass = document.getElementsByClassName("Pathways");
            this.createBtnPathway('btn_all_pathways','All Pathways', pathwayClass[0], 'all');
            this.createBtnPathway('btn_Gluconeogenesis','Gluconeogenesis',pathwayClass[0], 'gluconeogenesis');
            this.createBtnPathway('btn_glycolysis','Glycolysis',pathwayClass[0], 'glycolysis');
    
        },
        createBtnPathway: function(elementId, elementText, parentElement, updatePathwaysParam) {
            let btn = document.createElement("button");
            btn.setAttribute('id',elementId);
            btn.textContent = elementText;
            btn.addEventListener("click", () => {
                private.updatePathways(updatePathwaysParam);
            });
            parentElement.appendChild(btn);
        },

        createBtnSequence: function(elementId, elementText, parentElement) {
            let btn = document.createElement("button");
            btn.setAttribute('id',elementId);
            btn.textContent = elementText;
            btn.addEventListener("click", () => {
                alert("You pressed the button");
            });
            parentElement.appendChild(btn);
        }
    }
    /* The functions within private are intended for internal use only */
    var private = {

        /* updatePathways(pathway) will update the iframe scene as well as the Sequence sub-menu 
         *  with the associated pathway given
         */
        updatePathways: function(pathway) {
            try{ 
                let iframe = document.getElementById("scene-iframe");
                let target = iframe.contentWindow.document.getElementById("presenter");

                target.setAttribute("presenter", "activePathway:" + pathway);
                console.log("setting pathway to: " + pathway);
            } catch(e) {
                console.log("pathway not set on assign-pathway component");
            }
            try{
                this.updateSequenceSubMenu(pathway);
            } catch(e) {
                console.log("cannot create pathway associated sequence menu");
            }
        },

        /** updateSequenceSubMenu(pathway) will update the Sequence sub-menu 
         * according to the given pathway
         */
        updateSequenceSubMenu: function(pathway) {
            let sequencesClass = document.getElementsByClassName("Sequences"); 
            // if(sequencesClass.length){
            //     this.removeElementsByClass("Sequences");
            // }
            for (let sequence in sequences[pathway]) { 
               initialize.createBtnSequence(sequence,sequence,sequencesClass[0]);
            }

        },

        /** removeElementsByClass(className) removes all elements associated to className*/
        removeElementsByClass: function(className) {
            let elements = document.getElementsByClassName(className);
            while(elements[0]) {
                elements[0].remove()
            }
        }
    }
    init();
}