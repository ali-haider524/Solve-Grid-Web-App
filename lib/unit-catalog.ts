export type UnitCategoryKey =
  | "length"
  | "area"
  | "volume"
  | "mass"
  | "temperature"
  | "time"
  | "speed"
  | "acceleration"
  | "angle"
  | "data"
  | "force"
  | "pressure"
  | "energy"
  | "power"
  | "torque"
  | "frequency"
  | "density";

export type UnitDefinition = {
  id: string;
  label: string;
  symbol?: string;
  factor?: number;
  toBase?: (value: number) => number;
  fromBase?: (value: number) => number;
};

export type UnitCategory = {
  label: string;
  description: string;
  baseLabel: string;
  units: UnitDefinition[];
};

const linear = (id: string, label: string, factor: number, symbol?: string): UnitDefinition => ({
  id,
  label,
  symbol,
  factor,
});

export const unitCategories: Record<UnitCategoryKey, UnitCategory> = {
  length: {
    label: "Length",
    description: "Distance and linear measurement.",
    baseLabel: "metre",
    units: [
      linear("m", "Metres", 1, "m"), linear("km", "Kilometres", 1000, "km"), linear("cm", "Centimetres", 0.01, "cm"), linear("mm", "Millimetres", 0.001, "mm"), linear("um", "Micrometres", 0.000001, "µm"), linear("mi", "Miles", 1609.344, "mi"), linear("yd", "Yards", 0.9144, "yd"), linear("ft", "Feet", 0.3048, "ft"), linear("in", "Inches", 0.0254, "in"), linear("nmi", "Nautical miles", 1852, "nmi"),
    ],
  },
  area: {
    label: "Area",
    description: "Surface area and land measurement.",
    baseLabel: "square metre",
    units: [
      linear("m2", "Square metres", 1, "m²"), linear("km2", "Square kilometres", 1_000_000, "km²"), linear("cm2", "Square centimetres", 0.0001, "cm²"), linear("mm2", "Square millimetres", 0.000001, "mm²"), linear("ft2", "Square feet", 0.09290304, "ft²"), linear("yd2", "Square yards", 0.83612736, "yd²"), linear("acre", "Acres", 4046.8564224, "ac"), linear("ha", "Hectares", 10000, "ha"),
    ],
  },
  volume: {
    label: "Volume",
    description: "Liquid and three-dimensional volume.",
    baseLabel: "litre",
    units: [
      linear("l", "Litres", 1, "L"), linear("ml", "Millilitres", 0.001, "mL"), linear("m3", "Cubic metres", 1000, "m³"), linear("cm3", "Cubic centimetres", 0.001, "cm³"), linear("gal-us", "US gallons", 3.785411784, "gal"), linear("gal-uk", "UK gallons", 4.54609, "gal"), linear("qt-us", "US quarts", 0.946352946, "qt"), linear("pt-us", "US pints", 0.473176473, "pt"), linear("cup-us", "US cups", 0.2365882365, "cup"),
    ],
  },
  mass: {
    label: "Mass",
    description: "Mass and weight units.",
    baseLabel: "kilogram",
    units: [
      linear("kg", "Kilograms", 1, "kg"), linear("g", "Grams", 0.001, "g"), linear("mg", "Milligrams", 0.000001, "mg"), linear("t", "Metric tonnes", 1000, "t"), linear("lb", "Pounds", 0.45359237, "lb"), linear("oz", "Ounces", 0.028349523125, "oz"), linear("stone", "Stones", 6.35029318, "st"),
    ],
  },
  temperature: {
    label: "Temperature",
    description: "Temperature scales with different zero points.",
    baseLabel: "Celsius",
    units: [
      { id: "c", label: "Celsius", symbol: "°C", toBase: (value) => value, fromBase: (value) => value },
      { id: "f", label: "Fahrenheit", symbol: "°F", toBase: (value) => ((value - 32) * 5) / 9, fromBase: (value) => (value * 9) / 5 + 32 },
      { id: "k", label: "Kelvin", symbol: "K", toBase: (value) => value - 273.15, fromBase: (value) => value + 273.15 },
      { id: "r", label: "Rankine", symbol: "°R", toBase: (value) => ((value - 491.67) * 5) / 9, fromBase: (value) => (value + 273.15) * 9 / 5 },
    ],
  },
  time: {
    label: "Time",
    description: "Time intervals and durations.",
    baseLabel: "second",
    units: [
      linear("ns", "Nanoseconds", 1e-9, "ns"), linear("us", "Microseconds", 1e-6, "µs"), linear("ms", "Milliseconds", 0.001, "ms"), linear("s", "Seconds", 1, "s"), linear("min", "Minutes", 60, "min"), linear("h", "Hours", 3600, "h"), linear("day", "Days", 86400, "d"), linear("week", "Weeks", 604800, "wk"), linear("year", "Julian years", 31557600, "yr"),
    ],
  },
  speed: {
    label: "Speed",
    description: "Distance travelled per unit time.",
    baseLabel: "metre per second",
    units: [
      linear("mps", "Metres per second", 1, "m/s"), linear("kph", "Kilometres per hour", 1 / 3.6, "km/h"), linear("mph", "Miles per hour", 0.44704, "mph"), linear("fps", "Feet per second", 0.3048, "ft/s"), linear("knot", "Knots", 0.5144444444, "kn"), linear("mach", "Mach (standard reference)", 340.29, "Ma"),
    ],
  },
  acceleration: {
    label: "Acceleration",
    description: "Rate of change of speed.",
    baseLabel: "metre per second squared",
    units: [
      linear("mps2", "Metres per second²", 1, "m/s²"), linear("fps2", "Feet per second²", 0.3048, "ft/s²"), linear("g0", "Standard gravity", 9.80665, "g"),
    ],
  },
  angle: {
    label: "Angle",
    description: "Angular measurement for geometry and engineering.",
    baseLabel: "radian",
    units: [
      linear("rad", "Radians", 1, "rad"), linear("deg", "Degrees", Math.PI / 180, "°"), linear("grad", "Gradians", Math.PI / 200, "gon"), linear("turn", "Turns", Math.PI * 2, "turn"), linear("arcmin", "Arc minutes", Math.PI / 10800, "′"), linear("arcsec", "Arc seconds", Math.PI / 648000, "″"),
    ],
  },
  data: {
    label: "Digital storage",
    description: "Decimal and binary digital storage.",
    baseLabel: "byte",
    units: [
      linear("bit", "Bits", 0.125, "bit"), linear("byte", "Bytes", 1, "B"), linear("kb", "Kilobytes", 1000, "KB"), linear("mb", "Megabytes", 1_000_000, "MB"), linear("gb", "Gigabytes", 1_000_000_000, "GB"), linear("tb", "Terabytes", 1_000_000_000_000, "TB"), linear("kib", "Kibibytes", 1024, "KiB"), linear("mib", "Mebibytes", 1_048_576, "MiB"), linear("gib", "Gibibytes", 1_073_741_824, "GiB"),
    ],
  },
  force: {
    label: "Force",
    description: "Force in mechanics and engineering.",
    baseLabel: "newton",
    units: [
      linear("n", "Newtons", 1, "N"), linear("kn", "Kilonewtons", 1000, "kN"), linear("lbf", "Pound-force", 4.4482216152605, "lbf"), linear("dyn", "Dynes", 0.00001, "dyn"),
    ],
  },
  pressure: {
    label: "Pressure",
    description: "Pressure and stress units.",
    baseLabel: "pascal",
    units: [
      linear("pa", "Pascals", 1, "Pa"), linear("kpa", "Kilopascals", 1000, "kPa"), linear("mpa", "Megapascals", 1_000_000, "MPa"), linear("bar", "Bar", 100000, "bar"), linear("atm", "Standard atmosphere", 101325, "atm"), linear("psi", "Pounds per square inch", 6894.757293168, "psi"), linear("mmhg", "Millimetres of mercury", 133.322387415, "mmHg"),
    ],
  },
  energy: {
    label: "Energy",
    description: "Energy, heat, and electrical energy.",
    baseLabel: "joule",
    units: [
      linear("j", "Joules", 1, "J"), linear("kj", "Kilojoules", 1000, "kJ"), linear("mj", "Megajoules", 1_000_000, "MJ"), linear("wh", "Watt-hours", 3600, "Wh"), linear("kwh", "Kilowatt-hours", 3_600_000, "kWh"), linear("cal", "Calories", 4.184, "cal"), linear("kcal", "Kilocalories", 4184, "kcal"), linear("btu", "BTU (IT)", 1055.05585262, "BTU"),
    ],
  },
  power: {
    label: "Power",
    description: "Rate of energy transfer.",
    baseLabel: "watt",
    units: [
      linear("w", "Watts", 1, "W"), linear("kw", "Kilowatts", 1000, "kW"), linear("mw", "Megawatts", 1_000_000, "MW"), linear("hp", "Mechanical horsepower", 745.699871582, "hp"), linear("btu-h", "BTU per hour", 0.293071070172, "BTU/h"),
    ],
  },
  torque: {
    label: "Torque",
    description: "Rotational force.",
    baseLabel: "newton metre",
    units: [
      linear("nm", "Newton metres", 1, "N·m"), linear("knm", "Kilonewton metres", 1000, "kN·m"), linear("lbft", "Pound-feet", 1.3558179483314, "lb·ft"), linear("lbin", "Pound-inches", 0.11298482902762, "lb·in"),
    ],
  },
  frequency: {
    label: "Frequency",
    description: "Cycles per unit time.",
    baseLabel: "hertz",
    units: [
      linear("hz", "Hertz", 1, "Hz"), linear("khz", "Kilohertz", 1000, "kHz"), linear("mhz", "Megahertz", 1_000_000, "MHz"), linear("ghz", "Gigahertz", 1_000_000_000, "GHz"), linear("rpm", "Revolutions per minute", 1 / 60, "rpm"),
    ],
  },
  density: {
    label: "Density",
    description: "Mass per unit volume.",
    baseLabel: "kilogram per cubic metre",
    units: [
      linear("kgm3", "Kilograms per cubic metre", 1, "kg/m³"), linear("gcm3", "Grams per cubic centimetre", 1000, "g/cm³"), linear("kgL", "Kilograms per litre", 1000, "kg/L"), linear("lbft3", "Pounds per cubic foot", 16.01846337396, "lb/ft³"), linear("lbgal", "Pounds per US gallon", 119.826427316, "lb/gal"),
    ],
  },
};

export const unitCategoryKeys = Object.keys(unitCategories) as UnitCategoryKey[];

export function isUnitCategoryKey(value: string | null): value is UnitCategoryKey {
  return Boolean(value && value in unitCategories);
}

export function convertUnit(value: number, category: UnitCategoryKey, fromId: string, toId: string) {
  const categoryDefinition = unitCategories[category];
  const from = categoryDefinition.units.find((unit) => unit.id === fromId);
  const to = categoryDefinition.units.find((unit) => unit.id === toId);
  if (!from || !to) return Number.NaN;

  const baseValue = from.toBase ? from.toBase(value) : value * (from.factor ?? 1);
  return to.fromBase ? to.fromBase(baseValue) : baseValue / (to.factor ?? 1);
}
