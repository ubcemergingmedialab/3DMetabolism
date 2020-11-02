let checked = false;

function toggleLabel() {
  checked = !checked;
  const nodes = View.nodes;
  Object.values(nodes).forEach((node) => {
    const elem = View.fetchNode(node.name);
    if (elem) {
      const labelBehaviorComponent = elem.components['label-behavior'];
      checked ? labelBehaviorComponent.Disable() : labelBehaviorComponent.Enable();
    }
  })
}