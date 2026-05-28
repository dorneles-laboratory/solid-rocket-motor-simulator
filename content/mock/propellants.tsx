interface Propellant {
  id: string
  name: string
  density: number
  burnRateA: number
  burnRateN: number
  theoreticalIsp: number
  type: string
}

const mockPropellants: Propellant[] = [
  {
    id: "1",
    name: "KNSB Fine",
    density: 1.841,
    burnRateA: 8.26,
    burnRateN: 0.319,
    theoreticalIsp: 164,
    type: "Sugar",
  },
  {
    id: "2",
    name: "KNDX Coarse",
    density: 1.879,
    burnRateA: 5.13,
    burnRateN: 0.220,
    theoreticalIsp: 177,
    type: "Sugar",
  },
  {
    id: "3",
    name: "KNSU",
    density: 1.889,
    burnRateA: 8.26,
    burnRateN: 0.319,
    theoreticalIsp: 166,
    type: "Sugar",
  },
  {
    id: "4",
    name: "KNER",
    density: 1.820,
    burnRateA: 7.55,
    burnRateN: 0.305,
    theoreticalIsp: 158,
    type: "Sugar",
  },
  {
    id: "5",
    name: "APCP 70/15/15",
    density: 1.750,
    burnRateA: 3.84,
    burnRateN: 0.380,
    theoreticalIsp: 265,
    type: "Composite",
  },
  {
    id: "6",
    name: "APCP 80/10/10",
    density: 1.820,
    burnRateA: 4.21,
    burnRateN: 0.410,
    theoreticalIsp: 275,
    type: "Composite",
  },
  {
    id: "7",
    name: "APCP Blue Thunder",
    density: 1.790,
    burnRateA: 5.10,
    burnRateN: 0.350,
    theoreticalIsp: 260,
    type: "Composite",
  },
  {
    id: "8",
    name: "KNSB Coarse",
    density: 1.750,
    burnRateA: 5.13,
    burnRateN: 0.220,
    theoreticalIsp: 164,
    type: "Sugar",
  },
]