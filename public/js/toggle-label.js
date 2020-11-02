let checked = false;

function toggleLabel() {
  checked = !checked;
  const edges = View.all_edges;
  Object.values(edges).forEach((edge) => {
    const elem = document.getElementById(edge.input + '/' + edge.output);
    if (elem) {
      const labelBehaviorComponent = elem.components['label-behavior'];
      checked ? labelBehaviorComponent.Disable() : labelBehaviorComponent.Enable();
    }
  })
}