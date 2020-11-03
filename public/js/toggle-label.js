let checked = false;

function toggleLabel() {
  checked = !checked;
  const nodes = View.nodes;
  Object.keys(nodes).forEach((node) => {
    const elem = View.fetchNode(node);
    if (elem) {
      const labelBehaviorComponent = elem.components['label-behavior'];
      labelBehaviorComponent && checked ? labelBehaviorComponent.Disable() : labelBehaviorComponent.Enable();
    } else {
      console.log("could not find node named " + node);
    }
  })
}
