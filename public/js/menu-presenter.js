function menuPresenter() {

    // var btn = document.createElement("BUTTON");   // Create a <button> element
    // btn.innerHTML = "CLICK ME";                   // Insert text
    // link.body.appendChild(btn);       

    function init() {
        window.onload = function() {
            private.initPathways();
        }
    }

    var public = {
        getHtml: function() {
            initHtml();
            this.getHtml()
        },

        pathwaysEventHandler: function(pathway) {
            

        }

    }
    var private = {
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
                this.updateSequence(sequence);
            } catch(e) {
                console.log("cannot create pathway associated sequence menu");
            }
        },

        updateSequence: function(sequence) {

        },

        initPathways: function() {
            let pathwayClass = document.getElementsByClassName("Pathways")[0];
            let btnAllPathways = document.createElement("button");
            let btnGluconeogenesis = document.createElement("button");
            let btnGlycolysis = document.createElement("button");

            // btnAllPathways.innerHTML("All Pathways");
            // btnGluconeogenesis.innerHTML("Gluconeogenesis");
            // btnGlycolysis.innerHTML("Glycolysis");

            pathwayClass.appendChild(btnAllPathways);
            pathwayClass.appendChild(btnGluconeogenesis);
            pathwayClass.appendChild(btnGlycolysis);

        }


    }
    var __buttonTemplate = function(buttonText){
        var btn = document.createElement("BUTTON");
        btn.innerHTML(buttonText);

    }

    //TODO: initHtml();
    //TODO: getHtml();
    //TODO: sequenceEventHandler();
    //TODO: removeHtml();

    init();
}