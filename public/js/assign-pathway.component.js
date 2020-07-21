AFRAME.registerComponent("assign-pathway", {
    schema: {
        pathway: {type: 'string', default: ""},
        target: {type: 'string', default: "[presenter]"}
    },
    init: function() {
        this.el.addEventListener('click', () => {
            let component = this.el.getAttribute("assign-pathway");
            let pathway = component.pathway;
            console.log("setting pathway to: " + pathway);
            let target = document.querySelector(component.target);
            target.setAttribute("presenter", "activePathway:" + pathway);
        });
    }
})
