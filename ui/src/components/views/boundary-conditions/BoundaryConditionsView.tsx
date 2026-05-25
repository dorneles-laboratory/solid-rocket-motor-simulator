import sttles from './BoundaryConditionsView.module.css';

export default function BoundaryConditionsView() {
  return (
    <div className={sttles.boundary_conditions_view}>
      <h1>Boundary Conditions</h1>
      <p>
        This section will allow you to define the boundary conditions for your simulation. You will be able to specify the initial conditions, such as pressure and temperature, as well as the boundary conditions for the flow field. This will help you set up your simulation accurately and ensure that you get meaningful results.
      </p>
    </div>
  )
}