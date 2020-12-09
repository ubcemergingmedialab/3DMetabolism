function toggleLabel(show, type) {
  const nodes = Model.nodes;
  Object.keys(nodes).forEach((node) => {
    const elem = Model.fetchNode(node);
    if (elem) {
      const labelBehaviorComponent = elem.components['label-behavior'];
      if (labelBehaviorComponent) {
        if (type === "highlighted") {
          elem.getAttribute("highlighted") ? labelBehaviorComponent.Enable() : labelBehaviorComponent.Disable();
        } else {
          show ? labelBehaviorComponent.Disable() : labelBehaviorComponent.Enable();
        }
      }
    } else {
      console.log("could not find node named " + node);
    }
  })
}
