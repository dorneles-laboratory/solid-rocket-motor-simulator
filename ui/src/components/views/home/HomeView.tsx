import styles from "./HomeView.module.css"

export default function HomeView() {
  return (
    <div className={styles.home_container}>
      <h1>Welcome to the Solid Rocket Motor Simulator</h1>
      <p>
        This application allows you to simulate the performance of solid rocket motors based on various propellant formulations and motor geometries. Use the sidebar to navigate through different sections and start exploring the capabilities of the simulator.
      </p>
    </div>
  )
}