AFRAME.registerComponent("highlight-button-behavior", {
    schema: {
        sequence: { type: 'string', default: "" }
    },

    init: function () {
        this.states = { DEFAULT: 1, HIGHLIGHTED: 2, OUTLINED: 0 };
        this.state = this.states.DEFAULT;
        this.num_states = Object.keys(this.states).length;
        this.clickListener = this.clickListener.bind(this);
        this.grabEdges = this.grabEdges.bind(this);
        this.grabNodesFromEdges = this.grabNodesFromEdges.bind(this);
        this.changeMaterialColor = this.changeMaterialColor.bind(this);
        this.downgrade = this.downgrade.bind(this);
        this.el.addEventListener("click", this.clickListener);
        this.highlightColor = "#182BEF";
        this.defaultColor = "#B1B1B1";
        this.outlineColor = "#F2994A";
    },

    clickListener: function (e) {
        this.state = (this.state + 1) % this.num_states;

        let edges = this.grabEdges();
        let nodes = this.grabNodesFromEdges(edges);

        try {
            //may be able to cache elements on init instead of finding them on click every time
            switch (this.state) {
                case this.states.DEFAULT:
                    for (edge of edges) {
                        const element = Model.fetchEdge(edge.input, edge.output);
                        console.log('highlighting ' + edge.input + "/" + edge.output)
                        element.components["highlight-behavior"].RemoveOutline();
                        element.components["highlight-behavior"].DecrementHighlightCounter();
                    }
                    for (node of nodes) {
                        const element = Model.fetchNode(node);
                        console.log('highlighting ', + node);
                        element.components["highlight-behavior"].RemoveOutline();
                        element.components["highlight-behavior"].DecrementHighlightCounter();
                    }
                    this.changeMaterialColor(this.defaultColor);
                    break;
                case this.states.HIGHLIGHTED:
                    for (edge of edges) {
                        const element = Model.fetchEdge(edge.input, edge.output);
                        element.components["highlight-behavior"].IncrementHighlightCounter();
                    }
                    for (node of nodes) {
                        const element = Model.fetchNode(node);
                        element.components["highlight-behavior"].IncrementHighlightCounter();
                    }
                    this.changeMaterialColor(this.highlightColor)
                    break;
                case this.states.OUTLINED:
                    for (button of document.querySelectorAll("[highlight-button-behavior]")) {
                        if (button.getAttribute("highlight-button-behavior").sequence !== this.data.sequence) {
                            button.components["highlight-button-behavior"].downgrade();
                        }
                    }
                    for (edge of edges) {
                        const element = Model.fetchEdge(edge.input, edge.output);
                        element.components["highlight-behavior"].Outline();
                    }
                    for (node of nodes) {
                        const element = Model.fetchNode(node);
                        element.components["highlight-behavior"].Outline();
                    }
                    this.changeMaterialColor(this.outlineColor);
                    break;
            }
        } catch (e) {
            console.log(e.message);
        }
    },

    downgrade: function () {
        let edges = this.grabEdges();
        let nodes = this.grabNodesFromEdges(edges);
        if (this.state === this.states.OUTLINED) {
            this.state = this.states.HIGHLIGHTED;
            for (edge of edges) {
                element = Model.fetchEdge(edge.input, edge.output);
                element.components["highlight-behavior"].RemoveOutline();
            }
            for (node of nodes) {
                element = Model.fetchNode(node);
                element.components["highlight-behavior"].RemoveOutline();
            }
            this.changeMaterialColor(this.highlightColor);
        }
    },

    grabEdges() {
        return Model.pathways[this.data.sequence];
    },

    grabNodesFromEdges(edges) {
        nodes = {};
        for (edge of edges) {
            if (!!!nodes[edge.input]) {
                nodes[edge.input] = edge.input;
            }
            if (!!!nodes[edge.output]) {
                nodes[edge.output] = edge.output;
            }
        }
        return Object.keys(nodes);
    },

    changeMaterialColor: function (color) {
        this.el.setAttribute("material", { color: color });
        let elements = this.el.querySelectorAll(".gui-button");
        for (elem of elements) {
            elem.setAttribute("material", { color: color });
        }
        let text = this.el.querySelector(".gui-text");
        switch (this.state) {
            case this.states["DEFAULT"]:
                text.setAttribute("material", { color: "black", emissive: "#000" });
                break;
            case this.states["HIGHLIGHTED"]:
                console.log('highlight button');
                text.setAttribute("material", { color: "white", emissive: "#fff" });
                break;
            case this.states["OUTLINED"]:
                text.setAttribute("material", {
                    color: "black", emissive: "#000"
                });
                break;
        }
    }
})