AFRAME.registerComponent("assign-pathway", {
    schema: {
        pathway: { type: 'string', default: "" },
        target: { type: 'string', default: "network-view" }
    },
    init: function () {
        this.el.addEventListener('click', () => {
            let component = this.el.getAttribute("assign-pathway");
            let pathway = component.pathway;
            if (!pathway) {
                console.log("pathway not set on assign-pathway component");
                return;
            }
            console.log("setting pathway to: " + pathway);
            let target = document.querySelector(component.target);
            target.setAttribute("network-view", "activePathway:" + pathway);
        });
    }
})
