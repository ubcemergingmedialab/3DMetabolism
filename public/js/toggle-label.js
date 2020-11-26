function toggleLabel(show, type) {
  const nodes = Model.nodes;
  Object.keys(nodes).forEach((node) => {
    const elem = Model.fetchNode(node);
    if (elem) {
      const labelBehaviorComponent = elem.components['label-behavior'];
      if (type === "highlighted") {
        labelBehaviorComponent && elem.getAttribute("highlighted") ? labelBehaviorComponent.Enable() : labelBehaviorComponent.Disable();
      } else {
        labelBehaviorComponent && show ? labelBehaviorComponent.Disable() : labelBehaviorComponent.Enable();
      }
    } else {
      console.log("could not find node named " + node);
    }
  })
}
