AFRAME.registerComponent("pathway_zoom", {
    schema: {},
    init: {
        //register click event that:
            //1 creates animation component string leaving "from" blank and setting "to" to
            //cylinder entity's position
            //2 finds drag-rotate-component and call function to de-register mousemove
            //3 registers another click function (might have to de-register the current one) that:
            //  1. creates animation component back to original camera position
            //  2. finds drag-rotate-component and call function to re-register mousemove
            //  3. re-register the click event above
    }
});